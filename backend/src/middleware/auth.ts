import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend the Express Request interface
declare global {
  namespace Express {
    interface Request {
      adminId?: string;
    }
  }
}

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('🔍 Auth middleware - Checking authentication');
    console.log('🔍 Cookies received:', req.cookies);
    console.log('🔍 Authorization header:', req.headers.authorization);

    // Try multiple ways to get the token
    let token = req.cookies?.token;
    
    // If no cookie token, try Authorization header (Bearer token)
    if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
      token = req.headers.authorization.slice(7);
      console.log('🔍 Using token from Authorization header');
    }

    if (!token) {
      console.log('❌ No token found in request');
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    console.log('🔍 Token found, verifying...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { adminId: string };
    req.adminId = decoded.adminId;
    
    console.log('✅ Token verified for admin:', req.adminId);
    next();
  } catch (error) {
    console.error('❌ Auth middleware error:', error);
    res.status(401).json({ error: 'Token is not valid' });
  }
};