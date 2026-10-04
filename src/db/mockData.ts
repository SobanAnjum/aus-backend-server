import { Client, Advisor, Appointment, AppointmentDocument } from '../types.ts';

export const initialAdvisors: Advisor[] = [
  {
    id: 1,
    uid: 'abdul-sattar-founder',
    name: 'Dr. Abdul Sattar',
    email: 'abdul.sattar@aus-beratung.de',
    role: 'admin',
    title: 'Inhaber der A u. S Wirtschaftsberatung e.K.',
    specialization: 'Buchhalter / Buchhaltung & Büroservice in Leipzig',
    avatar: '/assets/abdul_sattar.png'
  }
];

export const initialClients: Client[] = [];
export const initialAppointments: Appointment[] = [];
export const initialDocuments: AppointmentDocument[] = [];
