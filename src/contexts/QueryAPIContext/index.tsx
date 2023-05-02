import { createContext, useContext, useState } from "react";

import { useQuery } from "react-query";

import queryCacheProps from "../../hooks/hookCommon";
import useMoonToast from "../../hooks/useMoonToast";
import { SubscriptionsService } from "../../services";
import useUser from "../UserContext";

type QueryContextType = {
  contracts: any;
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
  selectedQuery: any;
  setSelectedQuery: (arg0: any) => void;
  reset: () => void;
};

const QueryAPIContext = createContext<QueryContextType | undefined>(undefined); //TODO

export const QueryAPIProvider = ({ children }: { children: React.ReactNode }) => {
  const [isShowContracts, setIsShowContracts] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedContractId, setSelectedContractId] = useState(0);
  const [selectedQuery, setSelectedQuery] = useState({});
  const [types, setTypes] = useState([]);
  const [isCreatingContract, setIsCreatingContract] = useState(false);
  const [isEditingContract, setIsEditingContract] = useState(false);
  const { user } = useUser();
  const reset = () => {
    setSelectedContractId(0);
    setSelectedQuery({});
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
    console.log("get subscriptions");
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

  const value = {
    contracts,
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
    selectedQuery,
    setSelectedQuery,
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
