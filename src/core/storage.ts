import { Request } from 'express'
import { mkdirSync } from 'fs'
import { diskStorage } from 'multer'
import { join } from 'path'
import { v4 as uuid } from 'uuid'

interface MulterRequest extends Request {
  generatedFilename?: string
}

const storage = diskStorage({
  destination: (req: MulterRequest, file, cb) => {
    const generatedFilename = uuid()

    req.generatedFilename = generatedFilename

    const dirPath = [
      generatedFilename.substring(0, 2),
      generatedFilename.substring(2, 4),
      generatedFilename.substring(4, 6),
    ]

    const destinationPath = join(__dirname, '../..', '/uploads', ...dirPath)
    mkdirSync(destinationPath, { recursive: true })

    cb(null, destinationPath)
  },
  filename: (req: MulterRequest, __, cb) => {
    if (!req.generatedFilename) {
      return cb(new Error('Generated filename not found'), '')
    }

    cb(null, req.generatedFilename)
  },
})

export default storage
