import { NextApiResponse } from 'next'
import { prisma } from '@sabir-khatabook/db'
import { clientSchema } from '@sabir-khatabook/utils'
import { authorize, AuthenticatedRequest } from '@/utils/auth-middleware'

export default authorize('manager')(async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    try {
      const clients = await prisma.client.findMany({
        where: { managerId: req.user.id },
        orderBy: { createdAt: 'desc' }
      })
      res.json(clients)
    } catch (error) {
      console.error('Fetch clients error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const validatedData = clientSchema.parse(req.body)
      const client = await prisma.client.create({
        data: {
          ...validatedData,
          managerId: req.user.id
        }
      })
      res.status(201).json(client)
    } catch (error) {
      console.error('Create client error:', error)
      res.status(400).json({ error: 'Invalid data provided' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
})