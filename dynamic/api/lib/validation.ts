import { z } from 'zod';

export const propertySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  type: z.enum([
    'residential-plots',
    'residential-apartments',
    'residential-villas',
    'commercial',
    'retail',
    'hospitality',
    'industrial',
    'land',
  ], {
    errorMap: () => ({ message: 'Invalid property type' }),
  }),
  city: z.string().min(1, 'City is required').max(100),
  area: z.string().min(1, 'Area is required').max(100),
  price_label: z.string().optional(),
  size: z.string().optional(),
  status: z.enum(['available', 'sold', 'new'], {
    errorMap: () => ({ message: 'Status must be available, sold, or new' }),
  }),
  highlights: z.array(z.string()).default([]),
  lat: z.number().min(-90).max(90).optional(),
  lon: z.number().min(-180).max(180).optional(),
  images: z.array(z.string().url('Invalid image URL')).default([]),
  description: z.string().min(10, 'Description must be at least 10 characters').max(5000, 'Description too long'),
});

export type PropertyInput = z.infer<typeof propertySchema>;

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginInput = z.infer<typeof loginSchema>;

