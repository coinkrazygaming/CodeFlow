import { ReactNode, createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  image?: string;
  subscription_tier?: string;
  ai_edits_used?: number;
  github_username?: string;
}

interface Session {
  user: User;
}

interface AuthContextType {
  data: Session | null;
  status: 'loading' | 'authenticated' | 'unauthenticated';
}

const AuthContext = createContext<AuthContextType>({
  data: null,
  status: 'unauthenticated'
});

interface AuthProviderProps {
  children: ReactNode;
  session?: any;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [session] = useState<Session | null>(null);
  const [status] = useState<'loading' | 'authenticated' | 'unauthenticated'>('unauthenticated');

  return (
    <AuthContext.Provider value={{ data: session, status }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useSession() {
  return useContext(AuthContext);
}

export function signIn(provider: string, options?: { callbackUrl?: string }) {
  console.log('Sign in with:', provider, options);
  // Mock sign in for development
}

export function signOut() {
  console.log('Sign out');
  // Mock sign out for development
}

export function getSession() {
  return Promise.resolve(null);
}
