import request from 'supertest'
import { NextApiRequest, NextApiResponse } from 'next'
import { createMocks } from 'node-mocks-http'
import loginHandler from '../apps/web/pages/api/auth/login'
import { prisma } from '@sabir-khatabook/db'
import { hashPassword } from '@sabir-khatabook/utils'

describe('/api/auth/login', () => {
  beforeEach(async () => {
    const hashedPassword = await hashPassword('TestPassword123!')
    await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword,
        role: 'manager'
      }
    })
  })

  it('should login with valid credentials', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'TestPassword123!'
      }
    })

    await loginHandler(req, res)

    expect(res._getStatusCode()).toBe(200)
    const data = JSON.parse(res._getData())
    expect(data).toHaveProperty('token')
    expect(data).toHaveProperty('user')
    expect(data.user.email).toBe('test@example.com')
  })

  it('should reject invalid credentials', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        email: 'test@example.com',
        password: 'wrongpassword'
      }
    })

    await loginHandler(req, res)

    expect(res._getStatusCode()).toBe(401)
    const data = JSON.parse(res._getData())
    expect(data.error).toBe('Invalid credentials')
  })
})