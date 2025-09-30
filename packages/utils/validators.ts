import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
})

export const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['admin', 'manager']).default('manager')
})

export const productSchema = z.object({
  name: z.string().min(2),
  type: z.string().min(2),
  unit: z.string().min(1),
  price: z.number().positive(),
  stock: z.number().min(0).default(0)
})

export const clientSchema = z.object({
  name: z.string().min(2),
  phone: z.string().optional(),
  address: z.string().optional(),
  balance: z.number().default(0)
})

export const transactionSchema = z.object({
  type: z.enum(['sale', 'payment']),
  productId: z.number().optional(),
  quantity: z.number().positive().optional(),
  amount: z.number().positive(),
  note: z.string().optional()
})