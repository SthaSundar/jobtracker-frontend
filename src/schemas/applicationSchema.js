import { z } from 'zod';

export const applicationSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  status: z.enum(['applied', 'interview', 'offer', 'rejected']),
  date_applied: z.string().min(1, 'Date applied is required'),
  follow_up_date: z.string().optional().or(z.literal('')),
  notes: z.string().optional(),
  job_link: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  resume_file: z.any().optional(),
});