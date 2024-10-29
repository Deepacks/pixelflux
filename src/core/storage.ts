import { diskStorage } from 'multer'
import { join, extname } from 'path'
import { v4 as uuid } from 'uuid'

const storage = diskStorage({
  destination: (_, __, cb) => {
    cb(null, join(__dirname, '../..', '/uploads'))
  },
  filename: (_, __, cb) => {
    cb(null, uuid())
  },
})

export default storage
