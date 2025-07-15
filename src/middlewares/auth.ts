import { Request, Response, NextFunction } from 'express';

const VALID_TOKEN = process.env.API_TOKEN || 'secret-token';

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authorization header missing or malformed' });
    return;
  }

  const token = authHeader.split(' ')[1];

  if (token !== VALID_TOKEN) {
    res.status(403).json({ message: 'Invalid or expired token' });
    return;
  }

  next(); // pastikan next selalu dipanggil jika token valid
};
