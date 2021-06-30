import { Request, Response, Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
// import memberRoutes from './member.api'

const router = Router()
// router.use(memberRoutes)

const checkScopes = jwtAuthz([ 'email' ])

router.get('/authorized', checkScopes, function (req: Request, res: Response) {
  const user = (req as unknown as { user: { sub: string } }).user
  console.log(user)
  res.send('有効なセッションです')
})

export default router
