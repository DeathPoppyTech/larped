import jwt from 'jsonwebtoken';
import cookie from 'cookie';
import { prisma } from './prisma.js';

const JWT_SECRET = process.env.JWT_SECRET || 'larpmail-super-secret-key';

export const getUserFromReq = async (req) => {
  const cookies = cookie.parse(req.headers.cookie || '');
  if (!cookies.token) return null;

  try {
    const decoded = jwt.verify(cookies.token, JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    return user;
  } catch (err) {
    return null;
  }
};

export const signToken = (payload) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
};
