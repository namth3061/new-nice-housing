import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "Ninehousing-jwt-secret-change-in-production";
export const JWT_EXPIRY = "90d"; // 3 months
export const ADMIN_COOKIE_NAME = "admin_token";

export interface JwtPayload {
  sub: number;
  email: string;
  iat?: number;
  exp?: number;
}

export function signAdminToken(payload: { sub: number; email: string }): string {
  return jwt.sign(
    { sub: payload.sub, email: payload.email },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRY }
  );
}

export function verifyAdminToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as unknown as JwtPayload;
    return decoded;
  } catch {
    return null;
  }
}
