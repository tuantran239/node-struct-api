import { MongoMemoryServer } from 'mongodb-memory-server'
import mongoose from 'mongoose'
import configVariableEnv from './config'

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
