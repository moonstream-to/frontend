import React, { useState, useEffect, useCallback, useContext, createContext } from "react";
import http from "axios";
// import UserContext from "./context";
import { AUTH_URL } from "../../services/auth.service";

type UserContextType = {
  user: any;
  // selectedStage: number
  // selectedPath: number
  // selectedTokens: number[]
  // gardenContractAddress: string
  // sessionId: number
  // selectStage: (stage: number) => void
  // selectPath: (path: number) => void
  // selectToken: (tokenId: number) => void
  // generatePathId: (stage: number, path: number) => string
  // setSessionId: (sessionId: number) => void
  // setGardenContractAddress: (address: string) => void
  // toggleTokenSelect: (tokenId: number) => void
};

const UserContext = createContext<UserContextType | any>(null); //TODO

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null);
  // const [isInit, setInit] = useState(false);

  const getUser = useCallback(() => {
    const token = localStorage.getItem("MOONSTREAM_ACCESS_TOKEN");
    if (!token) {
      // setInit(true);
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
    // .finally(() => setInit(true));
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
    throw new Error("useGofp must be used within gofpContext");
  }

  return context;
};

export default useUser;

// export default UserProvider;
