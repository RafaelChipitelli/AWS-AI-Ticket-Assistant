import { fetchAuthSession, getCurrentUser, signInWithRedirect, signOut } from "aws-amplify/auth";
import { useCallback, useEffect, useState } from "react";

const RETURNING_USER_KEY = "ticket-assistant:returning-user";

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
      localStorage.setItem(RETURNING_USER_KEY, "1");
      setState({ user: { userId: cognitoUser.userId, email }, token, loading: false });
    } catch {
      // No active session in memory. If the user has logged in before on this
      // device, Cognito's HttpOnly session cookie likely still exists, so we
      // can silently re-authenticate without showing the login screen.
      if (localStorage.getItem(RETURNING_USER_KEY) === "1") {
        signInWithRedirect({ provider: "Google" }).catch(() => {
          localStorage.removeItem(RETURNING_USER_KEY);
          setState({ user: null, token: null, loading: false });
        });
        return;
      }
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
    localStorage.removeItem(RETURNING_USER_KEY);
    await signOut();
    setState({ user: null, token: null, loading: false });
  }, []);

  return { ...state, login, logout };
}
