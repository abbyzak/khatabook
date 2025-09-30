import { NextApiRequest, NextApiResponse } from 'next'
import { prisma } from '@sabir-khatabook/db'
import { comparePassword, generateToken } from '@sabir-khatabook/utils'
import { loginSchema } from '@sabir-khatabook/utils'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const validatedData = loginSchema.parse(req.body)

    const user = await prisma.user.findUnique({
      where: { email: validatedData.email }
    })

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const isValidPassword = await comparePassword(validatedData.password, user.password)
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const token = generateToken({
      id: user.id,
      email: user.email,
      role: user.role
    })

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(400).json({ error: 'Invalid data provided' })
  }
}