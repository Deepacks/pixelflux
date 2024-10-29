import { unlink } from 'fs/promises'

const unlinker = async (image: string | Express.Multer.File) => {
  if (typeof image === 'string') {
    await unlink(`uploads/${image}`)
  } else {
    await unlink(image.path)
  }
}

export default unlinker
