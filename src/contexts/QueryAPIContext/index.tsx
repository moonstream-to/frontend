import { createContext, useContext, useState } from "react"
// import terminusReducer, { initialState } from "./queryReducer"

type QueryContextType = {
  isShowContracts: boolean
  setIsShowContracts: (arg0: boolean) => void
}

// const initial state

const QueryAPIContext = createContext<QueryContextType | undefined>(undefined) //TODO

export const QueryAPIProvider = ({ children }: { children: React.ReactNode }) => {
  const [isShowContracts, setIsShowContracts] = useState(true)

  const value = {
    isShowContracts,
    setIsShowContracts,
  }

  return <QueryAPIContext.Provider value={value}>{children}</QueryAPIContext.Provider>
}

const useQueryAPI = () => {
  const context = useContext(QueryAPIContext)

  if (context === undefined) {
    throw new Error("useTerminus must be used within TerminusContext")
  }

  return context
}

export default useQueryAPI
