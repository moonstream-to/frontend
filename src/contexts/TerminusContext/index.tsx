import { createContext, useReducer, useContext } from "react";
import terminusReducer, { initialState } from "./terminusReducer";

export type ContractData = {
  name?: string;
  image?: string;
  chainId?: number;
};

type TerminusContextType = {
  selectedPool: number;
  poolMetadata: any;
  contractState: any;
  contractAddress: string;
  recentAddresses: { address: ContractData } | undefined;
  queryPoolId: number | undefined;
  poolsFilter: string;
  isNewPoolCreated: boolean;
  selectPool: (poolId: number) => void;
  setSelectedPoolMetadata: (metadata: unknown) => void;
  setContractState: (state: unknown) => void;
  setContractAddress: (address: string) => void;
  addRecentAddress: (address: string, data: ContractData) => void;
  setRecentAddresses: (addresses: { address: ContractData }) => void;
  deleteRecentAddress: (address: string) => void;
  setQueryPoolId: (poolId: number) => void;
  setPoolsFilter: (filter: string) => void;
  setIsNewPoolCreated: (isNewPoolCreated: boolean) => void;
};

const TerminusContext = createContext<TerminusContextType | undefined>(undefined); //TODO

export const TerminusProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer(terminusReducer, initialState);

  const selectPool = (poolId: number) => {
    dispatch({
      type: "SET_SELECTED_POOL",
      payload: { poolId },
    });
  };
  const setSelectedPoolMetadata = (metadata: unknown) => {
    dispatch({
      type: "SET_POOL_METADATA",
      payload: { metadata },
    });
  };

  const setContractState = (state: unknown) => {
    dispatch({
      type: "SET_CONTRACT_STATE",
      payload: { state },
    });
  };
  const setContractAddress = (address: string) => {
    dispatch({
      type: "SET_CONTRACT_ADDRESS",
      payload: { address },
    });
  };
  const addRecentAddress = (address: string, data: ContractData) => {
    dispatch({
      type: "ADD_RECENT_ADDRESS",
      payload: { address, data },
    });
  };
  const setRecentAddresses = (addresses: { address: ContractData }) => {
    dispatch({
      type: "SET_RECENT_ADDRESSES",
      payload: { addresses },
    });
  };
  const deleteRecentAddress = (address: string) => {
    dispatch({
      type: "DELETE_RECENT_ADDRESS",
      payload: { address },
    });
  };
  const setQueryPoolId = (poolId: number) => {
    dispatch({
      type: "SET_QUERY_POOL_ID",
      payload: { poolId },
    });
  };
  const setPoolsFilter = (filter: string) => {
    dispatch({
      type: "SET_POOLS_FILTER",
      payload: { filter },
    });
  };
  const setIsNewPoolCreated = (isNewPoolCreated: boolean) => {
    dispatch({
      type: "SET_IS_NEW_POOL_CREATED",
      payload: { isNewPoolCreated },
    });
  };

  const {
    selectedPool,
    poolMetadata,
    contractState,
    contractAddress,
    recentAddresses,
    queryPoolId,
    poolsFilter,
    isNewPoolCreated,
  } = state;

  const value = {
    selectedPool,
    poolMetadata,
    contractState,
    contractAddress,
    recentAddresses,
    queryPoolId,
    poolsFilter,
    isNewPoolCreated,
    selectPool,
    setSelectedPoolMetadata,
    setContractState,
    setContractAddress,
    addRecentAddress,
    setRecentAddresses,
    deleteRecentAddress,
    setQueryPoolId,
    setPoolsFilter,
    setIsNewPoolCreated,
  };

  return <TerminusContext.Provider value={value}>{children}</TerminusContext.Provider>;
};

const useTermiminus = () => {
  const context = useContext(TerminusContext);

  if (context === undefined) {
    throw new Error("useTerminus must be used within TerminusContext");
  }

  return context;
};

export default useTermiminus;
