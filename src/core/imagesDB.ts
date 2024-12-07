import Database, { type Database as IDatabase } from 'better-sqlite3'
import { mkdirSync } from 'fs'

import { DBImage } from '../types/db-image.type'
import { dbFile, dbPath, tempUploadsPath } from '../utils/paths'

class DBStatic {
  db: IDatabase

  constructor() {
    mkdirSync(dbPath, { recursive: true })
    mkdirSync(tempUploadsPath, { recursive: true })

    this.db = new Database(dbFile)
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

  update({ name, blurhash }: DBImage): void {
    this.db
      .prepare('UPDATE images SET blurhash = ? WHERE name = ?')
      .run(blurhash, name)
  }

  delete(name: string): void {
    this.db.prepare('DELETE FROM images WHERE name = ?').run(name)
  }
}

const imagesDB = new DBStatic()

export default imagesDB
