import Database from 'better-sqlite3';
import YAML from 'yaml';
import fs from 'fs';
import { rule } from 'postcss';
import type { HttpRoute } from './types';


class DB {
  private database: Database.Database;

  constructor() {
    fs.mkdirSync('data', { recursive: true });
    this.database = new Database('data/database.sqlite');

    this.database.exec(`
      CREATE TABLE IF NOT EXISTS http_routes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) unique,
        target VARCHAR(255),
        mode VARCHAR(50),
        options JSON
      )
    `);

    this.generateTraefikConfig();
  }

  newHttpRoute(httpRoute: Omit<HttpRoute, 'id'>): number | bigint {
    const stmt = this.database.prepare('INSERT INTO http_routes (name, target, mode, options) VALUES (?, ?, ?, ?)');
    const info = stmt.run(httpRoute.name, httpRoute.target, httpRoute.mode, JSON.stringify(httpRoute.options));

    if (info.changes > 0) {
      this.generateTraefikConfig();
    }

    return info.lastInsertRowid;
  }

  deleteHttpRoute(id: number): boolean {
    const info = this.database.prepare('DELETE FROM http_routes WHERE id = ?').run(id);

    return info.changes > 0;
  }

  listHttpRoutes(): HttpRoute[] {
    let routes: HttpRoute[] = [];
    for (let route of this.database.prepare('SELECT * FROM http_routes').all() as any[]) {
      routes.push({
        id: route.id,
        name: route.name,
        target: route.target,
        mode: route.mode,
        options: JSON.parse(route.options)
      })
    }

    return routes;
  }

  private generateTraefikConfig() {
    const routes: HttpRoute[] = this.database.prepare('SELECT * FROM http_routes').all() as HttpRoute[];

    const config: any = {
      http: {
        routers: {},
        services: {}
      }
    };

    routes.forEach(route => {
      let rule = "";

      switch (route.mode) {
        case 'host':
          rule = `Host(\`${route.options.host}\`)`;
          break;
        case 'rule':
          rule = route.options.rule ?? '';
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
}

let db = new DB();

export function getDB() {
  return db;
}


