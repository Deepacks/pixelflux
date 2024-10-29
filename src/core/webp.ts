import { unlink } from 'fs/promises'
import { parse } from 'path'
import sharp from 'sharp'

const webp = async (file: Express.Multer.File) => {
  const outputPath = file.destination
  const webPath = `${parse(file.filename).name}.webp`

  await sharp(file.path)
    .webp({ quality: 100 })
    .toFile(`${outputPath}/${webPath}`)

  await unlink(file.path)

  return webPath
}

export default webp
