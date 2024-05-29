export interface HttpRoute {
  id: number;
  name: string;
  target: string;
  mode: RouteMode; 
  options: HttpRouteOptions 
}

export type RouteMode = 'host' | 'rule';

export type HttpRouteOptions = {
    rule?: string;
    host?: string;
}