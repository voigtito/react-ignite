import Router from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/apiClient";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
}

type SignInCredentials = {
  email: string;
  password: string;
}

type AuthContextData = {
  signIn(credentials: SignInCredentials): Promise<void>;
  signOut: () => void;
  user: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

let authChannel: BroadcastChannel

export function signOut() {
  destroyCookie(undefined, 'nextauth.token');
  destroyCookie(undefined, 'nextauth.refreshToken');
  authChannel.postMessage('signOut')
  Router.push('/');
}

export function AuthProvider({ children }: AuthProviderProps) {

  const [user, setUser] = useState<User>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    authChannel = new BroadcastChannel('auth');
    authChannel.onmessage = (message) => {
      switch (message.data) {
        case 'signOut':
          signOut();
          // authChannel.close();
          break;
          // case "signIn":  
          //   window.location.replace("http://localhost:3000/dashboard");
          // break;
        default:
          break;
      }
    }
  }, [])

  useEffect(() => {

    const { 'nextauth.token': token } = parseCookies();

    if (token) {
      api.get('/me').then(response => {
        const { email, permissions, roles } = response.data;
        setUser({ email, permissions, roles });
      }).catch(error => {
        destroyCookie(undefined, 'nextauth.token');
        destroyCookie(undefined, 'nextauth.refreshToken');
        Router.push('/');
      });
    }

  }, []);

  async function signIn({ email, password }: SignInCredentials) {
    try {
      const response = await api.post('sessions', {
        email,
        password,
      })
      const { permissions, roles, token, refreshToken } = response.data;

      setCookie(undefined, 'nextauth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })
      setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/'
      })

      setUser({
        email,
        permissions,
        roles
      });

      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      Router.push('/dashboard');
    } catch (error) {
      console.log(error)
    }

  }

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}