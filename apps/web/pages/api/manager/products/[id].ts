import { NextApiResponse } from 'next'
import { prisma } from '@sabir-khatabook/db'
import { productSchema } from '@sabir-khatabook/utils'
import { authorize, AuthenticatedRequest, ensureManagerOwnsResource } from '@/utils/auth-middleware'

export default authorize('manager')(async (req: AuthenticatedRequest, res: NextApiResponse) => {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const product = await prisma.product.findUnique({
        where: { id: parseInt(id as string) }
      })

      if (!product || !ensureManagerOwnsResource(req.user.id, product.managerId)) {
        return res.status(404).json({ error: 'Product not found' })
      }

      res.json(product)
    } catch (error) {
      console.error('Fetch product error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const validatedData = productSchema.parse(req.body)
      
      const existingProduct = await prisma.product.findUnique({
        where: { id: parseInt(id as string) }
      })

      if (!existingProduct || !ensureManagerOwnsResource(req.user.id, existingProduct.managerId)) {
        return res.status(404).json({ error: 'Product not found' })
      }

      const product = await prisma.product.update({
        where: { id: parseInt(id as string) },
        data: validatedData
      })
      res.json(product)
    } catch (error) {
      console.error('Update product error:', error)
      res.status(400).json({ error: 'Invalid data provided' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const existingProduct = await prisma.product.findUnique({
        where: { id: parseInt(id as string) }
      })

      if (!existingProduct || !ensureManagerOwnsResource(req.user.id, existingProduct.managerId)) {
        return res.status(404).json({ error: 'Product not found' })
      }

      await prisma.product.delete({
        where: { id: parseInt(id as string) }
      })
      res.json({ message: 'Product deleted successfully' })
    } catch (error) {
      console.error('Delete product error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
})