import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { PropertyType } from '../types/property.js';

const propertyTypeSchema = z.enum([
  'residential-plots',
  'residential-apartments',
  'residential-villas',
  'commercial',
  'commercial-offices',
  'retail',
  'retail-shops',
  'retail-malls',
  'hospitality',
  'hospitality-hotels',
  'hospitality-restaurants',
  'industrial',
  'industrial-warehouses',
  'industrial-logistics',
  'farm-plots',
  'agricultural-lands',
]);

const createPropertySchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: propertyTypeSchema,
  city: z.string().min(1, 'City is required'),
  area: z.string().min(1, 'Area is required'),
  priceLabel: z.string().optional(),
  size: z.string().optional(),
  status: z.enum(['available', 'sold', 'new']),
  highlights: z.array(z.string()).default([]),
  lat: z.number().optional(),
  lon: z.number().optional(),
  googleMapsUrl: z.string().url().optional().or(z.literal('')),
  images: z.array(z.string()).default([]),
  description: z.string().min(1, 'Description is required'),
});

const updatePropertySchema = createPropertySchema.partial().extend({
  id: z.string().min(1),
});

export function validateCreateProperty(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    createPropertySchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export function validateUpdateProperty(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    updatePropertySchema.parse({ ...req.body, id: req.params.id });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        error: 'Validation failed',
        details: error.errors,
      });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

