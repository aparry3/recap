// Database Types
export interface DatabaseConnection {
  host: string
  port: number
  database: string
  username: string
  password: string
}

export interface QueryResult<T> {
  rows: T[]
  rowCount: number
}