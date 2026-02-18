import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string().min(32),
  STORAGE_BUCKET: z.string().default('local-bucket'),
  FCM_PROJECT_ID: z.string().optional(),
});

export const env = envSchema.parse(process.env);
