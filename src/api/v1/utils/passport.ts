import passport from 'passport'
import passportGoogle from 'passport-google-oauth20'
import { passportConf } from '../../../config'
import { createUser, getUser } from '../services/user.service'
import { AuthType } from '../types/user.type'
import { generateAvatarUrl } from './common'

const GoogleStrategy = passportGoogle.Strategy

passport.serializeUser((user: any, done: any) => {
  done(null, user._id)
})

passport.deserializeUser(async (userId: any, done: any) => {
  const user = await getUser({ _id: userId })
  done(null, user)
})

passport.use(
  new GoogleStrategy(
    {
      clientID: passportConf.google.googleClientId as string,
      clientSecret: passportConf.google.googleClientSecret as string,
      callbackURL: passportConf.google.googleCallbackUrl as string
    },
    async function (
      accessToken,
      refreshToken,
      profile,
      done
    ) {
      const { emails, displayName, photos } = profile
      const email = emails ? emails[0].value : 'email'
      const photoUrl = photos ? photos[0].value : generateAvatarUrl(displayName)
      const { data: user } = await getUser({
        email,
        authType: AuthType.GOOGLE
      })
      if (!user) {
        const body = {
          name: displayName,
          email,
          password: 'password',
          active: true,
          authType: AuthType.GOOGLE,
          avatar: {
            public_id: null,
            url: photoUrl
          }
        }
        const { data: newUser, error } = await createUser(body)
        if (error) {
          throw new Error('Error login google')
        }
        done(null, newUser)
      } else {
        done(null, user)
      }
    }
  )
)
