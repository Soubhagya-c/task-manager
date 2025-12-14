import { jwtDecode } from "jwt-decode";

interface TokenPayload {
  sub: string;
  email: string;
  exp: number;
}

export const getUserFromToken = (): TokenPayload | null => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    return jwtDecode<TokenPayload>(token);
  } catch {
    return null;
  }
};
