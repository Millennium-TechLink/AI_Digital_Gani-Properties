import { verifySupabaseToken } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

/**
 * Authenticate request using Supabase JWT token
 */
export async function authenticateToken(
  req: { headers: { authorization?: string } }
): Promise<{ error?: string; user?: AuthUser }> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authentication required. Please log in.' };
  }

  const token = authHeader.substring(7);

  try {
    const { user, error } = await verifySupabaseToken(token);
    
    if (error || !user) {
      return { error: 'Invalid or expired token. Please log in again.' };
    }

    return {
      user: {
        id: user.id,
        email: user.email || '',
        role: user.user_metadata?.role || 'user',
      },
    };
  } catch (error: any) {
    console.error('Auth error:', error);
    return { error: 'Authentication error' };
  }
}

