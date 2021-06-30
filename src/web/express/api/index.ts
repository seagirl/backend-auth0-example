import axios from 'axios'
import { Request, Response, Router } from 'express'
import jwtAuthz from 'express-jwt-authz'
// import memberRoutes from './member.api'

const router = Router()
// router.use(memberRoutes)

const checkScopes = jwtAuthz([ 'email' ])

router.get('/authorized', checkScopes, function (req: Request, res: Response) {
  const result = axios.get('https://s2factory.jp.auth0.com/userinfo', {
    headers: {
      Authorization: req.header('Authorization') ?? '',
    },
  })
    .then(function (res) {
      console.log(res.data)
    })

  const user = (req as unknown as { user: { sub: string } }).user
  console.log(user)
  res.send('有効なセッションです')
})

export default router
