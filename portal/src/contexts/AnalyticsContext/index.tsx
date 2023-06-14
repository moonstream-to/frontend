import { createContext, useContext, useState } from "react";

import { useQuery } from "react-query";
import useUser from "../../contexts/UserContext";

import queryCacheProps from "../../hooks/hookCommon";
import useMoonToast from "../../hooks/useMoonToast";
import { getDescriptionForTitle, getRandomTags, getRandomTitle } from "../../mocks";
import { SubscriptionsService } from "../../services";
import http from "../../utils/httpMoonstream";

type AnalyticsContextType = {
  addresses: any;
  queries: any;
  isShowContracts: boolean;
  setIsShowContracts: (arg0: boolean) => void;
  filter: string;
  setFilter: (arg0: string) => void;
  selectedAddressId: number;
  setSelectedAddressId: (arg0: number) => void;
  types: any;
  setTypes: (arg0: any) => void;
  isCreatingAddress: boolean;
  setIsCreatingAddress: (arg0: boolean) => void;
  isEditingContract: boolean;
  setIsEditingContract: (arg0: boolean) => void;
  selectedQueryId: number;
  setSelectedQueryId: (arg0: number) => void;
  reset: () => void;
};

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined); //TODO

export const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isShowContracts, setIsShowContracts] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(0);
  const [selectedQueryId, setSelectedQueryId] = useState(0);
  const [types, setTypes] = useState([]);
  const [isCreatingAddress, setIsCreatingAddress] = useState(false);
  const [isEditingContract, setIsEditingContract] = useState(false);
  const { user } = useUser();
  const reset = () => {
    setSelectedAddressId(0);
    setSelectedQueryId(0);
    setIsEditingContract(false);
    setIsCreatingAddress(false);
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
    return SubscriptionsService.getSubscriptions()
      .then((res) => {
        console.log(res);
        return res;
      })
      .then((res) => res.data.subscriptions.sort(compare))
      .then((array) =>
        array.map((i: object) => {
          const label = getRandomTitle();
          const description = getDescriptionForTitle(label);
          return {
            ...i,
            tags: getRandomTags(),
            type: "smartcontract",
            description,
            label,
          };
        }),
      );
  };

  const addresses = useQuery(["subscriptions"], getSubscriptions, {
    ...queryCacheProps,
    onError: (error) => {
      toast(error.message, "error");
    },
    enabled: !!user,
  });

  const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;
  // const getQueries = () =>
  //   http({
  //     method: "GET",
  //     url: `${API}/queries/list`,
  //   }).then((res) => {
  //     console.log(res.data);
  //     return res.data;
  //   });

  const queries = undefined;
  // const queries = useQuery(["queries"], getQueries, {
  //   ...queryCacheProps,
  //   onError: (error) => {
  //     toast(error.message, "error");
  //   },
  //   enabled: !!user,
  // });

  const value = {
    addresses,
    queries,
    isShowContracts,
    setIsShowContracts,
    filter,
    setFilter,
    selectedAddressId,
    setSelectedAddressId,
    types,
    setTypes,
    isCreatingAddress,
    setIsCreatingAddress,
    isEditingContract,
    setIsEditingContract,
    selectedQueryId,
    setSelectedQueryId,
    reset,
  };

  return <AnalyticsContext.Provider value={value}>{children}</AnalyticsContext.Provider>;
};

const useAnalytics = () => {
  const context = useContext(AnalyticsContext);

  if (context === undefined) {
    throw new Error("useAnalytics must be used within AnalyticsContext");
  }

  return context;
};

export default useAnalytics;
