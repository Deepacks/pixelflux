import { join } from 'path'

const root = join(__dirname, '../..')

export const dbPath = join(root, 'db')
export const dbFile = join(root, 'db/images.db')
export const uploadsPath = join(root, 'uploads')
export const tempUploadsPath = join(root, 'uploads/temp')
