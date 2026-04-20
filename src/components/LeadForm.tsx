import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Send, MessageCircle } from 'lucide-react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';

const leadFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  phone: z.string().min(10, 'Please enter a valid phone number').regex(/^[0-9]+$/, 'Phone must contain only numbers'),
  email: z.string().email('Please enter a valid email').optional().or(z.literal('')),
  interest: z.enum(['Residential Plots', 'Farm Plots', 'Agricultural Lands', 'General']).optional(),
  message: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadFormSchema>;

interface LeadFormProps {
  context?: string;
  propertyTitle?: string;
  className?: string;
  compact?: boolean;
}

export default function LeadForm({ context = 'contact', propertyTitle, className, compact = false }: LeadFormProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadFormSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    setLoading(true);
    setError(null);

    try {
      const page = context || window.location.pathname;
      
      const formData = {
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        interest: data.interest,
        message: data.message,
        page,
        propertyTitle, // Include property info if available
      };

      const API_BASE = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api');
      const response = await axios.post(`${API_BASE}/leads`, formData);

      if (response.data.success) {
        setSuccess(true);
        reset();
        setTimeout(() => setSuccess(false), 5000);
      } else {
        setError('Failed to send message. Please try again.');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setError('An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const whatsappLink = propertyTitle
    ? `https://wa.me/919900570799?text=Hi%20Gani%20Properties%2C%20I%27m%20interested%20in%20${encodeURIComponent(propertyTitle)}.%20Please%20contact%20me.`
    : 'https://wa.me/919900570799?text=Hi%20Gani%20Properties%2C%20I%20want%20to%20schedule%20a%20site%20visit';

  return (
    <div className={cn('bg-white rounded-3xl border border-gp-ink/10 p-8', className)}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gp-ink mb-2">
            Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Your name"
            {...register('name')}
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.name.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gp-ink mb-2">
            Phone <span className="text-red-500">*</span>
          </label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number"
            {...register('phone')}
            aria-invalid={errors.phone ? 'true' : 'false'}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gp-ink mb-2">
            Email (optional)
          </label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            {...register('email')}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600" role="alert">
              {errors.email.message}
            </p>
          )}
        </div>

        {!compact && (
          <>
            <div>
              <label htmlFor="interest" className="block text-sm font-medium text-gp-ink mb-2">
                Interest
              </label>
              <Select id="interest" {...register('interest')}>
                <option value="">Select your interest</option>
                <option value="Residential Plots">Residential Plots</option>
                <option value="Farm Plots">Farm Plots</option>
                <option value="Agricultural Lands">Agricultural Lands</option>
                <option value="General">General Inquiry</option>
              </Select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gp-ink mb-2">
                Message
              </label>
              <Textarea
                id="message"
                placeholder="Tell us about your requirements..."
                {...register('message')}
              />
            </div>
          </>
        )}

        {/* Honeypot */}
        <input type="text" name="hp" className="hidden" tabIndex={-1} autoComplete="off" />

        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-green-50 border border-green-200 rounded-2xl text-green-800"
              role="alert"
              aria-live="polite"
            >
              Thank you! We&apos;ll get back to you soon.
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-red-50 border border-red-200 rounded-2xl text-red-800"
              role="alert"
              aria-live="polite"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
        >
          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="h-5 w-5" />
                Send Inquiry
              </>
            )}
          </Button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="pt-4 border-t border-gp-ink/10"
        >
          <p className="text-sm text-center text-gp-ink-muted mb-3">Or reach us directly</p>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            asChild
          >
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-5 w-5" />
              WhatsApp Us
            </a>
          </Button>
        </motion.div>
      </form>
    </div>
  );
}
