import { Request, Response, NextFunction } from 'express'
import app from '../app'
import { mapPathFileYAML, mapPathFolderYAML } from '../utils/map'
import swaggerUi from 'swagger-ui-express'
import { serverCons } from '@api/constants'

const mergeYaml = require('merge-yaml')

export const setSwagger = async function (req: Request, res: Response, next: NextFunction) {
  const folders = await mapPathFolderYAML('./src/api/v1/docs')
  const files = await mapPathFileYAML(folders)
  const swaggerDoc = mergeYaml(files)
  app.use(`${serverCons.commonRoute}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDoc))
  next()
}

