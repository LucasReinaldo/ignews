import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import Router from "next/router";
import { api } from "services/clientAPI";
import { destroyCookie, parseCookies, setCookie } from "nookies";
type SignInCredentials = {
  email: string;
  password: string;
};

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

type AuthContextData = {
  signIn: (credentials: SignInCredentials) => Promise<void>;
  signOut: () => void;
  user: User;
  isAuthenticated: boolean;
};

type AuthProviderProps = {
  children: ReactNode;
};

const AuthContext = createContext({} as AuthContextData);

let broadcast;

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>(null);
  const isAuthenticated = !!user;

  useEffect(() => {
    broadcast = new BroadcastChannel("ignews:auth");

    broadcast.onmessage = (message) => {
      switch (message.data) {
        case "signOut":
          Router.push("/");
          broadcast.close();
          break;
        case "signIn":
          Router.push("/dashboard");
          break;
        default:
          break;
      }
    };
  }, []);

  useEffect(() => {
    const { "ignews:token": token } = parseCookies();

    if (token) {
      api
        .get("/me")
        .then(({ data }) => {
          const { email, permissions, roles } = data;

          setUser({ email, permissions, roles });
        })
        .catch(() => {
          destroyCookie(undefined, "ignews:token");
          destroyCookie(undefined, "ignews:refreshToken");
          Router.push("/");
        });
    }
  }, []);

  const signIn = useCallback(async ({ email, password }: SignInCredentials) => {
    try {
      const { data } = await api.post("/sessions", { email, password });
      const { token, refreshToken, permissions, roles } = data;
      setUser({ permissions, roles, email });
      setCookie(undefined, "ignews:token", token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
      setCookie(undefined, "ignews:refreshToken", refreshToken, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
      api.defaults.headers["Authorization"] = `Bearer ${token}`;

      broadcast.postMessage('signIn');
    } catch (error) {
      console.log(error);
    }
  }, []);

  const signOut = () => {
    destroyCookie(undefined, "ignews:token");
    destroyCookie(undefined, "ignews:refreshToken");

    broadcast.postMessage('signOut');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
