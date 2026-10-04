import { memoryStore } from './src/db/index.ts';
import { resolveAuthUser } from './src/middleware/auth.ts';

async function runTests() {
  console.log('=== RUNNING SECURITY & CHAT & GALLERY TEST SUITE ===');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, description: string) {
    if (condition) {
      console.log(`✅ PASS: ${description}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${description}`);
      failed++;
    }
  }

  // 1. Test Room Creation & Isolation
  console.log('\n--- 1. Testing Chat Room Creation & Isolation ---');
  const userA = { id: 'usr_test_alpha', email: 'alpha@test.de', role: 'customer' as const };
  const userB = { id: 'usr_test_beta', email: 'beta@test.de', role: 'customer' as const };

  const roomA = memoryStore.getOrCreateGeneralRoom(userA.id, 'Alpha Mandant');
  assert(roomA.id === `general-${userA.id}`, 'User A General room has expected ID');
  assert(roomA.customerId === userA.id, 'User A room belongs to User A');

  const aptRoomA = memoryStore.getOrCreateAppointmentRoom(userA.id, 101, 'Steuerberatung 2024');
  assert(aptRoomA.id === 'apt-room-101', 'Appointment room has expected ID');
  assert(aptRoomA.appointmentId === 101, 'Appointment room references appointment 101');

  // 2. Test Message Creation & Identity Assurance
  console.log('\n--- 2. Testing Chat Messages & Identity Protection ---');
  const msg1 = memoryStore.addMessage({
    roomId: roomA.id,
    senderId: userA.id,
    senderName: 'Alpha Mandant',
    senderRole: 'customer',
    message: 'Hallo Kanzlei, hier ist mein Beleg.',
    isHighAlert: false,
  });

  assert(msg1.roomId === roomA.id, 'Message saved in correct room');
  assert(msg1.senderId === userA.id, 'Message sender ID preserved');
  assert(msg1.senderRole === 'customer', 'Message sender role preserved');

  const messagesRoomA = memoryStore.getMessages(roomA.id);
  assert(messagesRoomA.length >= 1, 'Room A has messages');
  assert(messagesRoomA.some(m => m.id === msg1.id), 'Message found in room');

  // 3. Test File Metadata & Document Storage
  console.log('\n--- 3. Testing Secure Document & Media Storage ---');
  const doc1 = memoryStore.addDocument({
    appointmentId: 101,
    chatRoomId: aptRoomA.id,
    uploaderId: userA.id,
    uploaderName: 'Alpha Mandant',
    uploaderRole: 'customer',
    fileName: 'Einkommensteuererklärung_2023.pdf',
    fileSize: '1.24 MB',
    fileUrl: '/api/chat/files/doc_test_123',
    fileType: 'application/pdf',
    mimeType: 'application/pdf',
    storagePath: 'E:\\uploads\\test_uuid.pdf',
    label: 'Steuerbescheid 2023',
    documentDate: '2024-03-15',
    isImage: false,
  });

  assert(doc1.id !== undefined, 'Document assigned an ID');
  assert(doc1.label === 'Steuerbescheid 2023', 'Document label saved');
  assert(doc1.isImage === false, 'PDF correctly flagged as non-image');

  const imgDoc = memoryStore.addDocument({
    appointmentId: 101,
    chatRoomId: aptRoomA.id,
    uploaderId: 'admin_1',
    uploaderName: 'Abdul Sattar',
    uploaderRole: 'admin',
    fileName: 'Kanzlei_Signatur.png',
    fileSize: '0.45 MB',
    fileUrl: '/api/chat/files/doc_test_img',
    fileType: 'image/png',
    mimeType: 'image/png',
    storagePath: 'E:\\uploads\\test_img_uuid.png',
    label: 'Kanzleistempel',
    documentDate: '2024-04-01',
    isImage: true,
  });

  assert(imgDoc.isImage === true, 'PNG correctly marked as image');

  // Query documents for room
  const docsForAptRoom = memoryStore.getDocuments(101, aptRoomA.id);
  assert(docsForAptRoom.length >= 2, 'Found all uploaded documents for appointment room');

  // 4. Test PubSub / SSE Event Bus
  console.log('\n--- 4. Testing SSE Real-Time Event Dispatch ---');
  let receivedEvent: any = null;
  const unsubscribe = memoryStore.subscribeToRoom(aptRoomA.id, (event) => {
    receivedEvent = event;
  });

  memoryStore.emitRoomEvent(aptRoomA.id, {
    type: 'new_message',
    data: {
      id: 999,
      roomId: aptRoomA.id,
      senderId: 'admin_1',
      message: 'Willkommen zur Beratung',
      createdAt: new Date().toISOString(),
    },
  });

  assert(receivedEvent !== null, 'SSE listener received emitted event');
  assert(receivedEvent?.type === 'new_message', 'Received event is new_message');
  assert(receivedEvent?.data?.id === 999, 'Received event payload contains message ID');

  unsubscribe();

  // 5. Test Auth Resolver Token Protections
  console.log('\n--- 5. Testing Customer Token Authentication & Isolation ---');
  // Register user profile
  memoryStore.registerUser('hashed_pass', {
    id: userA.id,
    email: userA.email,
    firstName: 'Alpha',
    lastName: 'Mandant',
    phone: '01711234567',
    role: 'customer',
    createdAt: new Date().toISOString(),
  });

  const reqMockUserA: any = {
    headers: { authorization: `Bearer token_${userA.id}` },
  };
  const resolvedA = await resolveAuthUser(reqMockUserA);
  assert(resolvedA?.uid === userA.id, 'Resolved user matches customer ID');
  assert(resolvedA?.role === 'customer', 'Resolved user has customer role');

  const reqMockAdmin: any = {
    headers: { authorization: 'Bearer demo-token' },
  };
  const resolvedAdmin = await resolveAuthUser(reqMockAdmin);
  assert(resolvedAdmin?.role === 'admin', 'Demo token resolves to admin');

  console.log(`\n==============================================`);
  console.log(`TEST SUMMARY: ${passed} PASSED, ${failed} FAILED`);
  console.log(`==============================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Test execution error:', err);
  process.exit(1);
});
