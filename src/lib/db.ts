import Database from 'better-sqlite3';
import YAML from 'yaml';
import fs from 'fs';
import { rule } from 'postcss';
import type { HttpRoute } from './types';

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

    const columns = db.prepare(`PRAGMA table_info(http_routes)`).all();
    if (!columns.some(column => column.name === 'mode')) {
      db.exec(`ALTER TABLE http_routes ADD COLUMN mode VARCHAR(50) DEFAULT 'rule'`);
    }
  }

  return db;
}

export function generateTraefikConfig() {
  const db = getDB();
  const routes: HttpRoute[] = db.prepare('SELECT * FROM http_routes').all() as HttpRoute[];

  const config = {
    http: {
      routers: {},
      services: {}
    }
  };

  routes.forEach(route => {
    let rule = "";

    switch (route.mode) {
      case 'host':
        rule = `Host(\`${route.rule}\`)`;
        break;
      case 'rule':
        rule = route.rule;
        break;
    }

    config.http.routers[`gui-${route.name}-service`] = {
      rule: rule,
      service: `gui-${route.name}-service`,
      entryPoints: ['web']
    };

    config.http.services[`gui-${route.name}-service`] = {
      loadBalancer: {
        servers: [{ url: `http://${route.target}` }]
      }
    };
  });

  fs.mkdirSync('traefik', { recursive: true });
  fs.writeFileSync('traefik/dynamic_config.yml', YAML.stringify(config, { indent: 2 }));
}

generateTraefikConfig();