import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'
import { query as q } from 'faunadb'

import { fauna } from '../../../services/fauna';

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user',
    }),
  ],
  jwt: {
    signingKey: `{"kty":"oct","kid":"C5CYDX93EI24pw5HHp7pjMp6QZ1A17t71yfl3lZ5sMU","alg":"HS512","k":"ALkn-HTReJH0K_XgkZc4lPAyASexG56fly37vt7vkwYZ6HeNRWwyLlCux9cbgYhdF6y8XaTr1zDOzQG0jDLfCw"}`
  },
  callbacks: {
    async signIn(user, account, profile) {
      const { email } = user

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )

        return true;

      } catch (error) {
        console.log(error)
        return false;
      }
    }
  }
})