import { authMiddleware } from '@/utils/auth-middleware'

export default authMiddleware(async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  res.json(req.user)
})