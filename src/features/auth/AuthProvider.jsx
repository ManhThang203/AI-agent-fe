import { useCallback, useEffect, useMemo, useState } from "react";
import * as authApi from "./authApi.js";
import { AuthContext } from "./authContext.js";
import { clearTokens, getAccessToken } from "./tokenStorage.js";

/** @param {{ id: string, email: string, username: string }} me */
function normalizeUser(me) {
  return {
    id: String(me.id),
    email: me.email,
    username: me.username,
  };
}

/** @param {{ children: import('react').ReactNode }} props */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    /** @type {null | { id: string, email: string, username: string }} */ (
      null
    ),
  );
  const [bootstrapping, setBootstrapping] = useState(true);

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
  }, []);

  const loadMe = useCallback(async () => {
    const token = getAccessToken();
    if (!token) {
      setUser(null);
      setBootstrapping(false);
      return;
    }
    try {
      const me = await authApi.fetchMe();
      setUser(normalizeUser(me));
    } catch {
      clearTokens();
      setUser(null);
    } finally {
      setBootstrapping(false);
    }
  }, []);

  useEffect(() => {
    loadMe();
  }, [loadMe]);

  const login = useCallback(async (email, password) => {
    await authApi.login(email, password);
    const me = await authApi.fetchMe();
    setUser(normalizeUser(me));
  }, []);

  const value = useMemo(
    () => ({
      user,
      bootstrapping,
      login,
      logout,
      reload: loadMe,
    }),
    [user, bootstrapping, login, logout, loadMe],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}
