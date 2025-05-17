export interface JwtPayload {
  email: string;
  sub: string;
  type?: 'refresh';
} 