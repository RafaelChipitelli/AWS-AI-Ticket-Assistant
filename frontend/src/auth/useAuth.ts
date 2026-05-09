import { fetchAuthSession, getCurrentUser, signInWithRedirect, signOut } from "aws-amplify/auth";
import { useCallback, useEffect, useState } from "react";

interface AuthUser {
  userId: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ user: null, token: null, loading: true });

  const loadUser = useCallback(async () => {
    try {
      const [cognitoUser, session] = await Promise.all([getCurrentUser(), fetchAuthSession()]);
      const token = session.tokens?.accessToken?.toString() ?? null;
      const email = (session.tokens?.idToken?.payload?.email as string) ?? "";
      setState({ user: { userId: cognitoUser.userId, email }, token, loading: false });
    } catch {
      setState({ user: null, token: null, loading: false });
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = useCallback(() => {
    signInWithRedirect({ provider: "Google" });
  }, []);

  const logout = useCallback(async () => {
    await signOut();
    setState({ user: null, token: null, loading: false });
  }, []);

  return { ...state, login, logout };
}
