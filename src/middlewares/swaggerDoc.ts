import app from '../app'
import { Request, Response, NextFunction } from 'express'
import { mapPathFile, mapPathFolder } from '../utils/map'
import serverConf from '../config/server'
import swaggerUi from 'swagger-ui-express'

const mergeYaml = require('merge-yaml')

const setSwagger = async function (req: Request, res: Response, next: NextFunction) {
    const folders = await mapPathFolder('./src/docs')
    const files = await mapPathFile(folders)
    const swaggerDoc = mergeYaml(files)
    app.use(`${serverConf.commonRoute}/docs`, swaggerUi.serve, swaggerUi.setup(swaggerDoc))
    next()
}

export default setSwagger
