import { createContext, useContext, useState } from "react";
// import terminusReducer, { initialState } from "./queryReducer"

type QueryContextType = {
  isShowContracts: boolean;
  setIsShowContracts: (arg0: boolean) => void;
  filter: string;
  setFilter: (arg0: string) => void;
  selectedContract: any;
  setSelectedContract: (arg0: any) => void;
  types: any;
  setTypes: (arg0: any) => void;
  isCreatingContract: boolean;
  setIsCreatingContract: (arg0: boolean) => void;
  isEditingContract: boolean;
  setIsEditingContract: (arg0: boolean) => void;
  selectedQuery: any;
  setSelectedQuery: (arg0: any) => void;
};

// const initial state

const QueryAPIContext = createContext<QueryContextType | undefined>(undefined); //TODO

export const QueryAPIProvider = ({ children }: { children: React.ReactNode }) => {
  const [isShowContracts, setIsShowContracts] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedContract, setSelectedContract] = useState({});
  const [selectedQuery, setSelectedQuery] = useState({});

  const [types, setTypes] = useState([]);
  const [isCreatingContract, setIsCreatingContract] = useState(false);
  const [isEditingContract, setIsEditingContract] = useState(false);

  const value = {
    isShowContracts,
    setIsShowContracts,
    filter,
    setFilter,
    selectedContract,
    setSelectedContract,
    types,
    setTypes,
    isCreatingContract,
    setIsCreatingContract,
    isEditingContract,
    setIsEditingContract,
    selectedQuery,
    setSelectedQuery,
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
