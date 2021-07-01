import axios from 'axios'
import { Request, Response, Router } from 'express'
import jwt from 'express-jwt'
import jwtAuthz from 'express-jwt-authz'
import * as admin from 'firebase-admin'
import jwks from 'jwks-rsa'
import { wrap } from '../../../core/web/express/handle'
// import memberRoutes from './member.api'

const router = Router()
// router.use(memberRoutes)

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://s2factory.jp.auth0.com/.well-known/jwks.json'
  }),
  audience: 'http://localhost:3001',
  issuer: 'https://s2factory.jp.auth0.com/',
  algorithms: ['RS256']
})

const checkScopes = jwtAuthz([ 'email' ])

router.get('/authorized', jwtCheck, checkScopes, wrap(async function (req: Request, res: Response) {
  try {
    const response = await axios.get('https://s2factory.jp.auth0.com/userinfo', {
      headers: {
        Authorization: req.header('Authorization') ?? '',
      },
    })
    console.log(response.data)

    const user = (req as unknown as { user: { sub: string } }).user
    console.log(user)
    res.send('有効なセッションです')
  } catch (error) {
    console.log(error)
  }
}))

router.get('/firebase/authorized', wrap(async function (req: Request, res: Response) {
  const serviceAccount = await import('../../../../config/firebase/api-project-189557828508-firebase-adminsdk-q3055-0652499485.json')
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount)
  })

  const authorization = req.header('Authorization')
  if (authorization != null) {
    const parts = authorization.split(' ')
    if (parts.length == 2 && parts[0].toLowerCase() === 'bearer') {
      const idToken = parts[1]

      try {
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        console.log(decodedToken)

        res.send('有効なセッションです')
      } catch (error) {
        console.log(error)
      }
    }
  }
}))

export default router
