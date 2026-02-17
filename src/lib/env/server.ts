import "server-only";
import { z } from "zod";

export const serverEnvSchema = z.object({
  // Add private server variables here, e.g.:
  // DATABASE_URL: z.string().url(),
});

export const env = serverEnvSchema.parse({
  // DATABASE_URL: process.env.DATABASE_URL,
});
