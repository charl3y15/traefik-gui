import Database from 'better-sqlite3';

let db: Database.Database | null = null;

export function getDB() {
  if (!db) {
    db = new Database('database.sqlite');

    db.exec(`
      CREATE TABLE IF NOT EXISTS http_routes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) unique,
        target VARCHAR(255),
        rule TEXT
      )
    `);
  }

  return db;
}
