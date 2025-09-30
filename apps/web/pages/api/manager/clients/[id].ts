import { NextApiResponse } from 'next'
import { prisma } from '@sabir-khatabook/db'
import { clientSchema } from '@sabir-khatabook/utils'
import { authorize, AuthenticatedRequest, ensureManagerOwnsResource } from '@/utils/auth-middleware'

export default authorize('manager')(async (req: AuthenticatedRequest, res: NextApiResponse) => {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const client = await prisma.client.findUnique({
        where: { id: parseInt(id as string) }
      })

      if (!client || !ensureManagerOwnsResource(req.user.id, client.managerId)) {
        return res.status(404).json({ error: 'Client not found' })
      }

      res.json(client)
    } catch (error) {
      console.error('Fetch client error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'PUT') {
    try {
      const validatedData = clientSchema.parse(req.body)
      
      const existingClient = await prisma.client.findUnique({
        where: { id: parseInt(id as string) }
      })

      if (!existingClient || !ensureManagerOwnsResource(req.user.id, existingClient.managerId)) {
        return res.status(404).json({ error: 'Client not found' })
      }

      const client = await prisma.client.update({
        where: { id: parseInt(id as string) },
        data: validatedData
      })
      res.json(client)
    } catch (error) {
      console.error('Update client error:', error)
      res.status(400).json({ error: 'Invalid data provided' })
    }
  } else if (req.method === 'DELETE') {
    try {
      const existingClient = await prisma.client.findUnique({
        where: { id: parseInt(id as string) }
      })

      if (!existingClient || !ensureManagerOwnsResource(req.user.id, existingClient.managerId)) {
        return res.status(404).json({ error: 'Client not found' })
      }

      await prisma.client.delete({
        where: { id: parseInt(id as string) }
      })
      res.json({ message: 'Client deleted successfully' })
    } catch (error) {
      console.error('Delete client error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
})