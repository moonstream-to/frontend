import { createContext, useContext, useState } from "react";

import { useQuery } from "react-query";

import queryCacheProps from "../../hooks/hookCommon";
import useMoonToast from "../../hooks/useMoonToast";
import { SubscriptionsService } from "../../services";
import http from "../../utils/httpMoonstream";
import useUser from "../UserContext";

type QueryContextType = {
  contracts: any;
  queries: any;
  isShowContracts: boolean;
  setIsShowContracts: (arg0: boolean) => void;
  filter: string;
  setFilter: (arg0: string) => void;
  selectedContractId: number;
  setSelectedContractId: (arg0: number) => void;
  types: any;
  setTypes: (arg0: any) => void;
  isCreatingContract: boolean;
  setIsCreatingContract: (arg0: boolean) => void;
  isEditingContract: boolean;
  setIsEditingContract: (arg0: boolean) => void;
  selectedQueryId: number;
  setSelectedQueryId: (arg0: number) => void;
  reset: () => void;
};

const QueryAPIContext = createContext<QueryContextType | undefined>(undefined); //TODO

export const QueryAPIProvider = ({ children }: { children: React.ReactNode }) => {
  const [isShowContracts, setIsShowContracts] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedContractId, setSelectedContractId] = useState(0);
  const [selectedQueryId, setSelectedQueryId] = useState(0);
  const [types, setTypes] = useState([]);
  const [isCreatingContract, setIsCreatingContract] = useState(false);
  const [isEditingContract, setIsEditingContract] = useState(false);
  const { user } = useUser();
  const reset = () => {
    setSelectedContractId(0);
    setSelectedQueryId(0);
    setIsEditingContract(false);
    setIsCreatingContract(false);
  };

  function compare(a: { created_at: string }, b: { created_at: string }) {
    if (a.created_at > b.created_at) {
      return -1;
    }
    if (a.created_at < b.created_at) {
      return 1;
    }
    return 0;
  }

  const toast = useMoonToast();

  const getSubscriptions = () => {
    return SubscriptionsService.getSubscriptions().then((res) =>
      res.data.subscriptions.sort(compare),
    );
  };

  const contracts = useQuery(["subscriptions"], getSubscriptions, {
    ...queryCacheProps,
    onError: (error) => {
      toast(error.message, "error");
    },
    enabled: !!user,
  });

  const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;
  const getQueries = () =>
    http({
      method: "GET",
      url: `${API}/queries/list`,
    });

  const queries = useQuery(["queries"], getQueries, {
    ...queryCacheProps,
    onError: (error) => {
      toast(error.message, "error");
    },
    enabled: !!user,
  });

  const value = {
    contracts,
    queries,
    isShowContracts,
    setIsShowContracts,
    filter,
    setFilter,
    selectedContractId,
    setSelectedContractId,
    types,
    setTypes,
    isCreatingContract,
    setIsCreatingContract,
    isEditingContract,
    setIsEditingContract,
    selectedQueryId,
    setSelectedQueryId,
    reset,
  };

  return <QueryAPIContext.Provider value={value}>{children}</QueryAPIContext.Provider>;
};

const useQueryAPI = () => {
  const context = useContext(QueryAPIContext);

  if (context === undefined) {
    throw new Error("useTerminus must be used within TerminusContext");
  }

  return context;
};

export default useQueryAPI;
