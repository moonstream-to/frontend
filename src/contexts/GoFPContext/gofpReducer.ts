// import queryCacheProps from "../../hooks/hookCommon";

export const initialState = {
  sessionId: 118,
  gardenContractAddress: '0x8b9493d84e70e94ff9EB1385aD0ed632FD5edE13',
  selectedStage: 1,
  selectedPath: 1,
  selectedTokens: [],
};



const gofpReducer = (state: any, action: {type: string; payload: any}) => {
  const { type, payload } = action;

  switch (type) {
    case "SET_SESSION_ID":
      return {
        ...state,
        sessionId: payload.sessionId
      };
    case "SELECT_PATH":
      return {
        ...state,
        selectedPath: payload.pathId
      };
    case "SELECT_STAGE":
      return {
        ...state,
        selectedStage: payload.stageId
      };
    case 'TOGGLE_TOKEN_SELECT':
      let newSelectedTokens = []
        if (state.selectedTokens.includes(payload.tokenId)) {
          newSelectedTokens = state.selectedTokens.filter((token: number) => token !== payload.tokenId)
        } else {
          newSelectedTokens = [...state.selectedTokens, payload.tokenId]
        }
        return {
          ...state,
          selectedTokens: newSelectedTokens,
        }
    default:
      throw new Error(`No case for type ${type} found in shopReducer.`);
  }
};

export default gofpReducer;
