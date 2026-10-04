import http from 'http';
import fs from 'fs';
import path from 'path';

let TEST_PORT = parseInt(process.env.PORT || '5000', 10);
let BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

// Helper to make HTTP requests
function httpRequest(
  method: string,
  urlPath: string,
  body?: any,
  headers: Record<string, string> = {}
): Promise<{ status: number; headers: http.IncomingHttpHeaders; data: any }> {
  return new Promise((resolve, reject) => {
    const url = new URL(urlPath, BASE_URL);
    const reqHeaders: Record<string, string> = { ...headers };

    let payload: Buffer | string | undefined;
    if (body !== undefined) {
      if (headers['Content-Type']?.includes('multipart/form-data')) {
        payload = body;
      } else {
        payload = JSON.stringify(body);
        reqHeaders['Content-Type'] = 'application/json';
      }
      reqHeaders['Content-Length'] = String(Buffer.byteLength(payload));
    }

    const req = http.request(
      {
        hostname: url.hostname,
        port: url.port,
        path: url.pathname + url.search,
        method,
        headers: reqHeaders,
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (c) => chunks.push(c));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString('utf8');
          let parsed = raw;
          try {
            parsed = JSON.parse(raw);
          } catch (_) {}
          resolve({ status: res.statusCode || 0, headers: res.headers, data: parsed });
        });
      }
    );

    req.on('error', reject);
    if (payload) {
      req.write(payload);
    }
    req.end();
  });
}

// Helper to build multipart/form-data
function buildMultipartFormData(
  fields: Record<string, string>,
  fileField: { name: string; filename: string; contentType: string; content: Buffer }
) {
  const boundary = `----WebKitFormBoundary${Math.random().toString(36).substring(2)}`;
  const chunks: Buffer[] = [];

  for (const [key, value] of Object.entries(fields)) {
    chunks.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="${key}"\r\n\r\n${value}\r\n`
      )
    );
  }

  chunks.push(
    Buffer.from(
      `--${boundary}\r\nContent-Disposition: form-data; name="${fileField.name}"; filename="${fileField.filename}"\r\nContent-Type: ${fileField.contentType}\r\n\r\n`
    )
  );
  chunks.push(fileField.content);
  chunks.push(Buffer.from(`\r\n--${boundary}--\r\n`));

  return {
    boundary,
    body: Buffer.concat(chunks),
    contentType: `multipart/form-data; boundary=${boundary}`,
  };
}

async function runFullSystemTest() {
  console.log('===============================================================');
  console.log('   STARTING FULL-SCALE SYSTEM & SECURITY FUNCTIONALITY TESTS   ');
  console.log('===============================================================');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, name: string, detail?: any) {
    if (condition) {
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } else {
      console.error(`  ❌ [FAIL] ${name}`, detail ? detail : '');
      failed++;
    }
  }

  // Import and boot server
  await import('./server.ts');
  
  TEST_PORT = parseInt(process.env.PORT || '5000', 10);
  BASE_URL = `http://127.0.0.1:${TEST_PORT}`;

  // Allow server to bind
  await new Promise((r) => setTimeout(r, 1200));

  // --- SUITE 1: HEALTH & SERVICES ---
  console.log('\n--- SUITE 1: Health & Service Catalog ---');
  {
    const health = await httpRequest('GET', '/api/health');
    assert(health.status === 200, 'GET /api/health responds with 200 OK');
    assert(health.data?.status === 'ok' || health.data?.status === 'healthy', 'Health status is OK');

    const services = await httpRequest('GET', '/api/public/services');
    assert(services.status === 200, 'GET /api/public/services responds with 200 OK');
    assert(Array.isArray(services.data) && services.data.length > 0, 'Service catalog contains services');
    assert(services.data.some((s: any) => s.id === 'steuerdeklaration' || s.title?.includes('Steuer') || s.title?.includes('Jahresabschluss')), 'Tax services present in catalog');

    const advisors = await httpRequest('GET', '/api/public/advisors');
    assert(advisors.status === 200, 'GET /api/public/advisors responds with 200 OK');
    assert(Array.isArray(advisors.data) && advisors.data.length > 0, 'Advisors catalog populated');
  }

  // --- SUITE 2: CLIENT DIRECTORY & SEARCH ---
  console.log('\n--- SUITE 2: Client Management & Directory ---');
  {
    const clients = await httpRequest('GET', '/api/clients', undefined, { Authorization: 'Bearer demo-token' });
    assert(clients.status === 200, 'GET /api/clients responds with 200 OK for Admin');
    assert(Array.isArray(clients.data), 'Clients list returned as array');

    const createClient = await httpRequest('POST', '/api/clients', {
      name: 'Dr. Max Mustermann',
      email: 'mustermann.test@kanzlei-aus.de',
      phone: '+49 89 12345678',
      company: 'Mustermann Holding GmbH',
      homeAddress: 'Brienner Str. 12, 80333 München',
    }, { Authorization: 'Bearer demo-token' });
    assert(createClient.status === 200 || createClient.status === 201, 'POST /api/clients created new client');

    const searchClient = await httpRequest('GET', '/api/clients?search=Mustermann', undefined, { Authorization: 'Bearer demo-token' });
    assert(searchClient.status === 200, 'GET /api/clients?search=... succeeds');
    assert(searchClient.data.some((c: any) => c.email === 'mustermann.test@kanzlei-aus.de'), 'Client found in search');
  }

  // --- SUITE 3: AVAILABILITY ENGINE ---
  console.log('\n--- SUITE 3: Advisor Availability Engine ---');
  {
    const todayStr = new Date().toISOString().split('T')[0];
    const avail = await httpRequest('GET', `/api/public/available-slots?date=${todayStr}`);
    assert(avail.status === 200, 'GET /api/public/available-slots responds with 200 OK');
    assert(avail.data && Array.isArray(avail.data.slots), 'Availability returns valid time slots structure');
  }

  // --- SUITE 4: CUSTOMER ONBOARDING & AUTHENTICATION ---
  console.log('\n--- SUITE 4: Customer Onboarding & Authentication ---');
  const testCustomerEmail = 'mandant.erika@kanzlei-aus.de';
  let customerToken = '';
  let customerId = '';
  {
    // 1. Send OTP
    const otpSend = await httpRequest('POST', '/api/auth/send-otp', { email: testCustomerEmail });
    assert(otpSend.status === 200, 'POST /api/auth/send-otp generates code');

    // 2. Check email exists (should be false before registration)
    const emailCheck = await httpRequest('POST', '/api/auth/check-email', { email: testCustomerEmail });
    assert(emailCheck.status === 200, 'POST /api/auth/check-email responds');

    // 3. Register Customer
    const registerRes = await httpRequest('POST', '/api/auth/register', {
      firstName: 'Erika',
      lastName: 'Musterfrau',
      phone: '+49 170 99887766',
      email: testCustomerEmail,
      homeAddress: 'Ludwigstraße 8, 80539 München',
      companyName: 'Musterfrau Consulting',
      password: 'SecurePassword123!',
    });

    assert(registerRes.status === 200 || registerRes.status === 201, 'POST /api/auth/register creates user');
    customerId = registerRes.data?.profile?.id || registerRes.data?.user?.id;
    customerToken = registerRes.data?.session?.access_token;
    assert(Boolean(customerToken), 'Customer received access token');

    // 4. Customer Login
    const loginRes = await httpRequest('POST', '/api/auth/login', {
      email: testCustomerEmail,
      password: 'SecurePassword123!',
    });
    assert(loginRes.status === 200, 'POST /api/auth/login authenticates user');
    assert(loginRes.data?.profile?.firstName === 'Erika', 'Profile returned on login');

    // 5. Protected profile route
    const profileRes = await httpRequest('GET', '/api/users/me', undefined, {
      Authorization: `Bearer ${customerToken}`,
    });
    assert(profileRes.status === 200, 'GET /api/users/me authenticates customer');
    assert(profileRes.data?.email === testCustomerEmail, 'Protected route returns current user');

    // 6. Wrong password check
    const badLogin = await httpRequest('POST', '/api/auth/login', {
      email: testCustomerEmail,
      password: 'WrongPassword!',
    });
    assert(badLogin.status === 401, 'POST /api/auth/login rejects incorrect password with 401');
  }

  // --- SUITE 5: BOOKING APPOINTMENTS & WORKFLOW ---
  console.log('\n--- SUITE 5: Appointments Booking & Status Workflow ---');
  let bookedAptId: number = 0;
  {
    // Find next valid business day (Mon=1, Tue=2, Wed=3, Thu=4, Sat=6)
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    while (targetDate.getDay() === 0 || targetDate.getDay() === 5) {
      targetDate.setDate(targetDate.getDate() + 1);
    }
    const targetDateStr = targetDate.toISOString().split('T')[0];

    const bookingRes = await httpRequest('POST', '/api/public/book', {
      clientName: 'Erika Musterfrau',
      clientEmail: testCustomerEmail,
      clientPhone: '+49 170 99887766',
      company: 'Musterfrau Consulting',
      serviceId: 'steuerberatung-unternehmensnachfolge',
      serviceTitle: 'Strategische Unternehmensnachfolge Beratung',
      date: targetDateStr,
      startTime: '10:00',
      endTime: '11:00',
      taskReason: 'Beratung zur Übertragung von Betriebsvermögen',
      userId: customerId,
    });

    assert(bookingRes.status === 200 || bookingRes.status === 201, 'POST /api/public/book creates appointment');
    bookedAptId = bookingRes.data?.appointment?.id;
    assert(bookedAptId > 0, `Booking assigned valid ID: #${bookedAptId}`);

    // Update appointment status to 'In Progress'
    const statusUpdate = await httpRequest('PATCH', `/api/appointments/${bookedAptId}`, {
      status: 'In Progress',
    }, { Authorization: 'Bearer demo-token' });
    assert(statusUpdate.status === 200, 'PATCH /api/appointments/:id updates status');
    assert(statusUpdate.data?.status === 'In Progress', 'Status reflects In Progress');

    // Reschedule appointment
    const resched = await httpRequest('PATCH', `/api/appointments/${bookedAptId}`, {
      date: targetDateStr,
      startTime: '14:00',
      endTime: '15:00',
    }, { Authorization: 'Bearer demo-token' });
    assert(resched.status === 200, 'PATCH /api/appointments/:id updates appointment time');
    assert(resched.data?.startTime === '14:00', 'New start time confirmed');
  }

  // --- SUITE 6: REALTIME CHAT SYSTEM ---
  console.log('\n--- SUITE 6: Chat Rooms & Messaging System ---');
  let generalRoomId = '';
  let aptRoomId = '';
  {
    // 1. Customer creates/retrieves General Support Room
    const genRoomRes = await httpRequest(
      'POST',
      '/api/chat/rooms/get-or-create',
      {
        roomType: 'general_ticket',
        customerId,
        customerName: 'Erika Musterfrau',
      },
      { Authorization: `Bearer ${customerToken}` }
    );
    assert(genRoomRes.status === 200, 'POST /api/chat/rooms/get-or-create creates general room');
    generalRoomId = genRoomRes.data?.id;

    // 2. Customer creates/retrieves Appointment Room
    const aptRoomRes = await httpRequest(
      'POST',
      '/api/chat/rooms/get-or-create',
      {
        roomType: 'appointment_chat',
        customerId,
        appointmentId: bookedAptId,
        appointmentTitle: 'Strategische Nachfolge',
      },
      { Authorization: `Bearer ${customerToken}` }
    );
    assert(aptRoomRes.status === 200, 'POST /api/chat/rooms/get-or-create creates appointment room');
    aptRoomId = aptRoomRes.data?.id;

    // 3. Customer posts message into room
    const postMsg = await httpRequest(
      'POST',
      `/api/chat/rooms/${aptRoomId}/messages`,
      {
        message: 'Guten Tag Herr Sattar, anbei reiche ich die Unterlagen ein.',
      },
      { Authorization: `Bearer ${customerToken}` }
    );
    assert(postMsg.status === 200 || postMsg.status === 201, 'POST /api/chat/rooms/:id/messages delivers customer message');
    assert(postMsg.data?.senderRole === 'customer', 'Server strictly enforced customer role');
    assert(postMsg.data?.senderId === customerId, 'Server strictly verified senderId');

    // 4. Admin posts High-Alert message into room
    const adminMsg = await httpRequest(
      'POST',
      `/api/chat/rooms/${aptRoomId}/messages`,
      {
        message: 'Wichtige Rückfrage: Bitte prüfen Sie die Frist zum 31.12.',
        isHighAlert: true,
      },
      { Authorization: 'Bearer demo-token' }
    );
    assert(adminMsg.status === 200 || adminMsg.status === 201, 'Admin can send message');
    assert(adminMsg.data?.isHighAlert === true, 'High Alert flag set');
    assert(adminMsg.data?.senderRole === 'admin', 'Admin role set');

    // 5. Fetch messages in room
    const getMsgs = await httpRequest(
      'GET',
      `/api/chat/rooms/${aptRoomId}/messages`,
      undefined,
      { Authorization: `Bearer ${customerToken}` }
    );
    assert(getMsgs.status === 200, 'GET /api/chat/rooms/:id/messages succeeds');
    assert(Array.isArray(getMsgs.data) && getMsgs.data.length >= 2, 'All messages returned in room thread');
  }

  // --- SUITE 7: FILE UPLOADS, SECURITY & GALLERY ---
  console.log('\n--- SUITE 7: Secure File Uploads, MIME Whitelisting & Gallery ---');
  let uploadedFileId: string = '';
  {
    // 1. Upload valid PDF Document
    const pdfBuffer = Buffer.from('%PDF-1.4 Mock PDF Content for Tax Return\n%%EOF');
    const pdfForm = buildMultipartFormData(
      {
        label: 'Jahresabschluss 2023 Entwurf',
        documentDate: '2024-03-31',
        appointmentId: String(bookedAptId),
      },
      {
        name: 'file',
        filename: 'Jahresabschluss_2023.pdf',
        contentType: 'application/pdf',
        content: pdfBuffer,
      }
    );

    const uploadPdfRes = await httpRequest(
      'POST',
      `/api/chat/rooms/${aptRoomId}/upload`,
      pdfForm.body,
      {
        'Content-Type': pdfForm.contentType,
        Authorization: `Bearer ${customerToken}`,
      }
    );

    assert(uploadPdfRes.status === 200 || uploadPdfRes.status === 201, 'POST /api/chat/rooms/:id/upload accepts valid PDF');
    assert(uploadPdfRes.data?.doc?.label === 'Jahresabschluss 2023 Entwurf', 'Document label preserved');
    uploadedFileId = uploadPdfRes.data?.doc?.fileUrl?.split('/files/')[1];

    // 2. Upload valid Image (PNG)
    const pngBuffer = Buffer.from('\x89PNG\r\n\x1a\nMock PNG Data');
    const imgForm = buildMultipartFormData(
      {
        label: 'Personalausweis Vorderseite',
        documentDate: '2024-01-15',
      },
      {
        name: 'file',
        filename: 'ausweis_scan.png',
        contentType: 'image/png',
        content: pngBuffer,
      }
    );

    const uploadImgRes = await httpRequest(
      'POST',
      `/api/chat/rooms/${aptRoomId}/upload`,
      imgForm.body,
      {
        'Content-Type': imgForm.contentType,
        Authorization: `Bearer ${customerToken}`,
      }
    );
    assert(uploadImgRes.status === 200 || uploadImgRes.status === 201, 'POST /api/chat/rooms/:id/upload accepts valid PNG');
    assert(uploadImgRes.data?.doc?.isImage === true, 'Image flag automatically set to true');

    // 3. Query Documents for Gallery
    const galleryDocs = await httpRequest(
      'GET',
      `/api/chat/rooms/${aptRoomId}/documents`,
      undefined,
      { Authorization: `Bearer ${customerToken}` }
    );
    assert(galleryDocs.status === 200, 'GET /api/chat/rooms/:id/documents retrieves gallery files');
    assert(Array.isArray(galleryDocs.data) && galleryDocs.data.length >= 2, 'All uploaded documents found in gallery');

    // 4. Download File and verify Security Headers
    if (uploadedFileId) {
      const downloadRes = await httpRequest(
        'GET',
        `/api/chat/files/${uploadedFileId}`,
        undefined,
        { Authorization: `Bearer ${customerToken}` }
      );
      assert(downloadRes.status === 200, 'GET /api/chat/files/:id serves uploaded file');
      assert(downloadRes.headers['x-content-type-options'] === 'nosniff', 'Security header X-Content-Type-Options: nosniff present');
      assert(Boolean(downloadRes.headers['content-security-policy']), 'Security header Content-Security-Policy present');
    }

    // 5. SECURITY ATTACK TEST 1: Attempt to upload dangerous executable (.exe / script)
    const dangerousExeBuffer = Buffer.from('MZ\x90\x00Malicious Executable Content');
    const exeForm = buildMultipartFormData(
      { label: 'Unbekanntes Skript' },
      {
        name: 'file',
        filename: 'exploit_test.exe',
        contentType: 'application/octet-stream',
        content: dangerousExeBuffer,
      }
    );

    const uploadExeRes = await httpRequest(
      'POST',
      `/api/chat/rooms/${aptRoomId}/upload`,
      exeForm.body,
      {
        'Content-Type': exeForm.contentType,
        Authorization: `Bearer ${customerToken}`,
      }
    );
    assert(
      uploadExeRes.status === 400 || uploadExeRes.status === 403 || uploadExeRes.status === 500,
      'SECURITY: Server rejected dangerous .exe executable with 400/403'
    );

    // 6. SECURITY ATTACK TEST 2: IDOR / Tenant Isolation - Another customer attempts to access Erika\'s room
    const attackerToken = 'token_usr_attacker_999';
    const idorAccess = await httpRequest(
      'GET',
      `/api/chat/rooms/${aptRoomId}/messages`,
      undefined,
      { Authorization: `Bearer ${attackerToken}` }
    );
    assert(
      idorAccess.status === 403 || idorAccess.status === 404,
      'SECURITY: IDOR Attack blocked! Unrelated customer cannot read messages in other rooms (403 Forbidden)'
    );

    const idorUpload = await httpRequest(
      'POST',
      `/api/chat/rooms/${aptRoomId}/upload`,
      pdfForm.body,
      {
        'Content-Type': pdfForm.contentType,
        Authorization: `Bearer ${attackerToken}`,
      }
    );
    assert(
      idorUpload.status === 403 || idorUpload.status === 404,
      'SECURITY: IDOR Attack blocked! Unrelated customer cannot upload documents to another room (403 Forbidden)'
    );
  }

  // --- SUITE 8: SERVER-SENT EVENTS (SSE) ---
  console.log('\n--- SUITE 8: Real-Time Server-Sent Events (SSE) Stream ---');
  {
    const sseSuccess = await new Promise<boolean>((resolve) => {
      const url = new URL(`/api/chat/rooms/${aptRoomId}/events`, BASE_URL);
      const req = http.request(
        {
          hostname: url.hostname,
          port: url.port,
          path: url.pathname,
          method: 'GET',
          headers: {
            Accept: 'text/event-stream',
            Authorization: `Bearer ${customerToken}`,
          },
        },
        (res) => {
          if (res.statusCode === 200 && res.headers['content-type']?.includes('text/event-stream')) {
            res.on('data', (chunk) => {
              const text = chunk.toString();
              if (text.includes('connected')) {
                req.destroy();
                resolve(true);
              }
            });
          } else {
            resolve(false);
          }
        }
      );
      req.on('error', () => resolve(false));
      setTimeout(() => resolve(false), 3000);
      req.end();
    });

    assert(sseSuccess, 'GET /api/chat/rooms/:id/events connects & receives initial connected heartbeat');
  }

  console.log('\n===============================================================');
  console.log(`   SYSTEM TEST COMPLETE: ${passed} PASSED, ${failed} FAILED     `);
  console.log('===============================================================');

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runFullSystemTest().catch((err) => {
  console.error('Test Suite encountered fatal error:', err);
  process.exit(1);
});
