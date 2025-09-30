import { NextApiResponse } from 'next'
import { prisma } from '@sabir-khatabook/db'
import { transactionSchema } from '@sabir-khatabook/utils'
import { authorize, AuthenticatedRequest, ensureManagerOwnsResource } from '@/utils/auth-middleware'

export default authorize('manager')(async (req: AuthenticatedRequest, res: NextApiResponse) => {
  const { id } = req.query
  const clientId = parseInt(id as string)

  if (req.method === 'GET') {
    try {
      const client = await prisma.client.findUnique({
        where: { id: clientId }
      })

      if (!client || !ensureManagerOwnsResource(req.user.id, client.managerId)) {
        return res.status(404).json({ error: 'Client not found' })
      }

      const transactions = await prisma.transaction.findMany({
        where: { clientId },
        include: {
          product: true,
          client: true
        },
        orderBy: { createdAt: 'desc' }
      })

      res.json(transactions)
    } catch (error) {
      console.error('Fetch transactions error:', error)
      res.status(500).json({ error: 'Internal server error' })
    }
  } else if (req.method === 'POST') {
    try {
      const validatedData = transactionSchema.parse(req.body)
      
      const client = await prisma.client.findUnique({
        where: { id: clientId }
      })

      if (!client || !ensureManagerOwnsResource(req.user.id, client.managerId)) {
        return res.status(404).json({ error: 'Client not found' })
      }

      await prisma.$transaction(async (tx) => {
        const transaction = await tx.transaction.create({
          data: {
            clientId,
            managerId: req.user.id,
            productId: validatedData.productId,
            type: validatedData.type,
            quantity: validatedData.quantity,
            amount: validatedData.amount,
            note: validatedData.note
          }
        })

        if (validatedData.type === 'sale') {
          await tx.client.update({
            where: { id: clientId },
            data: { balance: client.balance + validatedData.amount }
          })

          if (validatedData.productId && validatedData.quantity) {
            const product = await tx.product.findUnique({
              where: { id: validatedData.productId }
            })
            if (product) {
              await tx.product.update({
                where: { id: validatedData.productId },
                data: { stock: product.stock - validatedData.quantity }
              })
            }
          }
        } else if (validatedData.type === 'payment') {
          await tx.client.update({
            where: { id: clientId },
            data: { balance: client.balance - validatedData.amount }
          })
        }

        res.status(201).json(transaction)
      })
    } catch (error) {
      console.error('Create transaction error:', error)
      res.status(400).json({ error: 'Invalid data provided' })
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' })
  }
})