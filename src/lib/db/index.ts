import { Pool } from "pg"
import { CamelCasePlugin, Kysely, PostgresDialect } from "kysely"
import { GalleryMediaTable, GalleryPersonTable, GalleryTable } from "../types/Gallery"
import { PersonTable, VerificationTable } from "../types/Person"
import { TagTable } from "../types/Tag"
import { AlbumTable } from "../types/Album"
import { AlbumMediaTable, MediaTable } from "../types/Media"
import { WeddingEventTable } from "../types/WeddingEvent"
import { LikeTable } from "../types/Like"
import { AdminActionTable } from "../types/AdminAction"

export interface Database {
    gallery: GalleryTable,
    galleryMedia: GalleryMediaTable,
    galleryPerson: GalleryPersonTable,
    person: PersonTable,
    tag: TagTable,
    album: AlbumTable,
    albumMedia: AlbumMediaTable    
    media: MediaTable
    verification: VerificationTable
    weddingEvent: WeddingEventTable
    likes: LikeTable
    adminActions: AdminActionTable
}

const dialect = new PostgresDialect({
  pool: new Pool({
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    password: process.env.POSTGRES_PASSWORD,
    user: process.env.POSTGRES_USER,
    ssl: {}
  }),
})
  
  // Database interface is passed to Kysely's constructor, and from now on, Kysely 
  // knows your database structure.
  // Dialect is passed to Kysely's constructor, and from now on, Kysely knows how 
  // to communicate with your database.
  export const db = new Kysely<Database>({
    dialect,
    plugins: [
      new CamelCasePlugin()
    ]
  })
  
  
  