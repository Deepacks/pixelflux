import Database, { type Database as IDatabase } from 'better-sqlite3'
import { join } from 'path'

import { DBImage } from 'src/types/db-image.type'

class DBStatic {
  db: IDatabase

  constructor() {
    this.db = new Database(join(__dirname, '../..', '/db/images.db'))
    this.db.exec(`
        CREATE TABLE IF NOT EXISTS images (
            name TEXT PRIMARY KEY,
            blurhash TEXT
        );
    `)
  }

  findAll(): DBImage[] {
    return this.db
      .prepare('SELECT name, blurhash FROM images')
      .all() as DBImage[]
  }

  insert({ name, blurhash }: DBImage): void {
    this.db
      .prepare('INSERT INTO images (name, blurhash) VALUES (?, ?)')
      .run(name, blurhash)
  }

  update({ name, blurhash }: DBImage, oldImage: string): void {
    this.db
      .prepare('UPDATE images SET name = ?, blurhash = ? WHERE name = ?')
      .run(name, blurhash, oldImage)
  }

  delete(name: string): void {
    this.db.prepare('DELETE FROM images WHERE name = ?').run(name)
  }
}

const imagesDB = new DBStatic()

export default imagesDB
