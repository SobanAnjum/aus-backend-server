import { 
  sendVerificationOtpEmail, 
  sendCustomerBookingConfirmation, 
  sendAdminNewBookingAlert, 
  sendHighAlertMessageEmail,
  BookingNotificationData
} from './src/lib/emailService.ts';

async function runEmailAndOtpVerification() {
  console.log('====================================================');
  console.log('🧪 RUNNING EMAIL & OTP VERIFICATION TEST SUITE');
  console.log('====================================================\n');

  // Test 1: Send OTP to Admin / Account Owner email (authorized on Resend sandbox)
  console.log('--- 1. Testing OTP Generation & Dispatch ---');
  const testOtpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const targetEmail = 'sobananjumde@gmail.com';

  const otpResult = await sendVerificationOtpEmail(targetEmail, testOtpCode);
  console.log('OTP Result:', JSON.stringify(otpResult, null, 2));

  if (!otpResult.success && otpResult.error) {
    console.error('❌ OTP dispatch failed:', otpResult.error);
  } else {
    console.log(`✅ OTP Code [${testOtpCode}] sent successfully to ${targetEmail} (Mode: ${otpResult.mode})`);
  }

  // Test 2: Customer Booking Confirmation Email
  console.log('\n--- 2. Testing Customer Booking Confirmation Email ---');
  const bookingPayload: BookingNotificationData = {
    bookingRef: `AUS-${Date.now().toString().slice(-6)}`,
    clientName: 'Max Mustermann (Mandant)',
    clientEmail: 'sobananjumde@gmail.com', // Sent to verified inbox
    clientPhone: '+49 89 12345678',
    serviceTitle: 'Jahresabschluss & Steuererklärung',
    date: '2026-09-02',
    startTime: '10:00',
    endTime: '11:00',
    taskReason: 'Erstellung Jahresabschluss und steuerliche Optimierung für GmbH',
    company: 'Mustermann Holding GmbH',
    homeAddress: 'Maximilianstraße 35, 80539 München',
    notes: 'Bitte Unterlagen für Vorjahr bereithalten',
  };

  const customerEmailResult = await sendCustomerBookingConfirmation(bookingPayload);
  console.log('Customer Booking Email Result:', JSON.stringify(customerEmailResult, null, 2));
  if (customerEmailResult.success) {
    console.log('✅ Customer booking confirmation email dispatched successfully!');
  } else {
    console.log('❌ Customer email failed:', customerEmailResult.error);
  }

  // Test 3: Admin New Booking Alert Email
  console.log('\n--- 3. Testing Admin New Booking Alert Email ---');
  const adminEmailResult = await sendAdminNewBookingAlert(bookingPayload);
  console.log('Admin Alert Email Result:', JSON.stringify(adminEmailResult, null, 2));
  if (adminEmailResult.success) {
    console.log('✅ Admin new booking alert email dispatched successfully to admin inbox!');
  } else {
    console.log('❌ Admin email failed:', adminEmailResult.error);
  }

  // Test 4: High Alert Priority Email
  console.log('\n--- 4. Testing High Alert Priority Message Email ---');
  const highAlertResult = await sendHighAlertMessageEmail({
    customerEmail: 'sobananjumde@gmail.com',
    customerName: 'Max Mustermann',
    appointmentTitle: 'Jahresabschluss & Steuererklärung',
    messageContent: 'Wichtige Rückfrage: Bitte laden Sie die BWA vom 4. Quartal bis morgen hoch.',
    advisorName: 'Abdul Sattar (Kanzleiinhaber)',
  });
  console.log('High Alert Email Result:', JSON.stringify(highAlertResult, null, 2));
  if (highAlertResult.success) {
    console.log('✅ High alert priority email dispatched successfully!');
  } else {
    console.log('❌ High alert email failed:', highAlertResult.error);
  }

  console.log('\n====================================================');
  console.log('🎉 ALL EMAIL & OTP TESTS COMPLETED');
  console.log('====================================================');
}

runEmailAndOtpVerification().catch(console.error);
