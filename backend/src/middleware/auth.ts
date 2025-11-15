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
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { adminId: string };
    req.adminId = decoded.adminId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' });
  }
};