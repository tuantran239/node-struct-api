import 'module-alias/register'

import app from '@api/app'
import { logger } from '@api/utils'

import './mongodb'

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  logger.info(`Listening on port ${PORT}`)
})
