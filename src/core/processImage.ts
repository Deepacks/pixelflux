import { encode } from 'blurhash'
import { unlink } from 'fs/promises'
import { parse, join } from 'path'
import sharp from 'sharp'

const processImage = async (file: Express.Multer.File, oldImage?: string) => {
  const webPath = oldImage ?? `${parse(file.filename).name}.webp`
  const newPath = join(file.destination, webPath)

  await sharp(file.path).webp({ quality: 50 }).toFile(newPath)

  const { data, info } = await sharp(newPath)
    .resize(64, 64)
    .raw()
    .ensureAlpha()
    .toBuffer({ resolveWithObject: true })

  const blurhash = encode(
    new Uint8ClampedArray(data),
    info.width,
    info.height,
    4,
    4,
  )

  await unlink(file.path)

  return { name: webPath, blurhash }
}

export default processImage
