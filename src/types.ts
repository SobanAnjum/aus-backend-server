export type AppointmentStatus = 
  | 'Scheduled' 
  | 'Canceled' 
  | 'Not Attended' 
  | 'Rescheduled' 
  | 'In Progress' 
  | 'Query Completed'
  // Backward compatibility aliases if needed
  | 'Bestätigt' 
  | 'Verschoben' 
  | 'Storniert';

export type UserRole = 'customer' | 'admin' | 'advisor';

export interface UserProfile {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  homeAddress: string;
  companyName?: string | null;
  role: UserRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface Client {
  id: number;
  userId?: string;
  name: string;
  email: string;
  phone: string | null;
  company?: string | null;
  homeAddress?: string | null;
  sinceYear: number;
}

export interface Advisor {
  id: number;
  uid?: string;
  email: string;
  name: string;
  role: string;
  title?: string;
  avatar?: string;
  specialization?: string;
}

export interface AppointmentDocument {
  id: number | string;
  appointmentId?: number | null;
  chatRoomId?: string;
  uploaderId?: string;
  uploaderName?: string;
  uploaderRole?: UserRole;
  fileName: string;
  fileSize: string;
  fileUrl: string;
  fileType?: string;
  mimeType?: string;
  storagePath?: string;
  isImage?: boolean;
  label: string; // e.g. "Tax Assessment 2023", "Receipt/Bon", "Official Notice"
  documentDate?: string; // Date of the document/letter/receipt
  uploadedAt?: string;
}

export interface Appointment {
  id: number;
  title: string;
  taskReason?: string; // Task or Reason for the appointment (editable by admin)
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  status: AppointmentStatus;
  notes: string;
  client: Client;
  advisor: Advisor | null;
  bookingRef?: string;
  serviceCategory?: string;
  documents?: AppointmentDocument[];
  createdAt?: string;
  isGuest?: boolean;
  userId?: string | null;
}

export type ViewMode = 'Tag' | 'Woche' | 'Monat';

// Multi-Room Chat Models
export type ChatRoomType = 'general_ticket' | 'appointment_chat';

export interface ChatRoom {
  id: string;
  roomType: ChatRoomType;
  customerId: string;
  customerEmail?: string;
  appointmentId?: number | null;
  title?: string;
  createdAt: string;
  updatedAt?: string;
  unreadCount?: number;
  lastMessage?: string;
}

export interface ChatMessage {
  id: number | string;
  roomId: string;
  senderId: string;
  senderName?: string;
  senderRole?: UserRole;
  message: string;
  isHighAlert?: boolean;
  attachmentId?: number | string;
  attachment?: AppointmentDocument;
  createdAt: string;
  status?: 'sending' | 'sent' | 'delivered' | 'error';
}

// Corporate Services
export interface CorporateService {
  id: string;
  title: string;
  category: 'tax' | 'audit' | 'consulting' | 'finance' | 'accounting' | 'office';
  categoryLabel: string;
  shortDesc: string;
  fullDesc: string;
  durationMinutes: number;
  durationLabel: string;
  iconName: string;
  popular?: boolean;
  bulletPoints: string[];
  targetAudience: string;
}

export type ServiceItem = CorporateService;

export interface BookingFormData {
  serviceId: string;
  serviceTitle: string;
  advisorId: number | null;
  date: string;
  startTime: string;
  endTime: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  homeAddress?: string;
  company: string;
  taskReason: string;
  notes: string;
  acceptTerms: boolean;
  isGuest?: boolean;
}

export interface BookingConfirmation {
  bookingRef: string;
  appointment: Appointment;
  message: string;
}

// Admin Availability & Next-Month Schedule Models
export type DayAvailabilityStatus = 'available_all_day' | 'custom_slots' | 'unavailable';

export interface CustomTimeSlot {
  startTime: string;
  endTime: string;
}

export interface AdminAvailability {
  id?: number;
  date: string; // YYYY-MM-DD
  status: DayAvailabilityStatus;
  customSlots?: CustomTimeSlot[];
  notes?: string;
  updatedAt?: string;
}
