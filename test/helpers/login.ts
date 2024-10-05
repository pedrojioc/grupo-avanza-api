import * as request from 'supertest'

export async function authenticate(host: string) {
  const response = await request(host)
    .post('/auth/login')
    .send({ username: 'pedro', password: 'pedro.123' })

  const accessToken = response.body.access_token
  return accessToken
}
