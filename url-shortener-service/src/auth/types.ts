export type AuthJWT = {
  sub: number;
  username: string;
};

export function isAuthJWT(payload: any): payload is AuthJWT {
  return (
    typeof payload?.sub === 'number' && typeof payload?.username === 'string'
  );
}
