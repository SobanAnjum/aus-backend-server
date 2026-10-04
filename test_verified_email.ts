import { 
  sendVerificationOtpEmail, 
  sendCustomerBookingConfirmation, 
  sendAdminNewBookingAlert, 
  sendHighAlertMessageEmail,
  BookingNotificationData
} from './src/lib/emailService.ts';

async function testWithVerifiedAccount() {
  console.log('Testing live dispatch to Resend verified email: sobananjum0@gmail.com ...');
  
  // 1. Live OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpRes = await sendVerificationOtpEmail('sobananjum0@gmail.com', otpCode);
  console.log('OTP to sobananjum0@gmail.com:', JSON.stringify(otpRes, null, 2));

  // 2. Customer Booking Email
  const bookingPayload: BookingNotificationData = {
    bookingRef: `AUS-${Date.now().toString().slice(-6)}`,
    clientName: 'Max Mustermann',
    clientEmail: 'sobananjum0@gmail.com',
    clientPhone: '+49 89 12345678',
    serviceTitle: 'Jahresabschluss & Steuererklärung',
    date: '2026-09-02',
    startTime: '10:00',
    endTime: '11:00',
    taskReason: 'Erstellung Jahresabschluss für GmbH',
    company: 'Mustermann Holding GmbH',
  };

  const custRes = await sendCustomerBookingConfirmation(bookingPayload);
  console.log('Customer Email to sobananjum0@gmail.com:', JSON.stringify(custRes, null, 2));
}

testWithVerifiedAccount().catch(console.error);
