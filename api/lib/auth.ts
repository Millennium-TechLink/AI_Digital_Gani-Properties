import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export interface AuthUser {
  username: string;
  type: string;
}

export async function authenticateToken(req: { headers: { authorization?: string } }): Promise<{ error?: string; user?: AuthUser }> {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return { error: 'Authentication required. Please log in.' };
  }

  const token = authHeader.substring(7);

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    return { user: decoded };
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return { error: 'Token expired. Please log in again.' };
    } else if (error instanceof jwt.JsonWebTokenError) {
      return { error: 'Invalid token. Please log in again.' };
    } else {
      return { error: 'Authentication error' };
    }
  }
}





