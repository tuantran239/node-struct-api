import 'module-alias/register'

import app from '@api-v1/app'
import { logger } from '@api-v1/utils'

import './mongodb'

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`)
})
