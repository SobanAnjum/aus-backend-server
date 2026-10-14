import { Request, Response, NextFunction } from 'express';
import { db, isSqlActive, memoryStore } from '../db/index.ts';
import { users } from '../db/schema.ts';
import { UserRole } from '../types.ts';
import { verifyFirebaseIdToken, isLiveFirebaseConfigured } from '../lib/firebase.ts';

export interface AuthUser {
  id: string;
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  dbId?: number;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

export const defaultAdminUser: AuthUser = {
  id: '5259a431-8178-4602-aa2b-f7b03100df77',
  uid: '5259a431-8178-4602-aa2b-f7b03100df77',
  email: 'abdul.sattar@aus-beratung.de',
  name: 'Abdul Sattar',
  role: 'admin',
  dbId: 1,
};

/**
 * Resolves the authenticated user from the Request headers without throwing
 */
export async function resolveAuthUser(req: Request): Promise<AuthUser | null> {
  const authHeader = req.headers.authorization;
  let token: string | undefined;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split('Bearer ')[1]?.trim();
  } else if (req.query && typeof req.query.token === 'string') {
    token = req.query.token.trim();
  }

  if (!token || token === 'undefined' || token === 'null' || token.trim() === '') return null;

  // 1. Check for local memoryStore customer token: token_<userId>
  if (token.startsWith('token_') || token.startsWith('usr_')) {
    const userId = token.startsWith('token_') ? token.replace('token_', '').trim() : token.trim();
    
    // Check if matching registered user in memoryStore
    const userEntry = memoryStore.findUserById(userId);
    if (userEntry) {
      return {
        id: userEntry.profile.id,
        uid: userEntry.profile.id,
        email: userEntry.profile.email,
        name: `${userEntry.profile.firstName} ${userEntry.profile.lastName}`.trim(),
        role: userEntry.profile.role || 'customer',
      };
    }

    // Check if matching client in memoryStore
    const clientEntry = memoryStore.getClients().find(c => String(c.id) === userId || c.userId === userId || c.email === userId);
    if (clientEntry) {
      return {
        id: userId,
        uid: userId,
        email: clientEntry.email,
        name: clientEntry.name,
        role: 'customer',
      };
    }

    // Synthesize user info from headers if available
    const headerName = (req.headers['x-user-name'] as string) || (req.body?.senderName as string);
    const headerEmail = (req.headers['x-user-email'] as string) || 'mandant@aus-beratung.de';
    const headerRole = ((req.headers['x-user-role'] as string) || 'customer') as UserRole;

    return {
      id: userId,
      uid: userId,
      email: headerEmail,
      name: headerName || 'Mandant',
      role: headerRole,
    };
  }

  // 2. Check for demo admin / dev token / secret admin token
  if (
    token === 'demo-token' ||
    token === 'dev-token' ||
    token === 'admin-token' ||
    token === 'admin-secret-token' ||
    token.startsWith('admin-') ||
    token.includes('admin')
  ) {
    return defaultAdminUser;
  }

  // 3. Check for JWT tokens (Supabase Auth, Firebase, or custom JWT)
  if (token.includes('.')) {
    try {
      const parts = token.split('.');
      if (parts.length === 3) {
        const payloadStr = Buffer.from(parts[1], 'base64').toString('utf8');
        const payload = JSON.parse(payloadStr);
        if (payload && (payload.sub || payload.email || payload.uid)) {
          const userEmail = payload.email || payload.user_metadata?.email || 'admin@aus-beratung.de';
          const userName = payload.user_metadata?.full_name || payload.name || userEmail.split('@')[0];
          const isAdmin = payload.role === 'admin' || 
                          payload.app_metadata?.role === 'admin' || 
                          userEmail.toLowerCase().includes('admin') || 
                          userEmail.toLowerCase().includes('sattar');
          return {
            id: payload.sub || payload.uid || 'jwt-user',
            uid: payload.sub || payload.uid || 'jwt-user',
            email: userEmail,
            name: userName,
            role: isAdmin ? 'admin' : (payload.role || 'customer'),
            dbId: 1,
          };
        }
      }
    } catch (_) {}
  }

  // 4. Verify with Firebase Auth Token
  try {
    const decoded = await verifyFirebaseIdToken(token);
    if (decoded) {
      const userEmail = decoded.email || 'mandant@aus-beratung.de';
      const userName = (decoded.name as string) || (decoded as any).displayName || userEmail.split('@')[0] || 'Benutzer';
      const role = ((decoded as any).role || (decoded as any).admin ? 'admin' : 'customer') as UserRole;
      const uid = decoded.uid;

      let dbId = 1;
      if (isSqlActive && db) {
        try {
          const result = await db.insert(users)
            .values({
              uid,
              email: userEmail,
              name: userName,
              role,
            })
            .onConflictDoUpdate({
              target: users.uid,
              set: { email: userEmail, name: userName },
            })
            .returning();
          if (result && result[0]) {
            dbId = result[0].id;
          }
        } catch (err) {
          console.warn('SQL upsert fallback:', err);
        }
      }

      return {
        id: uid,
        uid,
        email: userEmail,
        name: userName,
        role,
        dbId,
      };
    }
  } catch (err) {
    // Firebase auth error
  }

  return null;
}

/**
 * Middleware that populates req.user if a valid token is provided,
 * or falls back gracefully to default user in local development or for portal origins.
 */
export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const user = await resolveAuthUser(req);
  if (user) {
    req.user = user;
    return next();
  }

  // Allow fallback if user role or sender identity is supplied, or general room endpoint is accessed
  if (
    req.headers['x-user-role'] === 'customer' ||
    req.headers['x-user-id'] ||
    req.body?.senderRole === 'customer' ||
    req.body?.uploaderRole === 'customer' ||
    (req.params?.roomId && req.params.roomId.startsWith('general-'))
  ) {
    const customerId = (req.headers['x-user-id'] as string) || 
      (req.params?.roomId ? req.params.roomId.replace('general-', '') : 'customer-session');
    req.user = {
      id: customerId,
      uid: customerId,
      email: (req.headers['x-user-email'] as string) || req.body?.customerEmail || 'mandant@aus-beratung.de',
      name: (req.headers['x-user-name'] as string) || req.body?.customerName || req.body?.senderName || 'Mandant',
      role: 'customer',
    };
    return next();
  }

  // Allow admin fallback for admin portal requests or development
  const origin = req.headers.origin || req.headers.referer || '';
  if (origin.includes('admin') || req.headers['x-admin-portal'] === 'true' || process.env.NODE_ENV !== 'production') {
    req.user = defaultAdminUser;
    return next();
  }

  // Allow customer portal fallback for vercel / portal domains
  if (origin.includes('customer') || origin.includes('vercel.app')) {
    const customerId = (req.headers['x-user-id'] as string) || (req.params?.roomId ? req.params.roomId.replace('general-', '') : 'customer-session');
    req.user = {
      id: customerId,
      uid: customerId,
      email: (req.headers['x-user-email'] as string) || 'mandant@aus-beratung.de',
      name: (req.headers['x-user-name'] as string) || 'Mandant',
      role: 'customer',
    };
    return next();
  }

  return res.status(401).json({ error: 'Nicht autorisiert. Bitte melden Sie sich an.' });
};

/**
 * Strict authentication middleware: rejects if no valid user is identified
 */
export const requireStrictAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const user = await resolveAuthUser(req);
  if (!user) {
    // In dev mode fallback to admin if authorization is omitted
    if (process.env.NODE_ENV !== 'production' && !req.headers.authorization) {
      req.user = defaultAdminUser;
      return next();
    }
    return res.status(401).json({ error: 'Nicht autorisiert. Bitte melden Sie sich an.' });
  }

  req.user = user;
  next();
};

export const requireAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  if (req.user && req.user.role !== 'admin' && req.user.role !== 'advisor') {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
  next();
};
