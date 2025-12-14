import { createContext } from 'react';

export type User = { name: string } | null;

export const AuthContext = createContext<{ user: User } | null>(null);

export default AuthContext;
