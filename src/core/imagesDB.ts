import Database, { type Database as IDatabase } from 'better-sqlite3'
import { join } from 'path'

import { DBImage } from 'src/types/db-image.type'

class DBStatic {
  db: IDatabase

  constructor() {
    this.db = new Database(join(__dirname, '../..', '/db/images.db'))
    this.db.exec(`
        CREATE TABLE IF NOT EXISTS images (
            image TEXT PRIMARY KEY
        );
    `)
  }

  findAll(): string[] {
    const images = this.db
      .prepare('SELECT image FROM images')
      .all() as DBImage[]
    return images.map(({ image }) => image)
  }

  insert(image: string): void {
    this.db.prepare('INSERT INTO images (image) VALUES (?)').run(image)
  }

  update(newImage: string, oldImage: string): void {
    this.db
      .prepare('UPDATE images SET image = ? WHERE image = ?')
      .run(newImage, oldImage)
  }

  delete(image: string): void {
    this.db.prepare('DELETE FROM images WHERE image = ?').run(image)
  }
}

const imagesDB = new DBStatic()

export default imagesDB
