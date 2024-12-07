import { v4 as uuid } from 'uuid'
import { diskStorage } from 'multer'

import { tempUploadsPath } from '../utils/paths'

const storage = diskStorage({
  destination: (_, __, cb) => cb(null, tempUploadsPath),
  filename: (_, __, cb) => cb(null, uuid()),
})

export default storage
