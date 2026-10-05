import { z } from 'zod'

export const registrationSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(80, 'Name too long')
    .regex(/^[a-zA-Z\s.'-]+$/, 'Name contains invalid characters'),

  email: z
    .string()
    .email('Please enter a valid email address')
    .max(150, 'Email too long'),

  phone: z
    .string()
    .regex(
      /^\+?[\d\s\-().]{7,20}$/,
      'Enter a valid phone number (with country code)'
    ),

  college: z
    .string()
    .min(2, 'College name is required')
    .max(120, 'College name too long'),

  year: z.enum(
    ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Post-Graduate'],
    { required_error: 'Please select your year of study' }
  ),

  track: z.enum(
    ['chatbot', 'vision', 'generator', 'automation'],
    { required_error: 'Please select a track' }
  ),

  referralCode: z.string().optional(),
  terms: z.literal(true, { errorMap: () => ({ message: 'You must accept to receive updates' }) }),
})

export type RegistrationInput = z.infer<typeof registrationSchema>
