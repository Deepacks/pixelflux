import multer from 'multer'

import storage from './storage'

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (_, file, cb) {
    const fileTypes = /jpeg|jpg|png|webp/
    const mimetype = fileTypes.test(file.mimetype)

    if (!mimetype) {
      return cb(new Error('Only images are allowed'))
    }

    return cb(null, true)
  },
})

export default upload
