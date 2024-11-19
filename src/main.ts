import express from 'express'
import morgan from 'morgan'

import catcher from './utils/catcher'
import unlinker from './utils/unlinker'
import imagesDB from './core/imagesDB'
import upload from './core/upload'
import processImage from './core/processImage'

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
        res.status(400).send('You must provide a valid image')
        return
      }

      await unlinker(name)
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

    await unlinker(name)
    imagesDB.delete(name)

    res.status(204).send('Ok')
  }),
)

app.use('/image', express.static('uploads'))

app.listen(8421, () => {
  console.log('[server]: Server is running at http://localhost:8421')
})
