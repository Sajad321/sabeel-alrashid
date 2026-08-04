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
  name: z.string().trim().min(2).max(100),
  email: z.email(),
  phone,
  birthDate: z.string().min(1),
  gender: z.string().trim().max(50),
  maritalStatus: z.string().trim().max(50),
  address: z.string().trim().min(2).max(200),
  job: z.string().trim().min(1).max(100),
  preferredBrand: z.string().trim().max(100),
  startDate: z.string().optional(),
  salary: z.string().trim().max(100),
  education: z.string().trim().min(1).max(100),
  experience: z.string().trim().min(1).max(100),
  employer: z.string().trim().max(200),
  note: z.string().trim().max(5000),
  website: z.string().max(0),
  turnstileToken: z.string().optional(),
  idempotencyKey: z.string().uuid(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type FranchiseInput = z.infer<typeof franchiseSchema>;
export type JobInput = z.infer<typeof jobSchema>;
