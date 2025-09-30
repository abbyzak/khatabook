import { NextApiResponse } from 'next'
import { prisma } from '@sabir-khatabook/db'
import { productSchema } from '@sabir-khatabook/utils'
import { authorize, AuthenticatedRequest, ensureManagerOwnsResource } from '@/utils/auth-middleware'

export default authorize('manager')(async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const products = await prisma.product.findMany({
        where: { managerId: req.user.id },
        orderBy: { createdAt: 'desc' }
      })
      res.json(products)
    } catch (error) {
      console.error('Fetch products error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const validatedData = productSchema.parse(req.body)
      const product = await prisma.product.create({
        data: {
          ...validatedData,
          managerId: req.user.id
        }
      })
      res.status(201).json(product)
    } catch (error) {
      console.error('Create product error:', error)
      res.status(400).json({ error: 'Invalid data provided' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
})