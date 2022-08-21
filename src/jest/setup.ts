
import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import configVariableEnv from './config'
import request from 'supertest'
import app from '../app'

let mongod: any

jest.setTimeout(100000)

beforeAll(async () => {
    configVariableEnv()
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    await mongoose.connect(uri, {})
})

beforeEach(async () => {
    const collections = await mongoose.connection.db.collections()
    for (const collection of collections) {
        await collection.deleteMany({})
    }
})

afterAll(async () => {
    await mongod?.stop()
    await mongoose.connection.close()
})

global.login = async () => {
    const body = {
        name: 'user',
        email: 'user@gmail.com',
        password: '123456',
        active: true
    }
    await request(app).post('/api/v1/auth/register').send(body).expect(201)
    const response = await request(app).post('/api/v1/auth/login').send({
        email: 'user@gmail.com',
        password: '123456'
    }).expect(200)
    return response.get('Set-Cookie')
}
