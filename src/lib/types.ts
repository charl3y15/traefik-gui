export interface HttpRoute {
  id: number;
  name: string;
  target: string;
  rule: string;
  mode: 'host' | 'rule'; 
}
