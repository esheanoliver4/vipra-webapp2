import { z } from 'zod'

// YYYY-MM-DD with valid month (01-12) and day (01-31)
// Validates format: YYYY-MM-DD where YYYY is 1900-2099, MM is 01-12, DD is 01-31
const DOB_FORMAT_REGEX = /^(19|20)\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/

const MAX_AGE = 120

function parseAndValidateDob(dob: string): { valid: true; date: Date } | { valid: false; message: string } {

  if (!DOB_FORMAT_REGEX.test(dob)) {
    return { valid: false, message: 'Invalid date format. Enter day (1-31), month (1-12), year (e.g. 1990)' }
  }
  if (!dob || !dob.trim()) {
    return { valid: false, message: 'Date of birth is required' }
  }
  const [y, m, d] = dob.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) {
    return { valid: false, message: 'Invalid date (e.g. 31st Feb or 30th Feb not valid)' }
  }
  const today = new Date()
  today.setHours(23, 59, 59, 999)
  if (date.getTime() > today.getTime()) {
    return { valid: false, message: 'Date of birth cannot be in the future' }
  }
  const age = Math.floor((today.getTime() - date.getTime()) / (365.25 * 24 * 60 * 60 * 1000))
  if (age > MAX_AGE) {
    return { valid: false, message: `Please enter a valid date of birth (max age ${MAX_AGE} years)` }
  }
  return { valid: true, date }
}

export const registrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
  gender: z.enum(['male', 'female']),
  dob: z.string().min(1, ' Invalid date '),
  gotra: z.string().min(1, 'Rishi Gotra is required'),
  currentPracticedGotra: z.string().min(1, 'Gotra is required'),
  city: z.string().min(1, 'City is required'),
  profileFor: z.enum(
    ['self', 'sister', 'son', 'friend', 'daughter', 'relative', 'brother', 'other'],
    { required_error: 'Please select who you are creating this profile for' }
  ),
  // Birth details - now mandatory to build basic life profile
  timeOfBirth: z.string().min(1, 'Time of birth is required'),
  placeOfBirth: z.string().min(1, 'Birth place is required'),
  // Family details - collected at registration for future biodata
  fatherName: z.string().min(1, "Father's name is required"),
  motherName: z.string().min(1, "Mother's name is required"),
  parentsContactNumber: z
    .string()
    .min(1, 'Mobile number is required'),
  // Cultural & identity details
  religion: z.string().min(1, 'Religion is required'),
  caste: z.string().min(1, 'Caste is required'),
  // Optional extended profile fields
  profession: z.string().optional(),
  education: z.string().optional(),
  companyWorkingAt: z.string().optional(),
  schoolName: z.string().optional(),
  collegeName: z.string().optional(),
  hobbies: z.string().optional(),
  favThings: z.string().optional(),
  siblings: z.number().optional(),
  maritalStatus: z.string().optional(),
  motherTongue: z.string().optional(),
  nri: z.enum(['yes', 'no']).optional(),
  disability: z.enum(['yes', 'no']).optional(),
  paymentId: z.string().optional(),
})
  .superRefine((data, ctx) => {
    if (!data.dob?.trim()) return
    const result = parseAndValidateDob(data.dob)
    if (!result.valid) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, path: ['dob'], message: result.message })
    }
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const resetPasswordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export type RegistrationData = z.infer<typeof registrationSchema>
export type LoginData = z.infer<typeof loginSchema>
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>

// Login response type
export type LoginResponse = {
  success: boolean
  user?: any
  redirectTo?: string
  message?: string
}