import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import multer from 'multer';
import { db, isSqlActive, memoryStore } from './src/db/index.ts';
import { requireAuth, requireStrictAuth, AuthRequest, AuthUser, resolveAuthUser } from './src/middleware/auth.ts';
import { corporateServices } from './src/customer/data/servicesData.ts';
import { 
  sendCustomerBookingConfirmation, 
  sendAdminNewBookingAlert, 
  sendVerificationOtpEmail,
  sendHighAlertMessageEmail 
} from './src/lib/emailService.ts';
import { ChatRoom, AppointmentDocument, ChatMessage, UserRole } from './src/types.ts';
import { isLiveFirebaseConfigured } from './src/lib/firebase.ts';

// In-Memory Secure OTP Store (Email -> { code, expiresAt })
const activeOtpCodes = new Map<string, { code: string; expiresAt: number }>();

// ==================== SECURE FILE UPLOAD & STORAGE CONFIG ====================

const uploadDir = path.resolve(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Whitelisted MIME Types & Prohibited Executables
const ALLOWED_MIME_TYPES = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/bmp',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'text/plain',
  'text/csv',
]);

const FORBIDDEN_EXTENSIONS = new Set([
  '.exe', '.bat', '.cmd', '.sh', '.php', '.phtml', '.js', '.mjs',
  '.html', '.htm', '.svg', '.vbs', '.dll', '.py', '.bin', '.cgi', '.pl', '.com', '.scr', '.ps1'
]);

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = FORBIDDEN_EXTENSIONS.has(ext) ? '.dat' : (ext || '.bin');
    const uniqueName = `${crypto.randomUUID()}${safeExt}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB max
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (FORBIDDEN_EXTENSIONS.has(ext)) {
      return cb(new Error('Sicherheitswarnung: Ausführbare Dateien oder Skripte sind aus Sicherheitsgründen nicht erlaubt.'));
    }
    if (!ALLOWED_MIME_TYPES.has(file.mimetype) && !ext.match(/\.(pdf|png|jpe?g|webp|gif|docx?|xlsx?|txt|csv)$/i)) {
      return cb(new Error('Nicht unterstützter Dateityp. Erlaubt sind PDF, Office-Dokumente und Bilder (JPG, PNG, WEBP).'));
    }
    cb(null, true);
  },
});

// Helper: Format Appointment for frontend consumption
function formatAppointment(a: any): any {
  return {
    id: a.id,
    bookingRef: a.bookingRef || `AuS-${new Date().getFullYear()}-${a.id}`,
    title: a.title,
    taskReason: a.taskReason || 'Erstberatung',
    date: a.date,
    startTime: a.startTime?.substring(0, 5) || '10:00',
    endTime: a.endTime?.substring(0, 5) || '11:00',
    status: a.status || 'Scheduled',
    notes: a.notes || '',
    serviceCategory: a.serviceCategory || 'accounting',
    isGuest: Boolean(a.isGuest),
    userId: a.userId,
    client: {
      id: a.client?.id || a.clientId || a.id,
      userId: a.userId,
      name: a.client?.name || 'Mandant',
      email: a.client?.email || 'mandant@aus-beratung.de',
      phone: a.client?.phone || '',
      company: a.client?.company || '',
      homeAddress: a.client?.homeAddress || 'Lagerhofstraße 2, 04103 Leipzig',
      sinceYear: a.client?.sinceYear || new Date().getFullYear(),
    },
    advisor: {
      id: 1,
      name: 'Dr. Abdul Sattar',
      role: 'admin',
      email: 'abdul.sattar@aus-beratung.de',
      avatar: '/assets/abdul_sattar.png'
    },
    createdAt: a.createdAt || new Date().toISOString(),
  };
}

// Deterministic Room ID resolution
function resolveRoomId(
  roomType: 'general_ticket' | 'appointment_chat',
  customerId?: string,
  appointmentId?: number | string
): string {
  if (roomType === 'appointment_chat' && appointmentId) {
    return `apt-room-${appointmentId}`;
  }
  const clean = customerId ? String(customerId).toLowerCase().replace(/[^a-z0-9_-]/g, '_') : 'guest';
  return `general-${clean}`;
}

// Helper: Verify if user has permission to access a chat room
function checkUserCanAccessRoom(user: AuthUser, room: ChatRoom): boolean {
  if (user.role === 'admin' || user.role === 'advisor') return true;
  if (room.customerId === user.id || room.customerId === user.uid) return true;
  if (room.customerEmail && user.email && room.customerEmail.toLowerCase() === user.email.toLowerCase()) {
    return true;
  }
  const client = user.email ? memoryStore.getClientByEmail(user.email) : undefined;
  if (client && (room.customerId === `client-${client.id}` || (client.userId && room.customerId === client.userId))) {
    return true;
  }
  if (room.appointmentId) {
    const apt = memoryStore.getAppointmentById(room.appointmentId);
    if (apt && apt.client.email.toLowerCase() === user.email.toLowerCase()) {
      return true;
    }
    if (apt && apt.userId === user.id) {
      return true;
    }
  }
  return false;
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 5000;

  // Create HTTP server to attach both Express and WebSockets
  const httpServer = http.createServer(app);

  // ==================== WEBSOCKET REALTIME CHAT ENGINE ====================
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  const roomSockets = new Map<string, Set<WebSocket>>();

  function broadcastToRoom(roomId: string, event: { type: string; data?: any; roomId?: string }) {
    const clients = roomSockets.get(roomId);
    if (clients) {
      const payload = JSON.stringify({ ...event, roomId });
      clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          try {
            client.send(payload);
          } catch (err) {
            console.warn('[WS] Send error:', err);
          }
        }
      });
    }
    // Also emit to memoryStore SSE event bus for backward compatibility
    memoryStore.emitRoomEvent(roomId, event);
  }

  wss.on('connection', (ws: WebSocket, req: any) => {
    let currentRoomId: string | null = null;

    ws.on('message', (rawData) => {
      try {
        const msg = JSON.parse(rawData.toString());

        if (msg.type === 'join_room' && msg.roomId) {
          if (currentRoomId && currentRoomId !== msg.roomId) {
            roomSockets.get(currentRoomId)?.delete(ws);
          }
          currentRoomId = msg.roomId;
          if (!roomSockets.has(currentRoomId)) {
            roomSockets.set(currentRoomId, new Set());
          }
          roomSockets.get(currentRoomId)!.add(ws);
          ws.send(JSON.stringify({ type: 'joined_room', roomId: currentRoomId }));
        }

        if (msg.type === 'leave_room' && msg.roomId) {
          roomSockets.get(msg.roomId)?.delete(ws);
          if (currentRoomId === msg.roomId) currentRoomId = null;
        }

        if (msg.type === 'send_message' && msg.roomId && msg.message) {
          const newMsg = memoryStore.addMessage({
            roomId: msg.roomId,
            senderId: msg.senderId || 'user',
            senderName: msg.senderName || 'Benutzer',
            senderRole: msg.senderRole || 'customer',
            message: msg.message,
            isHighAlert: Boolean(msg.isHighAlert),
            attachmentId: msg.attachmentId,
            attachment: msg.attachment,
          });

          broadcastToRoom(msg.roomId, { type: 'new_message', data: newMsg, roomId: msg.roomId });

          if (newMsg.isHighAlert && msg.appointmentId) {
            const apt = memoryStore.getAppointmentById(Number(msg.appointmentId));
            if (apt?.client?.email) {
              sendHighAlertMessageEmail({
                customerEmail: apt.client.email,
                customerName: apt.client.name,
                appointmentTitle: apt.title,
                messageContent: msg.message,
                advisorName: msg.senderName || 'Dr. Abdul Sattar',
              });
            }
          }
        }

        if (msg.type === 'typing' && msg.roomId) {
          const clients = roomSockets.get(msg.roomId);
          if (clients) {
            const payload = JSON.stringify({
              type: 'user_typing',
              data: { roomId: msg.roomId, isTyping: msg.isTyping, senderName: msg.senderName },
            });
            clients.forEach((client) => {
              if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(payload);
              }
            });
          }
        }
      } catch (err: any) {
        console.warn('[WS] Message processing error:', err.message);
      }
    });

    ws.on('close', () => {
      if (currentRoomId) {
        roomSockets.get(currentRoomId)?.delete(ws);
      }
    });
  });

  // Security Headers Middleware
  app.disable('x-powered-by');
  app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    if (process.env.NODE_ENV === 'production') {
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    }
    next();
  });

  // Middleware for CORS
  const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : true;

  app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-user-id', 'x-user-name', 'x-user-role'],
  }));

  app.use(express.json({ limit: '10mb' }));

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      service: 'A u.S Booking System API',
      timestamp: new Date().toISOString(),
      branding: 'A u.S Wirtschaftsberatung e.K.',
      firebase: isLiveFirebaseConfigured ? 'Connected (Live)' : 'Connected (Local/Demo)',
      websockets: 'Active (/ws)',
      database: isSqlActive ? 'PostgreSQL (Active)' : 'In-Memory Store (Active)',
      environment: process.env.NODE_ENV || 'development',
    });
  });

  // ==================== AUTHENTICATION & OTP ====================

  // 1. Send OTP verification code
  app.post('/api/auth/send-otp', async (req, res) => {
    try {
      const { email, code: clientCode } = req.body;
      if (!email) {
        return res.status(400).json({ error: 'E-Mail-Adresse erforderlich.' });
      }

      const normalized = email.toLowerCase().trim();
      const code = clientCode || Math.floor(100000 + Math.random() * 900000).toString();
      
      activeOtpCodes.set(normalized, {
        code,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      });

      const result = await sendVerificationOtpEmail(normalized, code);
      res.json({
        success: true,
        message: result.mode === 'live' ? 'Bestätigungscode wurde per E-Mail gesendet.' : 'Bestätigungscode generiert (Sandbox/Test-Modus).',
        mode: result.mode,
        devCode: code,
        sandboxNotice: (result as any).error ? `Resend Sandbox: ${(result as any).error.message || (result as any).error}` : undefined,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Fehler beim Senden des Codes: ' + err.message });
    }
  });

  // 2. Verify OTP code
  app.post('/api/auth/verify-otp', (req, res) => {
    try {
      const { email, code } = req.body;
      if (!email || !code) {
        return res.status(400).json({ error: 'E-Mail und Code sind erforderlich.' });
      }

      const normalized = email.toLowerCase().trim();
      const enteredCode = String(code).trim();

      // Universal test code support
      if (enteredCode === '123456') {
        activeOtpCodes.delete(normalized);
        return res.json({ success: true, verified: true });
      }

      const entry = activeOtpCodes.get(normalized);

      if (!entry) {
        return res.status(400).json({ 
          error: 'Kein aktiver Bestätigungscode gefunden. Bitte fordern Sie einen neuen Code an (oder Test-Code 123456).' 
        });
      }

      if (Date.now() > entry.expiresAt) {
        activeOtpCodes.delete(normalized);
        return res.status(400).json({ 
          error: 'Der Bestätigungscode ist abgelaufen. Bitte fordern Sie einen neuen Code an.' 
        });
      }

      if (entry.code !== enteredCode) {
        return res.status(400).json({ error: 'Ungültiger Bestätigungscode.' });
      }

      activeOtpCodes.delete(normalized);
      res.json({ success: true, verified: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 3. Check if email already exists
  app.post('/api/auth/check-email', (req, res) => {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ error: 'E-Mail erforderlich' });

      const normalized = email.toLowerCase().trim();
      const existingUser = memoryStore.findUserByEmail(normalized);
      const existingClient = memoryStore.getClientByEmail(normalized);

      res.json({ exists: Boolean(existingUser || existingClient) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 4. Check if phone already exists
  app.post('/api/auth/check-phone', (req, res) => {
    try {
      const { phone } = req.body;
      if (!phone) return res.status(400).json({ error: 'Telefonnummer erforderlich' });

      const existingUser = memoryStore.findUserByPhone(phone);
      const existingClient = memoryStore.getClientByPhone(phone);

      res.json({ exists: Boolean(existingUser || existingClient) });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // 5. User Sign In (Email + Password)
  app.post('/api/auth/login', (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res.status(400).json({ error: 'Bitte geben Sie E-Mail und Passwort ein.' });
      }

      const normalized = email.toLowerCase().trim();
      const user = memoryStore.findUserByEmail(normalized);

      if (!user) {
        return res.status(404).json({ 
          error: 'Kein Konto mit dieser E-Mail-Adresse gefunden. Bitte registrieren Sie sich.',
          notRegistered: true 
        });
      }

      if (user.passwordHash !== password) {
        return res.status(401).json({ error: 'Das eingegebene Passwort ist ungültig.' });
      }

      res.json({
        success: true,
        session: {
          access_token: `token_${user.profile.id}`,
          user: {
            id: user.profile.id,
            email: user.profile.email,
          },
        },
        profile: user.profile,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Anmeldefehler: ' + err.message });
    }
  });

  // 6. User Sign Up (Email, Password & Full Profile Onboarding)
  app.post('/api/auth/register', (req, res) => {
    try {
      const { firstName, lastName, phone, email, homeAddress, companyName, password, firebaseUid } = req.body;

      if (!firstName || !lastName || !phone || !email || !homeAddress || !password) {
        return res.status(400).json({ error: 'Bitte füllen Sie alle Pflichtfelder aus (Name, Telefon, E-Mail, Adresse, Passwort).' });
      }

      const normalized = email.toLowerCase().trim();

      if (memoryStore.findUserByEmail(normalized)) {
        return res.status(409).json({ 
          error: 'Diese E-Mail-Adresse ist bereits registriert. Bitte melden Sie sich an.',
          alreadyExists: true 
        });
      }

      if (memoryStore.findUserByPhone(phone)) {
        return res.status(409).json({ 
          error: 'Diese Telefonnummer ist bereits mit einem anderen Konto verknüpft (1 Konto pro Telefonnummer).' 
        });
      }

      const userId = firebaseUid || `usr_${Buffer.from(normalized).toString('hex').substring(0, 16)}`;
      const profile = {
        id: userId,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        email: normalized,
        homeAddress: homeAddress.trim(),
        companyName: companyName ? companyName.trim() : null,
        role: 'customer' as const,
        createdAt: new Date().toISOString(),
      };

      memoryStore.registerUser(password, profile);

      res.status(201).json({
        success: true,
        session: {
          access_token: `token_${userId}`,
          user: {
            id: userId,
            email: normalized,
          },
        },
        profile,
      });
    } catch (err: any) {
      res.status(500).json({ error: 'Registrierungsfehler: ' + err.message });
    }
  });

  // ==================== ADMIN AVAILABILITY & TIME FRAMES ====================

  app.get('/api/admin/availability', (req, res) => {
    try {
      const list = memoryStore.getAllAvailabilities();
      res.json(list);
    } catch (err: any) {
      res.status(500).json({ error: 'Fehler beim Laden der Verfügbarkeiten: ' + err.message });
    }
  });

  app.post('/api/admin/availability', (req, res) => {
    try {
      const { date, status, customSlots, notes } = req.body;
      if (!date || !status) {
        return res.status(400).json({ error: 'Datum und Status sind erforderlich.' });
      }

      const item = memoryStore.setAvailability(date, status, customSlots, notes);
      res.json(item);
    } catch (err: any) {
      res.status(500).json({ error: 'Fehler beim Speichern der Verfügbarkeit: ' + err.message });
    }
  });

  app.post('/api/admin/availability/batch', (req, res) => {
    try {
      const { dates, status } = req.body;
      if (!Array.isArray(dates) || !status) {
        return res.status(400).json({ error: 'dates array and status required' });
      }

      const updated = dates.map(d => memoryStore.setAvailability(d, status));
      res.json(updated);
    } catch (err: any) {
      res.status(500).json({ error: 'Fehler bei der Stapelverarbeitung: ' + err.message });
    }
  });

  // ==================== PUBLIC CUSTOMER API ROUTES ====================

  app.get('/api/public/services', (req, res) => {
    res.json(corporateServices);
  });
  app.get('/api/services', (req, res) => {
    res.json(corporateServices);
  });

  app.get('/api/public/advisors', (req, res) => {
    const advisors = memoryStore.getAdvisors().map(a => ({
      id: a.id,
      name: a.name,
      title: a.title,
      specialization: a.specialization,
      avatar: a.avatar,
      email: a.email,
    }));
    res.json(advisors);
  });

  app.get('/api/public/available-slots', (req, res) => {
    try {
      const date = (req.query.date as string) || new Date().toISOString().split('T')[0];
      const advisorId = req.query.advisorId ? parseInt(req.query.advisorId as string) : undefined;

      const dateObj = new Date(date);
      const dayOfWeek = dateObj.getDay();
      const isAllowedDay = dayOfWeek === 1 || dayOfWeek === 2 || dayOfWeek === 3 || dayOfWeek === 4 || dayOfWeek === 6;

      const today = new Date();
      const currentYearMonth = today.getFullYear() * 12 + today.getMonth();
      const reqYearMonth = dateObj.getFullYear() * 12 + dateObj.getMonth();
      const monthDiff = reqYearMonth - currentYearMonth;

      if (monthDiff < 0 || monthDiff > 1) {
        return res.json({
          date,
          slots: [],
          available: false,
          message: 'Termine können nur für den aktuellen und den kommenden Monat gebucht werden.'
        });
      }

      const baseSlots = [
        { startTime: '09:00', endTime: '10:00' },
        { startTime: '10:00', endTime: '11:00' },
        { startTime: '11:00', endTime: '12:00' },
        { startTime: '13:00', endTime: '14:00' },
        { startTime: '14:00', endTime: '15:00' },
        { startTime: '15:00', endTime: '16:00' },
        { startTime: '16:00', endTime: '17:00' },
        { startTime: '17:00', endTime: '18:00' },
      ];

      const override = memoryStore.getAvailability(date);

      if (monthDiff === 1) {
        if (!override || override.status === 'unavailable') {
          return res.json({
            date,
            slots: [],
            available: false,
            isNextMonthLocked: true,
            message: 'Termine für diesen Tag im Folgemonat sind noch nicht durch die Kanzlei freigeschaltet.'
          });
        }
      }

      if (override?.status === 'unavailable') {
        return res.json({
          date,
          slots: [],
          available: false,
          message: 'Für diesen Tag sind keine Termine verfügbar.'
        });
      }

      if (!isAllowedDay) {
        return res.json({
          date,
          slots: baseSlots.map(s => ({ ...s, available: false })),
          message: 'Beratungen finden montags bis donnerstags sowie samstags statt.'
        });
      }

      let activeSlots = baseSlots;
      if (override?.status === 'custom_slots' && override.customSlots && override.customSlots.length > 0) {
        activeSlots = override.customSlots;
      }

      const existing = memoryStore.getAppointments({ date, advisorId });
      const bookedStartTimes = new Set(
        existing
          .filter(a => a.status !== 'Canceled' && a.status !== 'Storniert')
          .map(a => a.startTime)
      );

      const slots = activeSlots.map(slot => ({
        ...slot,
        available: !bookedStartTimes.has(slot.startTime)
      }));

      res.json({ date, slots, isNextMonth: monthDiff === 1 });
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to calculate slots: ' + err.message });
    }
  });

  app.post('/api/public/book', async (req, res) => {
    try {
      const {
        serviceId,
        serviceTitle,
        advisorId,
        date,
        startTime,
        endTime,
        clientName,
        clientEmail,
        clientPhone,
        homeAddress,
        company,
        taskReason,
        notes,
        isGuest,
        userId,
      } = req.body;

      if (!clientName || (!clientEmail && !clientPhone) || !date || !startTime || !endTime) {
        return res.status(400).json({
          error: 'Bitte füllen Sie alle Pflichtfelder aus (Name, E-Mail oder Telefon, Datum, Uhrzeit).'
        });
      }

      const bookingDate = new Date(date);
      const dow = bookingDate.getDay();
      if (dow === 0 || dow === 5) {
        return res.status(400).json({
          error: 'Buchungen sind nur von Montag bis Donnerstag sowie samstags möglich.'
        });
      }

      const effectiveEmail = clientEmail || `${(clientPhone || 'guest').replace(/\s+/g, '')}@guest.aus-beratung.de`;

      const client = memoryStore.addClient({
        name: clientName,
        email: effectiveEmail,
        phone: clientPhone,
        company,
        homeAddress: homeAddress || 'Lagerhofstraße 2, 04103 Leipzig',
        sinceYear: new Date().getFullYear(),
      });

      const service = corporateServices.find(s => s.id === serviceId);
      const title = serviceTitle || (service ? service.title : 'Beratungsgespräch');

      const targetUserId = userId || `client-${client.id}`;
      const randomSuffix = Math.floor(1000 + Math.random() * 9000);
      const bookingRef = `AuS-${new Date().getFullYear()}-${randomSuffix}`;

      const appointment = memoryStore.addAppointment({
        clientId: client.id,
        advisorId: advisorId ? parseInt(advisorId) : 1,
        title,
        taskReason: taskReason || notes || 'Erstberatung',
        date,
        startTime,
        endTime,
        status: 'Scheduled',
        notes: notes ? `Online-Kundenbuchung. Anliegen: ${notes}` : 'Online-Kundenbuchung über das Portal.',
        serviceCategory: service ? service.category : 'accounting',
        isGuest: Boolean(isGuest || !userId),
        userId: targetUserId,
      });

      appointment.bookingRef = bookingRef;

      // Auto-create appointment chat room in memoryStore
      memoryStore.getOrCreateAppointmentRoom(targetUserId, appointment.id, appointment.title);

      const notificationPayload = {
        bookingRef,
        clientName,
        clientEmail: effectiveEmail,
        clientPhone: clientPhone || '',
        serviceTitle: title,
        date,
        startTime,
        endTime,
        taskReason: taskReason || 'Erstberatung',
        company: company || '',
        homeAddress: homeAddress || '',
        notes: notes || '',
      };

      Promise.allSettled([
        sendCustomerBookingConfirmation(notificationPayload),
        sendAdminNewBookingAlert(notificationPayload)
      ]).then((results) => {
        console.log('[Email Notification] Dispatched booking emails:', results);
      });

      res.status(201).json({
        success: true,
        bookingRef,
        appointment,
        message: 'Ihr Termin wurde erfolgreich und verbindlich gebucht.'
      });
    } catch (err: any) {
      console.error('Customer booking error:', err);
      res.status(500).json({ error: 'Buchungsfehler: ' + err.message });
    }
  });

  // ==================== ADMIN & AUTHENTICATED APPOINTMENTS API ====================

  app.get('/api/users/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      res.json({
        uid: req.user?.uid || 'demo-admin-uid',
        email: req.user?.email || 'abdul.sattar@aus-beratung.de',
        name: req.user?.name || 'Dr. Abdul Sattar',
        role: req.user?.role || 'admin',
        dbId: req.user?.dbId || 1,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.get('/api/users/profile', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const userEntry = memoryStore.findUserById(user.id);
      if (userEntry) {
        return res.json(userEntry.profile);
      }
      res.json({
        id: user.id,
        firstName: user.name.split(' ')[0] || user.name,
        lastName: user.name.split(' ').slice(1).join(' ') || '',
        email: user.email,
        phone: '',
        homeAddress: 'Lagerhofstraße 2, 04103 Leipzig',
        role: user.role,
        createdAt: new Date().toISOString(),
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.post('/api/users/profile', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const profile = req.body;
      const userEntry = memoryStore.findUserById(user.id);
      if (userEntry) {
        userEntry.profile = { ...userEntry.profile, ...profile };
      }
      res.json(profile);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get('/api/users', requireAuth, async (req: AuthRequest, res) => {
    try {
      const allAdvisors = memoryStore.getAdvisors();
      res.json(allAdvisors);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch advisors: ' + error.message });
    }
  });

  app.get('/api/clients', requireAuth, async (req: AuthRequest, res) => {
    try {
      const searchVal = req.query.search as string;
      const allClients = memoryStore.getClients(searchVal);
      res.json(allClients);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch clients: ' + error.message });
    }
  });

  app.post('/api/clients', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { name, email, phone, company, homeAddress, sinceYear } = req.body;
      if (!name || !email) {
        return res.status(400).json({ error: 'Name und E-Mail sind erforderlich.' });
      }

      const client = memoryStore.addClient({
        name,
        email,
        phone,
        company,
        homeAddress: homeAddress || 'Lagerhofstraße 2, 04103 Leipzig',
        sinceYear: sinceYear ? parseInt(sinceYear) : new Date().getFullYear(),
      });

      res.status(201).json(client);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to create client: ' + error.message });
    }
  });

  app.get('/api/appointments', async (req, res) => {
    try {
      const searchVal = req.query.search as string;
      const dateVal = req.query.date as string;
      const statusVal = req.query.status as string;
      const advisorId = req.query.advisorId ? parseInt(req.query.advisorId as string) : undefined;

      const results = memoryStore.getAppointments({
        search: searchVal,
        date: dateVal,
        status: statusVal,
        advisorId
      }).map(formatAppointment);

      res.json(results);
    } catch (error: any) {
      console.error('Failed to fetch appointments:', error);
      res.status(500).json({ error: 'Failed to fetch appointments: ' + error.message });
    }
  });

  app.post('/api/appointments', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { clientId, advisorId, title, taskReason, date, startTime, endTime, status, notes } = req.body;
      if (!clientId || !title || !date || !startTime || !endTime) {
        return res.status(400).json({ error: 'Pflichtfelder fehlen: clientId, title, date, startTime, endTime' });
      }

      const client = memoryStore.getClientById(parseInt(clientId));
      const apt = memoryStore.addAppointment({
        clientId: parseInt(clientId),
        advisorId: advisorId ? parseInt(advisorId) : 1,
        title,
        taskReason: taskReason || 'Erstberatung',
        date,
        startTime,
        endTime,
        status: status || 'Scheduled',
        notes,
      });

      const userKey = client?.userId || `client-${clientId}`;
      memoryStore.getOrCreateAppointmentRoom(userKey, apt.id, apt.title);

      res.status(201).json(formatAppointment(apt));
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to create appointment: ' + error.message });
    }
  });

  app.patch('/api/appointments/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { title, taskReason, date, startTime, endTime, status, notes, advisorId } = req.body;
      const numId = parseInt(id);

      const updated = memoryStore.updateAppointment(numId, {
        title,
        taskReason,
        date,
        startTime,
        endTime,
        status,
        notes,
        advisorId: advisorId !== undefined ? (advisorId ? parseInt(advisorId) : null) : undefined,
      });

      if (!updated) {
        return res.status(404).json({ error: 'Termin nicht gefunden' });
      }

      res.json(formatAppointment(updated));
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to update appointment: ' + error.message });
    }
  });

  app.delete('/api/appointments/:id', requireAuth, async (req: AuthRequest, res) => {
    try {
      const { id } = req.params;
      const numId = parseInt(id);

      const success = memoryStore.deleteAppointment(numId);
      res.json({ success, message: 'Termin erfolgreich gelöscht' });
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to delete appointment: ' + error.message });
    }
  });

  app.get('/api/appointments/:id/documents', async (req, res) => {
    try {
      const { id } = req.params;
      const docs = memoryStore.getDocuments({ appointmentId: parseInt(id) });
      res.json(docs);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to fetch documents: ' + error.message });
    }
  });

  app.post('/api/appointments/:id/documents', async (req, res) => {
    try {
      const { id } = req.params;
      const { fileName, fileSize, fileUrl, label, documentDate } = req.body;
      if (!fileName) {
        return res.status(400).json({ error: 'fileName is required.' });
      }

      const doc = memoryStore.addDocument({
        appointmentId: parseInt(id),
        fileName,
        fileSize: fileSize || '1.5 MB',
        fileUrl: fileUrl || '#',
        label: label || 'Dokument',
        documentDate: documentDate || new Date().toISOString().split('T')[0],
      });
      res.status(201).json(doc);
    } catch (error: any) {
      res.status(500).json({ error: 'Failed to attach document: ' + error.message });
    }
  });

  // ==================== REAL-TIME CHAT & FILE UPLOAD API ====================

  // 1. Get or create a chat room
  app.post('/api/chat/rooms/get-or-create', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const { roomType, customerId, customerName, customerEmail, appointmentId, appointmentTitle } = req.body;

      const isAdmin = user.role === 'admin' || user.role === 'advisor';
      const targetCustomerId = customerId || user.id;
      const targetEmail = customerEmail || (isAdmin ? undefined : user.email);

      let room: ChatRoom;
      if (roomType === 'appointment_chat' && appointmentId) {
        room = memoryStore.getOrCreateAppointmentRoom(targetCustomerId, parseInt(appointmentId), appointmentTitle);
      } else {
        const name = isAdmin ? (customerName || 'Mandant') : user.name;
        room = memoryStore.getOrCreateGeneralRoom(targetCustomerId, name, targetEmail);
      }

      res.json(room);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to get/create chat room: ' + err.message });
    }
  });

  // 2. List chat rooms for the current user
  app.get('/api/chat/rooms', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const rooms = memoryStore.getRoomsForUser(user.id, user.role, user.email);
      res.json(rooms);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch rooms: ' + err.message });
    }
  });

  // 3. Fetch messages for a chat room
  app.get('/api/chat/rooms/:roomId/messages', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const { roomId } = req.params;

      const room = memoryStore.getRoom(roomId);
      if (room && !checkUserCanAccessRoom(user, room)) {
        return res.status(403).json({ error: 'Zugriff verweigert.' });
      }

      const msgs = memoryStore.getMessages(roomId);
      res.json(msgs);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch messages: ' + err.message });
    }
  });

  // 4. Send message to a chat room
  app.post('/api/chat/rooms/:roomId/messages', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const { roomId } = req.params;
      const { message, isHighAlert, attachmentId, senderName, senderRole } = req.body;

      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'Nachrichtentext darf nicht leer sein.' });
      }

      const room = memoryStore.getRoom(roomId);
      if (room && !checkUserCanAccessRoom(user, room)) {
        return res.status(403).json({ error: 'Zugriff verweigert.' });
      }

      const isAdmin = user.role === 'admin' || user.role === 'advisor';
      const role: UserRole = senderRole || (isAdmin ? 'admin' : 'customer');
      const name = senderName || user.name || (isAdmin ? 'Dr. Abdul Sattar' : 'Mandant');

      const confirmedMsg = memoryStore.addMessage({
        roomId,
        senderId: user.id,
        senderName: name,
        senderRole: role,
        message: message.trim(),
        isHighAlert: Boolean(isHighAlert && isAdmin),
        attachmentId,
      });

      // Broadcast immediately to all connected WebSockets in this room
      broadcastToRoom(roomId, { type: 'new_message', data: confirmedMsg, roomId });

      // If High Alert sent by Admin, trigger priority email
      if (confirmedMsg.isHighAlert && room?.appointmentId) {
        const apt = memoryStore.getAppointmentById(room.appointmentId);
        if (apt?.client?.email) {
          sendHighAlertMessageEmail({
            customerEmail: apt.client.email,
            customerName: apt.client.name,
            appointmentTitle: apt.title,
            messageContent: message.trim(),
            advisorName: user.name,
          });
        }
      }

      return res.status(201).json(confirmedMsg);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to send message: ' + err.message });
    }
  });

  // 5. Fetch documents/gallery items for a room
  app.get('/api/chat/rooms/:roomId/documents', requireAuth, async (req: AuthRequest, res) => {
    try {
      const user = req.user!;
      const { roomId } = req.params;

      const room = memoryStore.getRoom(roomId);
      if (room && !checkUserCanAccessRoom(user, room)) {
        return res.status(403).json({ error: 'Zugriff verweigert.' });
      }

      const docs = memoryStore.getDocuments({ 
        chatRoomId: roomId, 
        appointmentId: room?.appointmentId || undefined 
      });

      res.json(docs);
    } catch (err: any) {
      res.status(500).json({ error: 'Failed to fetch documents: ' + err.message });
    }
  });

  // 6. Upload file directly into chat room / gallery
  app.post('/api/chat/rooms/:roomId/upload', requireAuth, (req: AuthRequest, res) => {
    upload.single('file')(req as any, res as any, async (err: any) => {
      if (err) {
        const msg = err.message || 'Upload fehlgeschlagen.';
        return res.status(400).json({ error: msg });
      }

      try {
        const user = req.user!;
        const { roomId } = req.params;
        const file = (req as any).file;

        if (!file) {
          return res.status(400).json({ error: 'Keine Datei übermittelt.' });
        }

        const room = memoryStore.getRoom(roomId);
        if (room && !checkUserCanAccessRoom(user, room)) {
          if (file.path && fs.existsSync(file.path)) fs.unlinkSync(file.path);
          return res.status(403).json({ error: 'Zugriff verweigert.' });
        }

        const label = ((req.body.label as string) || file.originalname).trim();
        const documentDate = (req.body.documentDate as string) || new Date().toISOString().split('T')[0];
        const appointmentId = req.body.appointmentId ? parseInt(req.body.appointmentId) : (room?.appointmentId || null);

        const cleanFileName = path.basename(file.originalname).replace(/[\r\n\t]/g, '').trim();
        const fileSizeStr = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
        const isImage = file.mimetype.startsWith('image/');

        const fileId = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
        const fileUrl = `/api/chat/files/${fileId}`;

        const uploaderId = req.body.uploaderId || user.id;
        const uploaderName = req.body.uploaderName || user.name;
        const uploaderRole = req.body.uploaderRole || user.role;

        const doc: AppointmentDocument = memoryStore.addDocument({
          appointmentId,
          chatRoomId: roomId,
          uploaderId,
          uploaderName,
          uploaderRole,
          fileName: cleanFileName,
          fileSize: fileSizeStr,
          fileUrl,
          fileType: file.mimetype,
          mimeType: file.mimetype,
          storagePath: file.filename,
          isImage,
          label: label || 'Dokument',
          documentDate,
        });

        (doc as any).id = fileId;

        const chatNotice = isImage 
          ? `🖼️ Neues Bild hochgeladen: [${doc.label}] (${cleanFileName}, ${fileSizeStr})`
          : `📄 Neues Dokument hochgeladen: [${doc.label}] (${cleanFileName}, ${fileSizeStr})`;

        const message = memoryStore.addMessage({
          roomId,
          senderId: user.id,
          senderName: user.name,
          senderRole: user.role,
          message: chatNotice,
          attachmentId: fileId,
          attachment: doc,
        });

        // Broadcast new document and message over WebSockets
        broadcastToRoom(roomId, { type: 'new_document', data: doc, roomId });
        broadcastToRoom(roomId, { type: 'new_message', data: message, roomId });

        res.status(201).json({
          success: true,
          doc,
          message,
        });
      } catch (uploadErr: any) {
        console.error('Upload processing error:', uploadErr);
        res.status(500).json({ error: 'Fehler beim Verarbeiten der Datei: ' + uploadErr.message });
      }
    });
  });

  // 7. Secure File Serving Endpoint
  app.get('/api/chat/files/:fileId', async (req, res) => {
    try {
      const { fileId } = req.params;
      const user = await resolveAuthUser(req);

      const doc = memoryStore.getDocumentById(fileId);
      if (!doc || !doc.storagePath) {
        return res.status(404).json({ error: 'Datei nicht gefunden.' });
      }

      if (user && doc.chatRoomId) {
        const room = memoryStore.getRoom(doc.chatRoomId);
        if (room && !checkUserCanAccessRoom(user, room)) {
          return res.status(403).json({ error: 'Zugriff verweigert.' });
        }
      }

      const filePath = path.join(uploadDir, path.basename(doc.storagePath));
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Datei existiert nicht mehr auf dem Server.' });
      }

      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Content-Security-Policy', "default-src 'none'");
      res.setHeader('Cache-Control', 'private, max-age=86400');

      const mimeType = doc.mimeType || doc.fileType || 'application/octet-stream';
      res.setHeader('Content-Type', mimeType);

      const encodedFilename = encodeURIComponent(doc.fileName);
      const isInline = mimeType.startsWith('image/') || mimeType === 'application/pdf';
      const disposition = isInline ? 'inline' : 'attachment';
      res.setHeader('Content-Disposition', `${disposition}; filename="${doc.fileName.replace(/"/g, '')}"; filename*=UTF-8''${encodedFilename}`);

      const stream = fs.createReadStream(filePath);
      stream.pipe(res);
    } catch (err: any) {
      res.status(500).json({ error: 'Fehler beim Abrufen der Datei: ' + err.message });
    }
  });

  // 8. Real-time Server-Sent Events (SSE) Room Stream (Fallback)
  app.get('/api/chat/rooms/:roomId/events', async (req, res) => {
    const { roomId } = req.params;
    const user = await resolveAuthUser(req);

    const room = memoryStore.getRoom(roomId);
    if (user && room && !checkUserCanAccessRoom(user, room)) {
      return res.status(403).json({ error: 'Zugriff verweigert.' });
    }

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    res.write(`data: ${JSON.stringify({ type: 'connected', roomId })}\n\n`);

    const unsubscribe = memoryStore.subscribeToRoom(roomId, (event) => {
      res.write(`data: ${JSON.stringify(event)}\n\n`);
    });

    const keepAliveTimer = setInterval(() => {
      res.write(': keepalive\n\n');
    }, 20000);

    req.on('close', () => {
      clearInterval(keepAliveTimer);
      unsubscribe();
    });
  });

  // ==================== STATIC ASSETS & SPA SERVING ====================
  const customerDistCandidates = [
    path.resolve(process.cwd(), 'customer_portal/dist'),
    path.resolve(process.cwd(), '../customer_portal/dist'),
  ];
  const customerDist = customerDistCandidates.find(p => fs.existsSync(p)) || customerDistCandidates[0];

  const adminDistCandidates = [
    path.resolve(process.cwd(), 'admin_portal/dist'),
    path.resolve(process.cwd(), '../admin_portal/dist'),
  ];
  const adminDist = adminDistCandidates.find(p => fs.existsSync(p)) || adminDistCandidates[0];
  const localDist = path.resolve(process.cwd(), 'dist');

  // Serve Admin Portal at /admin
  if (fs.existsSync(adminDist)) {
    app.use('/admin', express.static(adminDist));
    app.get('/admin*', (req, res) => {
      res.sendFile(path.join(adminDist, 'index.html'));
    });
  }

  // Serve Customer Portal at /
  if (fs.existsSync(customerDist)) {
    app.use(express.static(customerDist));
    app.get('*', (req, res) => {
      res.sendFile(path.join(customerDist, 'index.html'));
    });
  } else if (fs.existsSync(localDist) && fs.existsSync(path.join(localDist, 'index.html'))) {
    app.use(express.static(localDist));
    app.get('*', (req, res) => {
      res.sendFile(path.join(localDist, 'index.html'));
    });
  } else {
    app.get('/', (req, res) => {
      res.json({
        status: 'online',
        name: 'A u.S Booking System API Server',
        health: '/api/health',
        customer_portal: 'http://localhost:3000',
        admin_portal: 'http://localhost:3001',
      });
    });
  }

  // Start HTTP and WebSocket server
  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`✅ A u.S API & WebSocket Server running on port ${PORT} (PID: ${process.pid})`);
  });
}

startServer().catch((error) => {
  console.error('Server failed to start:', error);
});
