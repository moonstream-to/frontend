import React, { useState, useEffect, useCallback, useContext, createContext } from "react";
import http from "axios";
import { AUTH_URL } from "../../services/auth.service";

type UserContextType = {
  user: any;
};

const UserContext = createContext<UserContextType | any>(null); //TODO

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);

  const getUser = useCallback(() => {
    const token = localStorage.getItem("MOONSTREAM_ACCESS_TOKEN");
    if (!token) {
      return setUser(null);
    }

    const headers = { Authorization: `Bearer ${token}` };
    http
      .get(`${AUTH_URL}/`, { headers })
      .then(
        (response) => {
          setUser(response.data);
        },
        (reason) => {
          if (reason.response.data === "Access token not found") {
            localStorage.removeItem("MOONSTREAM_ACCESS_TOKEN");
            setUser(null);
          }
        },
      )
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      getUser();
    }
    return () => {
      isMounted = false;
    };
  }, [getUser]);

  return <UserContext.Provider value={{ user, setUser, getUser }}>{children}</UserContext.Provider>;
};

const useUser = () => {
  const context = useContext(UserContext);

  if (context === undefined) {
    throw new Error("useUser must be used within UserContext");
  }

  return context;
};

export default useUser;
