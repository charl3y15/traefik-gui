import Database from 'better-sqlite3';
import YAML from 'yaml';
import fs from 'fs';
import type { HttpRoute, TlsRoute } from './types';


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

    this.database.exec(`
      CREATE TABLE IF NOT EXISTS tls_routes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name VARCHAR(255) unique,
        target VARCHAR(255),
        mode VARCHAR(50),
        options JSON,
        acme_http01_challenge INTEGER CHECK (acme_http01_challenge IN (0, 1))
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

    this.generateTraefikConfig();

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

  newTlsRoute(tlsRoute: Omit<TlsRoute, 'id'>): number | bigint {
    const stmt = this.database.prepare('INSERT INTO tls_routes (name, target, mode, acme_http01_challenge, options) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(tlsRoute.name, tlsRoute.target, tlsRoute.mode, tlsRoute.acme_http01_challenge ? 1 : 0, JSON.stringify(tlsRoute.options));

    if (info.changes > 0) {
      this.generateTraefikConfig();
    }

    return info.lastInsertRowid;
  }

  deleteTlsRoute(id: number): boolean {
    const info = this.database.prepare('DELETE FROM tls_routes WHERE id = ?').run(id);

    this.generateTraefikConfig();

    return info.changes > 0;
  }

  listTlsRoutes(): TlsRoute[] {
    let routes: TlsRoute[] = [];
    for (let route of this.database.prepare('SELECT * FROM tls_routes').all() as any[]) {
      routes.push({
        id: route.id,
        name: route.name,
        target: route.target,
        mode: route.mode,
        acme_http01_challenge: route.acme_http01_challenge === 1,
        options: JSON.parse(route.options)
      })
    }

    return routes;
  }

  private generateTraefikConfig() {

    const config: any = {
      http: {
        routers: {},
        services: {}
      },
      tcp: {
        routers: {},
        services: {}
      }
    };


    const http_routes: HttpRoute[] = this.listHttpRoutes();

    http_routes.forEach(route => {

      let rule = "";

      switch (route.mode) {
        case 'host':
          rule = `Host(\`${route.options.host}\`)`;
          break;
        case 'rule':
          rule = route.options.rule ?? '';
          break;
      }

      config.http.routers[`gui-http-${route.name}-router`] = {
        rule: rule,
        service: `gui-http-${route.name}-service`,
      };

      config.http.services[`gui-http-${route.name}-service`] = {
        loadBalancer: {
          servers: [{ url: `http://${route.target}` }]
        }
      };
    });


    const tls_routes: TlsRoute[] = this.listTlsRoutes();

    tls_routes.forEach(route => {
      let rule = "";
      let acme_rule = "";

      switch (route.mode) {
        case 'host':
          rule = `HostSNI(\`${route.options.host}\`)`;
          acme_rule = `Host(\`${route.options.host}\`) && (PathPrefix(\`/.well-known/acme-challenge/\`))`;
          break;
        case 'host_regex':
          rule = `HostSNIRegexp(\`^${route.options.host_regex}$\`)`;
          acme_rule = `HostRegexp(\`^${route.options.host_regex}$\`) && (PathPrefix(\`/.well-known/acme-challenge/\`))`;
          break;
      }

      config.tcp.routers[`gui-tls-${route.name}-router`] = {
        rule: rule,
        service: `gui-tls-${route.name}-service`,
        tls: {
          passthrough: true
        }
      };

      config.tcp.services[`gui-tls-${route.name}-service`] = {
        loadBalancer: {
          servers: [{ address: `${route.target}` }]
        }
      };

      if (route.acme_http01_challenge) {
        config.http.routers[`gui-tls-${route.name}-router`] = {
          rule: acme_rule,
          service: `gui-tls-${route.name}-service`,
        };

        const host = route.target.split(':')[0];


        config.http.services[`gui-tls-${route.name}-service`] = {
          loadBalancer: {
            servers: [{ url: `http://${host}:${route.options.acme_port}` }]
          }
        };
      };

    });

    if (config.http.routers.length == 0) {
      delete config.http;
    }

    fs.mkdirSync('traefik', { recursive: true });
    fs.writeFileSync('traefik/dynamic_config.yml', YAML.stringify(config, { indent: 2 }));
  }
}

let db = new DB();

export function getDB() {
  return db;
}


