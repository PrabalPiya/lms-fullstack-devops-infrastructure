import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { env } from './config/env';
import { apiRoutes } from './routes';
import { errorHandler, notFound } from './middleware/error';
import { prisma } from './lib/prisma';

export const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.clientUrl,
    credentials: true
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'learnhub-lms-api' });
});

app.get('/ready', async (_req, res) => {
  await prisma.$queryRaw`SELECT 1`;
  res.json({ status: 'ready', database: 'connected' });
});

app.use('/api', apiRoutes);

app.use(notFound);
app.use(errorHandler);
