import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';
import { initialAdvisors, initialClients, initialAppointments, initialDocuments } from './mockData.ts';
import { 
  Appointment, 
  Client, 
  Advisor, 
  AppointmentDocument, 
  AppointmentStatus, 
  AdminAvailability, 
  DayAvailabilityStatus, 
  CustomTimeSlot, 
  UserProfile, 
  ChatRoom, 
  ChatMessage, 
  UserRole 
} from '../types.ts';
import { firestore } from '../lib/firebase.ts';

// Check if SQL database connection is configured
const databaseUrl = process.env.DATABASE_URL;
const hasIndividualConfig = Boolean(
  process.env.SQL_HOST &&
  process.env.SQL_USER &&
  process.env.SQL_PASSWORD &&
  process.env.SQL_DB_NAME
);

const hasSqlConfig = Boolean(databaseUrl || hasIndividualConfig);

export const createPool = () => {
  if (databaseUrl) {
    return new Pool({
      connectionString: databaseUrl,
      ssl: process.env.NODE_ENV === 'production' || databaseUrl.includes('supabase')
        ? { rejectUnauthorized: false }
        : false,
      connectionTimeoutMillis: 10000,
    });
  }

  return new Pool({
    host: process.env.SQL_HOST || 'localhost',
    user: process.env.SQL_USER || 'postgres',
    password: process.env.SQL_PASSWORD || '',
    database: process.env.SQL_DB_NAME || 'postgres',
    port: process.env.SQL_PORT ? parseInt(process.env.SQL_PORT) : 5432,
    connectionTimeoutMillis: 10000,
  });
};

let dbInstance: any = null;
if (hasSqlConfig) {
  try {
    const pool = createPool();
    pool.on('error', (err) => {
      console.warn('PostgreSQL Pool connection warning (using mock storage as fallback):', err.message);
    });
    dbInstance = drizzle(pool as any, { schema });
  } catch (err) {
    console.warn('Could not initialize PostgreSQL client, using in-memory store.');
  }
}

export const db = dbInstance;
export const isSqlActive = Boolean(dbInstance);

// In-Memory Data Store
class InMemoryStore {
  private advisors: Advisor[] = [...initialAdvisors];
  private clients: Client[] = [...initialClients];
  private appointments: Appointment[] = [...initialAppointments];
  private documents: AppointmentDocument[] = [...initialDocuments];
  private userCredentials: Map<string, { passwordHash: string; profile: UserProfile }> = new Map();
  private availabilities: Map<string, AdminAvailability> = new Map();
  
  // Real-Time Chat & Document Store
  private chatRooms: Map<string, ChatRoom> = new Map();
  private chatMessages: Map<string, ChatMessage[]> = new Map();
  private roomListeners: Map<string, Set<(event: { type: string; data?: any; roomId?: string }) => void>> = new Map();

  constructor() {
    // Initialized clean with demo data
  }

  getAdvisors(): Advisor[] {
    return [...this.advisors];
  }

  getAdvisorById(id: number): Advisor | undefined {
    return this.advisors.find(a => a.id === id);
  }

  getClients(search?: string): Client[] {
    if (!search) return [...this.clients].sort((a, b) => a.name.localeCompare(b.name));
    const term = search.toLowerCase();
    return this.clients
      .filter(c => 
        c.name.toLowerCase().includes(term) || 
        c.email.toLowerCase().includes(term) || 
        (c.company && c.company.toLowerCase().includes(term))
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  getClientById(id: number): Client | undefined {
    return this.clients.find(c => c.id === id);
  }

  getClientByEmail(email: string): Client | undefined {
    return this.clients.find(c => c.email.toLowerCase() === email.toLowerCase());
  }

  getClientByPhone(phone: string): Client | undefined {
    const clean = phone.replace(/\D/g, '');
    return this.clients.find(c => c.phone && c.phone.replace(/\D/g, '') === clean);
  }

  addClient(data: { name: string; email: string; phone?: string; company?: string; homeAddress?: string; sinceYear?: number; userId?: string }): Client {
    const existing = this.clients.find(c => c.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      if (data.phone) existing.phone = data.phone;
      if (data.company) existing.company = data.company;
      if (data.homeAddress) existing.homeAddress = data.homeAddress;
      if (data.userId) existing.userId = data.userId;
      return existing;
    }

    const newClient: Client = {
      id: this.clients.length > 0 ? Math.max(...this.clients.map(c => c.id)) + 1 : 1,
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      company: data.company || null,
      homeAddress: data.homeAddress || null,
      sinceYear: data.sinceYear || new Date().getFullYear(),
      userId: data.userId,
    };
    this.clients.push(newClient);
    return newClient;
  }

  // User Auth & Credentials
  findUserByEmail(email: string) {
    const normalized = email.toLowerCase().trim();
    return this.userCredentials.get(normalized);
  }

  findUserById(id: string) {
    for (const [_, entry] of this.userCredentials.entries()) {
      if (entry.profile.id === id) {
        return entry;
      }
    }
    return null;
  }

  findUserByPhone(phone: string) {
    const clean = phone.replace(/\D/g, '');
    for (const [_, entry] of this.userCredentials.entries()) {
      if (entry.profile.phone.replace(/\D/g, '') === clean) {
        return entry;
      }
    }
    return null;
  }

  registerUser(password: string, profile: UserProfile) {
    const normalized = profile.email.toLowerCase().trim();
    this.userCredentials.set(normalized, {
      passwordHash: password,
      profile,
    });
    // Also sync to clients list
    this.addClient({
      name: `${profile.firstName} ${profile.lastName}`,
      email: profile.email,
      phone: profile.phone,
      homeAddress: profile.homeAddress,
      company: profile.companyName || undefined,
      sinceYear: new Date().getFullYear(),
    });

    if (firestore) {
      try {
        firestore.collection('users').doc(profile.id).set(profile, { merge: true }).catch(() => {});
      } catch (_) {}
    }

    return profile;
  }

  getAppointments(options: { search?: string; date?: string; status?: string; advisorId?: number } = {}): Appointment[] {
    let list = [...this.appointments];

    if (options.search) {
      const q = options.search.toLowerCase();
      list = list.filter(a =>
        a.title.toLowerCase().includes(q) ||
        a.client.name.toLowerCase().includes(q) ||
        (a.client.email && a.client.email.toLowerCase().includes(q)) ||
        (a.advisor && a.advisor.name.toLowerCase().includes(q)) ||
        (a.taskReason && a.taskReason.toLowerCase().includes(q)) ||
        (a.notes && a.notes.toLowerCase().includes(q))
      );
    }

    if (options.date) {
      list = list.filter(a => a.date === options.date);
    }

    if (options.status && options.status !== 'Alle') {
      list = list.filter(a => a.status === options.status);
    }

    if (options.advisorId) {
      list = list.filter(a => a.advisor?.id === options.advisorId);
    }

    return list.sort((a, b) => {
      const dateDiff = a.date.localeCompare(b.date);
      if (dateDiff !== 0) return dateDiff;
      return a.startTime.localeCompare(b.startTime);
    });
  }

  getAppointmentById(id: number): Appointment | undefined {
    return this.appointments.find(a => a.id === id);
  }

  addAppointment(data: {
    clientId: number;
    advisorId?: number | null;
    title: string;
    taskReason?: string;
    date: string;
    startTime: string;
    endTime: string;
    status?: AppointmentStatus;
    notes?: string;
    serviceCategory?: string;
    isGuest?: boolean;
    guestFirstName?: string;
    guestLastName?: string;
    guestPhone?: string;
    guestEmail?: string;
    userId?: string | null;
  }): Appointment {
    const client = this.getClientById(data.clientId) || {
      id: data.clientId,
      name: 'Mandant',
      email: 'mandant@aus-beratung.de',
      phone: null,
      sinceYear: new Date().getFullYear()
    };

    const advisor = data.advisorId ? this.getAdvisorById(data.advisorId) || null : null;
    const newId = this.appointments.length > 0 ? Math.max(...this.appointments.map(a => a.id)) + 1 : 1;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);

    const newApt: Appointment = {
      id: newId,
      title: data.title,
      taskReason: data.taskReason || 'Erstberatung',
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      status: data.status || 'Scheduled',
      notes: data.notes || '',
      client,
      advisor,
      isGuest: data.isGuest || false,
      userId: data.userId || null,
      bookingRef: `AuS-${new Date().getFullYear()}-${randomSuffix}`,
      serviceCategory: data.serviceCategory || 'tax',
      createdAt: new Date().toISOString()
    };

    this.appointments.unshift(newApt);

    if (firestore) {
      try {
        firestore.collection('appointments').doc(String(newApt.id)).set(newApt, { merge: true }).catch(() => {});
      } catch (_) {}
    }

    return newApt;
  }

  updateAppointment(id: number, updates: Partial<{
    title: string;
    taskReason: string;
    date: string;
    startTime: string;
    endTime: string;
    status: AppointmentStatus;
    notes: string;
    advisorId: number | null;
  }>): Appointment | null {
    const idx = this.appointments.findIndex(a => a.id === id);
    if (idx === -1) return null;

    const apt = this.appointments[idx];

    let advisor = apt.advisor;
    if (updates.advisorId !== undefined) {
      advisor = updates.advisorId ? this.getAdvisorById(updates.advisorId) || null : null;
    }

    const updated: Appointment = {
      ...apt,
      title: updates.title !== undefined ? updates.title : apt.title,
      taskReason: updates.taskReason !== undefined ? updates.taskReason : apt.taskReason,
      date: updates.date !== undefined ? updates.date : apt.date,
      startTime: updates.startTime !== undefined ? updates.startTime : apt.startTime,
      endTime: updates.endTime !== undefined ? updates.endTime : apt.endTime,
      status: updates.status !== undefined ? updates.status : apt.status,
      notes: updates.notes !== undefined ? updates.notes : apt.notes,
      advisor
    };

    this.appointments[idx] = updated;

    if (firestore) {
      try {
        firestore.collection('appointments').doc(String(id)).set(updated, { merge: true }).catch(() => {});
      } catch (_) {}
    }

    return updated;
  }

  deleteAppointment(id: number): boolean {
    const lenBefore = this.appointments.length;
    this.appointments = this.appointments.filter(a => a.id !== id);

    if (firestore) {
      try {
        firestore.collection('appointments').doc(String(id)).delete().catch(() => {});
      } catch (_) {}
    }

    return this.appointments.length < lenBefore;
  }

  // ==================== MULTI-ROOM CHAT STORAGE ====================

  getOrCreateGeneralRoom(customerId: string, customerName?: string, customerEmail?: string): ChatRoom {
    const cleanId = customerId.toLowerCase().replace(/[^a-z0-9_-]/g, '_');
    const directRoomId = `general-${cleanId}`;

    // 1. Check if direct room exists by clean ID or raw customerId
    let room = this.chatRooms.get(directRoomId) || this.chatRooms.get(`general-${customerId}`);

    // 2. If not found and customerEmail provided, search by email or client record
    if (!room && customerEmail) {
      const emailLower = customerEmail.toLowerCase().trim();
      const client = this.getClientByEmail(emailLower);
      
      for (const r of this.chatRooms.values()) {
        if (r.roomType === 'general_ticket') {
          if (r.customerEmail && r.customerEmail.toLowerCase().trim() === emailLower) {
            room = r;
            break;
          }
          if (client && (r.customerId === `client-${client.id}` || (client.userId && r.customerId === client.userId))) {
            room = r;
            break;
          }
        }
      }
    }

    if (!room) {
      const roomId = directRoomId;
      room = {
        id: roomId,
        roomType: 'general_ticket',
        customerId,
        customerEmail: customerEmail?.toLowerCase().trim(),
        title: `Support-Ticket: ${customerName || 'Mandant'}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.chatRooms.set(roomId, room);

      if (firestore) {
        try {
          firestore.collection('chat_rooms').doc(roomId).set(room, { merge: true }).catch(() => {});
        } catch (_) {}
      }
    } else {
      if (customerEmail && !room.customerEmail) {
        room.customerEmail = customerEmail.toLowerCase().trim();
      }
    }
    return room;
  }

  getOrCreateAppointmentRoom(customerId: string, appointmentId: number, appointmentTitle?: string): ChatRoom {
    const roomId = `apt-room-${appointmentId}`;
    let room = this.chatRooms.get(roomId);
    if (!room) {
      room = {
        id: roomId,
        roomType: 'appointment_chat',
        customerId,
        appointmentId,
        title: appointmentTitle ? `Termin #${appointmentId}: ${appointmentTitle}` : `Termin #${appointmentId}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.chatRooms.set(roomId, room);

      if (firestore) {
        try {
          firestore.collection('chat_rooms').doc(roomId).set(room, { merge: true }).catch(() => {});
        } catch (_) {}
      }
    }
    return room;
  }

  getRoom(roomId: string): ChatRoom | undefined {
    return this.chatRooms.get(roomId);
  }

  getAllRooms(): ChatRoom[] {
    return Array.from(this.chatRooms.values());
  }

  getRoomsForUser(userId: string, role: string, userEmail?: string): ChatRoom[] {
    if (role === 'admin' || role === 'advisor') {
      return Array.from(this.chatRooms.values());
    }
    const cleanEmail = userEmail?.toLowerCase().trim();
    const client = cleanEmail ? this.getClientByEmail(cleanEmail) : undefined;

    return Array.from(this.chatRooms.values()).filter(r => {
      if (r.customerId === userId) return true;
      if (cleanEmail && r.customerEmail && r.customerEmail.toLowerCase().trim() === cleanEmail) return true;
      if (client && (r.customerId === `client-${client.id}` || (client.userId && r.customerId === client.userId))) return true;
      if (r.appointmentId && cleanEmail) {
        const apt = this.getAppointmentById(r.appointmentId);
        if (apt && apt.client.email.toLowerCase() === cleanEmail) {
          return true;
        }
      }
      return false;
    });
  }

  getMessages(roomId: string): ChatMessage[] {
    const list = this.chatMessages.get(roomId) || [];
    return list.map(m => {
      if (m.attachmentId && !m.attachment) {
        const doc = this.getDocumentById(m.attachmentId);
        if (doc) return { ...m, attachment: doc };
      }
      return m;
    });
  }

  addMessage(data: {
    roomId: string;
    senderId: string;
    senderName?: string;
    senderRole?: UserRole;
    message: string;
    isHighAlert?: boolean;
    attachmentId?: number | string;
    attachment?: AppointmentDocument;
  }): ChatMessage {
    const list = this.chatMessages.get(data.roomId) || [];
    const newMsg: ChatMessage = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      roomId: data.roomId,
      senderId: data.senderId,
      senderName: data.senderName || 'Benutzer',
      senderRole: data.senderRole || 'customer',
      message: data.message,
      isHighAlert: Boolean(data.isHighAlert),
      attachmentId: data.attachmentId,
      attachment: data.attachment,
      createdAt: new Date().toISOString(),
    };
    list.push(newMsg);
    this.chatMessages.set(data.roomId, list);

    const room = this.chatRooms.get(data.roomId);
    if (room) {
      room.updatedAt = newMsg.createdAt;
      room.lastMessage = data.message;
    }

    if (firestore) {
      try {
        firestore.collection('chat_rooms').doc(data.roomId).collection('messages').doc(String(newMsg.id)).set(newMsg).catch(() => {});
        firestore.collection('chat_rooms').doc(data.roomId).set({
          id: data.roomId,
          lastMessage: data.message,
          updatedAt: newMsg.createdAt,
        }, { merge: true }).catch(() => {});
      } catch (_) {}
    }

    this.emitRoomEvent(data.roomId, { type: 'new_message', data: newMsg });
    return newMsg;
  }

  // ==================== DOCUMENT & FILE STORAGE ====================

  getDocuments(filter?: { appointmentId?: number; chatRoomId?: string }): AppointmentDocument[] {
    let list = [...this.documents];
    if (filter?.appointmentId) {
      list = list.filter(d => d.appointmentId === filter.appointmentId);
    }
    if (filter?.chatRoomId) {
      list = list.filter(d => d.chatRoomId === filter.chatRoomId || (filter.appointmentId && d.appointmentId === filter.appointmentId));
    }
    return list.sort((a, b) => (b.uploadedAt || '').localeCompare(a.uploadedAt || ''));
  }

  getDocumentById(id: number | string): AppointmentDocument | undefined {
    return this.documents.find(d => String(d.id) === String(id));
  }

  addDocument(data: {
    appointmentId?: number | null;
    chatRoomId?: string;
    uploaderId?: string;
    uploaderName?: string;
    uploaderRole?: UserRole;
    fileName: string;
    fileSize?: string;
    fileUrl: string;
    fileType?: string;
    mimeType?: string;
    storagePath?: string;
    isImage?: boolean;
    label?: string;
    documentDate?: string;
  }): AppointmentDocument {
    const isImage = data.isImage !== undefined 
      ? data.isImage 
      : Boolean(data.mimeType?.startsWith('image/') || /\.(png|jpe?g|webp|gif|bmp)$/i.test(data.fileName));

    const newDoc: AppointmentDocument = {
      id: this.documents.length > 0 ? Math.max(...this.documents.map(d => typeof d.id === 'number' ? d.id : 0)) + 1 : 1,
      appointmentId: data.appointmentId || null,
      chatRoomId: data.chatRoomId,
      uploaderId: data.uploaderId,
      uploaderName: data.uploaderName,
      uploaderRole: data.uploaderRole,
      fileName: data.fileName,
      fileSize: data.fileSize || '1.0 MB',
      fileUrl: data.fileUrl,
      fileType: data.fileType || data.mimeType,
      mimeType: data.mimeType,
      storagePath: data.storagePath,
      isImage,
      label: data.label || 'Dokument',
      documentDate: data.documentDate || new Date().toISOString().split('T')[0],
      uploadedAt: new Date().toISOString(),
    };
    this.documents.unshift(newDoc);

    if (firestore) {
      try {
        firestore.collection('documents').doc(String(newDoc.id)).set(newDoc, { merge: true }).catch(() => {});
      } catch (_) {}
    }

    if (data.chatRoomId) {
      this.emitRoomEvent(data.chatRoomId, { type: 'new_document', data: newDoc });
    }

    return newDoc;
  }

  deleteDocument(id: number | string): boolean {
    const lenBefore = this.documents.length;
    this.documents = this.documents.filter(d => String(d.id) !== String(id));

    if (firestore) {
      try {
        firestore.collection('documents').doc(String(id)).delete().catch(() => {});
      } catch (_) {}
    }

    return this.documents.length < lenBefore;
  }

  // ==================== REAL-TIME SSE ROOM EVENT BUS ====================

  subscribeToRoom(roomId: string, callback: (event: { type: string; data?: any; roomId?: string }) => void): () => void {
    if (!this.roomListeners.has(roomId)) {
      this.roomListeners.set(roomId, new Set());
    }
    this.roomListeners.get(roomId)!.add(callback);
    return () => {
      this.roomListeners.get(roomId)?.delete(callback);
    };
  }

  emitRoomEvent(roomId: string, event: { type: string; data?: any; roomId?: string }) {
    const listeners = this.roomListeners.get(roomId);
    if (listeners) {
      listeners.forEach(cb => {
        try { cb(event); } catch (e) { console.error('Error in room listener:', e); }
      });
    }
  }

  // ==================== ADMIN AVAILABILITY MANAGEMENT ====================

  getAvailability(date: string): AdminAvailability | undefined {
    return this.availabilities.get(date);
  }

  getAllAvailabilities(): AdminAvailability[] {
    return Array.from(this.availabilities.values());
  }

  setAvailability(date: string, status: DayAvailabilityStatus, customSlots?: CustomTimeSlot[], notes?: string): AdminAvailability {
    const existing = this.availabilities.get(date);
    const item: AdminAvailability = {
      id: existing?.id || this.availabilities.size + 1,
      date,
      status,
      customSlots: customSlots || [],
      notes: notes || '',
      updatedAt: new Date().toISOString(),
    };
    this.availabilities.set(date, item);

    if (firestore) {
      try {
        firestore.collection('admin_availability').doc(date).set(item, { merge: true }).catch(() => {});
      } catch (_) {}
    }

    return item;
  }

  deleteAvailability(date: string): boolean {
    const res = this.availabilities.delete(date);
    if (firestore) {
      try {
        firestore.collection('admin_availability').doc(date).delete().catch(() => {});
      } catch (_) {}
    }
    return res;
  }
}

export const memoryStore = new InMemoryStore();
