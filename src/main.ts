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
  '/image/upload',
  upload.single('image'),
  catcher(
    async (req, res) => {
      const oldImage = req.query.image as string
      if (!oldImage) {
        unlinker(req.file)
        res.status(400).send('You must provide a valid image')
        return
      }

      await unlinker(oldImage)
      const newImage = await processImage(req.file, oldImage)
      imagesDB.update(newImage, oldImage)

      res.status(200).json(newImage)
    },
    async (req) => unlinker(req.file),
  ),
)

// List images
app.get(
  '/images',
  catcher(async (_, res) => {
    const images = imagesDB.findAll()

    res.status(200).json({ images: images })
  }),
)

// Delete image
app.delete(
  '/image',
  catcher(async (req, res) => {
    const image = req.query.image as string
    if (!image) {
      res.status(400).send('You must provide a valid image')
    }

    await unlinker(image)
    imagesDB.delete(image)

    res.status(204).send('Ok')
  }),
)

app.use('/images', express.static('uploads'))

app.listen(3002, () => {
  console.log('[server]: Server is running at http://localhost:3002')
})
