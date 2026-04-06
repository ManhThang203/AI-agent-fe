import { z } from 'zod'

export function loginSchema(t) {
  return z.object({
    email: z.string().email(t('validationEmail')),
    password: z.string().min(1, t('validationPassword')),
  })
}

export function registerSchema(t) {
  return z.object({
    email: z.string().email(t('validationEmail')),
    username: z
      .string()
      .min(3, t('validationUsername'))
      .regex(/^[a-zA-Z0-9_]+$/, t('validationUsername')),
    password: z.string().min(6, t('validationPassword')),
  })
}
