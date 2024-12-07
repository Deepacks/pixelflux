import { mkdirSync } from 'fs'
import { encode } from 'blurhash'
import { unlink } from 'fs/promises'
import { parse, join } from 'path'
import sharp from 'sharp'

import { uploadsPath } from '../utils/paths'
import unlinker from '../utils/unlinker'
import clacImagePath from '../utils/calcImagePath'

const processImage = async (file: Express.Multer.File, oldImage?: string) => {
  const filename = oldImage ?? `${parse(file.filename).name}.webp`

  const fileDirPath = join(uploadsPath, clacImagePath(filename))
  const fileFinalPath = join(fileDirPath, filename)

  if (oldImage) await unlinker(fileFinalPath)
  else mkdirSync(fileDirPath, { recursive: true })

  await sharp(file.path).webp({ quality: 50 }).toFile(fileFinalPath)

  const { data, info } = await sharp(fileFinalPath)
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

  return { name: filename, blurhash }
}

export default processImage
