import { Request, Response, NextFunction } from 'express'
import app from '../app'
import { mapPathFileYAML, mapPathFolderYAML } from '../utils/map'
import { serverConf } from '@config'
import swaggerUi from 'swagger-ui-express'

const mergeYaml = require('merge-yaml')

export const setSwagger = async function (req: Request, res: Response, next: NextFunction) {
  const folders = await mapPathFolderYAML('./src/docs')
  const files = await mapPathFileYAML(folders)
  const swaggerDoc = mergeYaml(files)
  app.use(`${serverConf.commonRoute}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDoc))
  next()
}

