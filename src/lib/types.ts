export interface HttpRoute {
  id: number;
  name: string;
  target: string;
  mode: HttpRouteMode;
  options: HttpRouteOptions
}

export type HttpRouteMode = 'host' | 'rule';

export type HttpRouteOptions = {
  rule?: string;
  host?: string;
  priority?: number;
}

export interface TlsRoute {
  id: number;
  name: string;
  target: string;
  mode: TlsRouteMode;
  options: TlsRouteOptions;
  acme_http01_challenge?: boolean;
}

export type TlsRouteMode = 'host' | 'host_regex'

export type TlsRouteOptions = {
  host?: string;
  host_regex?: string;
  acme_port?: number;
  priority?: number;
}

export interface Stats {
  http_routes: number;
  tls_routes: number;
}