import { Router } from 'express';
import { Role } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../../lib/prisma';
import { comparePassword, hashPassword } from '../../utils/password';
import { requireAuth, signToken } from '../../middleware/auth';

export const authRoutes = Router();

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.nativeEnum(Role).optional().default(Role.STUDENT)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

authRoutes.post('/register', async (req, res, next) => {
  try {
    const body = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() }
    });

    if (existingUser) {
      return res.status(409).json({ message: 'Email is already registered' });
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email.toLowerCase(),
        passwordHash: await hashPassword(body.password),
        role: body.role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return res.status(201).json({ user, token });
  } catch (error) {
    return next(error);
  }
});

authRoutes.post('/login', async (req, res, next) => {
  try {
    const body = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: body.email.toLowerCase() }
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isValid = await comparePassword(body.password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = signToken({ id: user.id, email: user.email, role: user.role });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    return next(error);
  }
});

authRoutes.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ user });
  } catch (error) {
    return next(error);
  }
});
