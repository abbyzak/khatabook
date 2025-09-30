import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sabir-khatabook/db'
import { hashPassword } from '@sabir-khatabook/utils'
import { registerSchema } from '@sabir-khatabook/utils'
import { authorize } from '@/utils/auth-middleware'

export default authorize('admin')(async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const validatedData = registerSchema.parse(req.body)
    const hashedPassword = await hashPassword(validatedData.password)

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' })
    }

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    res.status(201).json(user)
  } catch (error) {
    console.error('Registration error:', error)
    res.status(400).json({ error: 'Invalid data provided' })
  }
})