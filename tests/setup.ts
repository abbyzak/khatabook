import { prisma } from '@sabir-khatabook/db'

beforeAll(async () => {
  process.env.DATABASE_URL = 'file:./test.db'
})

afterEach(async () => {
  await prisma.transaction.deleteMany()
  await prisma.product.deleteMany()
  await prisma.client.deleteMany()
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})