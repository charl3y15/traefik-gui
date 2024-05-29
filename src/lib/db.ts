import Database from 'better-sqlite3';
import YAML from 'yaml';
import fs from 'fs';

let db: Database.Database | null = null;

export function getDB() {
  if (!db) {
    fs.mkdirSync('data', { recursive: true });
    db = new Database('data/database.sqlite');

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

function generateTraefikConfig() {
  const db = getDB();
  const routes = db.prepare('SELECT * FROM http_routes').all();

  const config = {
    http: {
      routers: {},
      services: {}
    }
  };

  routes.forEach(route => {
    config.http.routers[route.name] = {
      rule: route.rule,
      service: `${route.name}-service`,
      entryPoints: ['web']
    };

    config.http.services[`${route.name}-service`] = {
      loadBalancer: {
        servers: [{ url: `http://${route.target}` }]
      }
    };
  });

  fs.mkdirSync('traefik', { recursive: true });
  fs.writeFileSync('traefik/dynamic_config.yml', YAML.stringify(config, { indent: 2 }));
}

generateTraefikConfig();