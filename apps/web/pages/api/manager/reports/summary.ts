import { NextApiResponse } from 'next'
import { prisma } from '@sabir-khatabook/db'
import { authorize, AuthenticatedRequest } from '@/utils/auth-middleware'

export default authorize('manager')(async (req: AuthenticatedRequest, res: NextApiResponse) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const sales = await prisma.transaction.findMany({
      where: {
        managerId: req.user.id,
        type: 'sale'
      }
    })

    const clients = await prisma.client.findMany({
      where: { managerId: req.user.id }
    })

    const products = await prisma.product.findMany({
      where: { managerId: req.user.id }
    })

    const recentTransactions = await prisma.transaction.findMany({
      where: { managerId: req.user.id },
      include: {
        client: true,
        product: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    })

    const totalSales = sales.reduce((sum, sale) => sum + sale.amount, 0)
    const totalDues = clients.reduce((sum, client) => sum + client.balance, 0)
    const lowStockItems = products.filter(product => product.stock < 10).length

    res.json({
      totalSales,
      totalDues,
      lowStockItems,
      recentTransactions
    })
  } catch (error) {
    console.error('Fetch summary error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})