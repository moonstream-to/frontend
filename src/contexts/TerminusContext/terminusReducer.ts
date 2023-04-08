export const initialState = {
  selectedPool: 1,
  poolMetadata: {},
  contractState: undefined,
  contractAddress: "",
  recentAddresses: undefined,
  queryPoolId: undefined,
  poolsFilter: "",
}

const terminusReducer = (state: any, action: { type: string; payload: any }) => {
  const { type, payload } = action

  switch (type) {
    case "SET_SELECTED_POOL":
      return {
        ...state,
        selectedPool: payload.poolId,
      }
    case "SET_POOL_METADATA":
      return {
        ...state,
        poolMetadata: payload.metadata,
      }
    case "SET_CONTRACT_STATE":
      return {
        ...state,
        contractState: payload.contractState,
      }
    case "SET_CONTRACT_ADDRESS":
      return {
        ...state,
        contractAddress: payload.contractAddress,
      }
    case "ADD_RECENT_ADDRESS":
      const newRecentAddresses = { ...state.recentAddresses }
      newRecentAddresses[payload.address] = {
        ...newRecentAddresses[payload.address],
        ...payload.data,
      }
      return {
        ...state,
        recentAddresses: newRecentAddresses,
      }
    case "SET_RECENT_ADDRESSES":
      return {
        ...state,
        recentAddresses: payload.addresses,
      }
    case "DELETE_RECENT_ADDRESS":
      return {
        ...state,
        recentAddresses: state.recentAddresses.filter(
          (address: string) => address != payload.address,
        ),
      }
    case "SET_QUERY_POOL_ID": {
      return {
        ...state,
        queryPoolId: payload.poolId,
      }
    }
    case "SET_POOLS_FILTER":
      return {
        ...state,
        poolsFilter: payload.filter,
      }
    default:
      throw new Error(`No case for type ${type} found in shopReducer.`)
  }
}

export default terminusReducer
