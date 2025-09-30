import { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken, JWTPayload } from '@sabir-khatabook/utils'

export interface AuthenticatedRequest extends NextApiRequest {
  user: JWTPayload
}

export const authMiddleware = (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const authHeader = req.headers.authorization
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Authorization header required' })
      }

      const token = authHeader.split(' ')[1]
      const user = verifyToken(token)
      
      ;(req as AuthenticatedRequest).user = user
      
      return handler(req as AuthenticatedRequest, res)
    } catch (error) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }
  }
}

export const authorize = (...roles: string[]) => {
  return (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
    return authMiddleware(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({ error: 'Insufficient permissions' })
      }
      return handler(req, res)
    })
  }
}

export const ensureManagerOwnsResource = (managerId: number, resourceManagerId: number): boolean => {
  return managerId === resourceManagerId
}