import { unlink, readdir, rm } from 'fs/promises'
import clacImagePath from './calcImagePath'

const unlinker = async (
  image: string | Express.Multer.File,
  options?: { calcPath?: boolean; rmdirs?: boolean },
) => {
  if (typeof image === 'string') {
    if (options?.calcPath) {
      const dirPath = clacImagePath(image)
      await unlink(`uploads/${dirPath}/${image}`)

      if (options?.rmdirs && !(await readdir(`uploads/${dirPath}`)).length) {
        await rm(`uploads/${dirPath.split('/')[0]}`, {
          recursive: true,
          force: true,
        })
      }
    } else {
      await unlink(image)
    }
  } else {
    await unlink(image.path)
  }
}

export default unlinker
