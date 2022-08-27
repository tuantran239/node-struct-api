import request from 'supertest'
import app from '../src/api/v1/app'

const login = async () => {
  const body = {
    name: 'user',
    email: 'user@gmail.com',
    password: '123456',
    active: true
  }
  await request(app).post('/api/v1/auth/signup').send(body).expect(201)
  const response = await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: 'user@gmail.com',
      password: '123456'
    })
    .expect(200)
  return response.get('Set-Cookie')
}

test('should return 201 when signup success', async () => {
  const body = {
    name: 'user',
    email: 'user@gmail.com',
    password: '123456'
  }
  await request(app).post('/api/v1/auth/signup').send(body).expect(201)
})

test('should return 200 when signin success', async () => {
  const body = {
    name: 'user',
    email: 'user@gmail.com',
    password: '123456',
    active: true
  }
  await request(app).post('/api/v1/auth/signup').send(body).expect(201)
  await request(app)
    .post('/api/v1/auth/login')
    .send({
      email: body.email,
      password: body.password
    })
    .expect(200)
})

test('shoud return 200 when auth success', async () => {
  const cookies = await login()
  await request(app).get('/api/v1/auth').set('Cookie', cookies).expect(200)
})
