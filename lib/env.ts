import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_URL: z.string().url(),
  NEXT_PUBLIC_APP_ENV: z.enum(["development", "production", "staging"]),
});

export const env = envSchema.parse({
  NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
  NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
});
