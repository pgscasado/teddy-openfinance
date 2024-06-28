import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-namespace, @typescript-eslint/no-unused-vars
declare namespace NodeJS {
  export interface ProcessEnv {
    DATABASE_URL: string;
    BASE_URL: string;
    JWT_SECRET: string;
  }
}

export const processEnvSchema = z.object({
  DATABASE_URL: z.string({ message: 'Database URL must be set' }),
  BASE_URL: z.string({ message: 'Base URL must be set' }),
  JWT_SECRET: z.string({ message: 'An JWT secret must be set' }),
});
