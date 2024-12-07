import 'dotenv/config'

import express from 'express'
import morgan from 'morgan'

import catcher from './utils/catcher'
import unlinker from './utils/unlinker'
import imagesDB from './core/imagesDB'
import upload from './core/upload'
import processImage from './core/processImage'
import clacImagePath from './utils/calcImagePath'

// Config
const PORT = process.env.PORT ?? 8421

const app = express()

app.use(morgan('short'))

// Upload new image
app.post(
  '/image/upload',
  upload.single('image'),
  catcher(async (req, res) => {
    const newImage = await processImage(req.file)
    imagesDB.insert(newImage)

    res.status(200).json(newImage)
  }),
)

// Upload replacement image
app.put(
  '/image/upload/:name',
  upload.single('image'),
  catcher(
    async (req, res) => {
      const name = req.params.name as string
      if (!name) {
        unlinker(req.file)
        res.status(400).send('You must provide a valid image name')
        return
      }

      const newImage = await processImage(req.file, name)
      imagesDB.update(newImage)

      res.status(200).json(newImage)
    },
    async (req) => unlinker(req.file),
  ),
)

// List images
app.get(
  '/image',
  catcher(async (_, res) => {
    const images = imagesDB.findAll()

    res.status(200).json({ images: images })
  }),
)

// Delete image
app.delete(
  '/image/:name',
  catcher(async (req, res) => {
    const name = req.params.name as string
    if (!name) {
      res.status(400).send('You must provide a valid image name')
    }

    await unlinker(name, { calcPath: true, rmdirs: true })
    imagesDB.delete(name)

    res.status(204).send('Ok')
  }),
)

// Serve images
app.use('/image', (req, _, next) => {
  const fileName = req.path.slice(1)
  req.url = `/${clacImagePath(fileName)}/${fileName}`

  next()
})
app.use('/image', express.static('uploads'))

app.listen(PORT, () => {
  console.log(`[server]: Server is running at http://localhost:${PORT}`)
})
