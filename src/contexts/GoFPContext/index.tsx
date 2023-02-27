import { createContext, useReducer, useContext } from "react";
import gofpReducer, { initialState } from "./gofpReducer";



type gofpContextType = {
  selectedStage: number
  selectedPath: number
  selectedTokens: number[]
  gardenContractAddress: string
  sessionId: number
  selectStage: (stage: number) => void
  selectPath: (path: number) => void
  selectToken: (tokenId: number) => void
  generatePathId: (stage: number, path: number) => string
  setSessionId: (sessionId: number) => void
  setGardenContractAddress: (address: string) => void
  toggleTokenSelect: (tokenId: number) => void
}


const GofpContext = createContext<gofpContextType | any>(initialState); //TODO

export const GofpProvider = ({ children }: {children: React.ReactNode}) => {
  const [state, dispatch] = useReducer(gofpReducer, initialState);

  const selectStage = (stageId: number) => {
    dispatch({
      type: "SELECT_STAGE",
      payload: {
        stageId,
      }
    });
  };

  const generatePathId =  (stage: number, path: number) => {
    return `stage_${stage}_path_${path}`;
  }

  const toggleTokenSelect = (tokenId: number) => {
    dispatch({
      type: 'TOGGLE_TOKEN_SELECT',
      payload: {
        tokenId,
      }
    })
  }

  const selectPath = (pathId: number) => {
    dispatch({
      type: "SELECT_PATH",
      payload: {
        pathId,
      }
    });
  };

  const selectToken = (tokenId: number) => {
    dispatch({
      type: "SELECT_TOKEN",
      payload: {
        tokenId,
      }
    });
  };

  const setSessionId = (sessionId: number) => {
    dispatch({
      type: 'SET_SESSION_ID',
      payload: {
        sessionId
      }
    })
  }

  const setGardenContractAddress = (address: string) => {
    dispatch({
      type: 'SET_GARDEN_ADDRESS',
      payload: {
        address,
      }
    })
  }

  const {selectedStage, selectedPath, selectedTokens, sessionId, gardenContractAddress} = state
  

  const value = {
    selectedStage,
    selectedPath,
    selectedTokens,
    generatePathId,
    selectStage,
    selectPath,
    selectToken,
    sessionId,
    gardenContractAddress,
    setSessionId,
    toggleTokenSelect,
    setGardenContractAddress,
  };


  return <GofpContext.Provider value={value}>{children}</GofpContext.Provider>;
};

const useGofp = () => {
  const context = useContext(GofpContext);

  if (context === undefined) {
    throw new Error("useGofp must be used within gofpContext");
  }

  return context;
};

export default useGofp;
