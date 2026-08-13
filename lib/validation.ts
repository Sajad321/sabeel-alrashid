import { z } from "zod";

const phone = z.string().trim().min(7).max(30);
export const contactSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  phone: phone.optional().or(z.literal("")),
  subject: z.string().trim().min(2).max(100),
  message: z.string().trim().min(10).max(5000),
  website: z.string().max(0),
  turnstileToken: z.string().optional(),
  idempotencyKey: z.string().uuid(),
});
export const franchiseSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  phone,
  city: z.string().trim().min(2).max(120),
  investment: z.string().trim().max(100).default(""),
  brand: z.string().trim().max(100).default(""),
  message: z.string().trim().max(5000).default(""),
  website: z.string().max(0),
  turnstileToken: z.string().optional(),
  idempotencyKey: z.string().uuid(),
});
export const jobSchema = z.object({
  website: z.string().max(0),
  turnstileToken: z.string().optional(),
  idempotencyKey: z.string().uuid(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type FranchiseInput = z.infer<typeof franchiseSchema>;
export type JobInput = z.infer<typeof jobSchema>;
