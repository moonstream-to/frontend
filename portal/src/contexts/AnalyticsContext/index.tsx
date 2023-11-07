import { createContext, useContext, useState } from "react";

import { useQuery } from "react-query";
import useUser from "../../contexts/UserContext";

import queryCacheProps from "../../hooks/hookCommon";
import useMoonToast from "../../hooks/useMoonToast";
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
  blockchains: any;
  isCreatingAddress: boolean;
  setIsCreatingAddress: (arg0: boolean) => void;
  isEditingContract: boolean;
  setIsEditingContract: (arg0: boolean) => void;
  selectedQueryId: number;
  setSelectedQueryId: (arg0: number) => void;
  reset: () => void;
  templates: any;
};

const AnalyticsContext = createContext<AnalyticsContextType | undefined>(undefined); //TODO

export const AnalyticsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isShowContracts, setIsShowContracts] = useState(false);
  const [filter, setFilter] = useState("");
  const [selectedAddressId, setSelectedAddressId] = useState(0);
  const [selectedQueryId, setSelectedQueryId] = useState(0);
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
        return res;
      })
      .then((res) => res.data.subscriptions.sort(compare))
      .then((array) =>
        array.map((i: any) => {
          const created_at = new Date(i.created_at);
          return {
            ...i,
            type: i.subscription_type_id !== "externaly_owned_account" ? "smartcontract" : "eoa",
            created_at: created_at.toLocaleDateString(),
            chainName: i.subscription_type_id.split("_").slice(0, -1).join("_"),
            displayName: getChainName(i.subscription_type_id.split("_").slice(0, -1).join("_")),
          };
        }),
      );
  };

  const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

  const templates = useQuery(
    ["queryTemplates"],
    () => {
      return http({
        method: "GET",
        url: `${API}/queries/templates`,
      }).then((res) => {
        return res.data.interfaces;
      });
    },
    {
      ...queryCacheProps,
      onError: (error: Error) => {
        console.log(error);
      },
    },
  );

  const getError = () => {
    return new Promise((_, reject) => {
      setTimeout(() => reject(new Error("mock error")), 3000);
    });
  };

  const addresses = useQuery(["subscriptions"], getSubscriptions, {
    ...queryCacheProps,
    retry: 2,
    onError: (error: any) => {
      toast(error.message, "error");
    },
    enabled: !!user,
  });

  const namesMap = {
    xdai: "Gnosis",
    zksync_era_testnet: "zkSync Era testnet",
    zksync_era: "zkSync Era",
  };

  const getChainName = (backName: string) => {
    if (namesMap[backName as keyof typeof namesMap]) {
      return namesMap[backName as keyof typeof namesMap];
    }
    return backName.slice(0, 1).toUpperCase() + backName.slice(1);
  };

  const getBlockchains = async () => {
    const response = await SubscriptionsService.getTypes();
    return response.data.subscription_types
      .filter((type: { blockchain: string }) => type.blockchain !== "Any")
      .map((type: any) => {
        return {
          name: type.blockchain,
          displayName: getChainName(type.blockchain),
          image: type.icon_url,
        };
      });
  };

  const blockchains = useQuery(["subscription_types"], getBlockchains, {
    ...queryCacheProps,
  });

  const queries = undefined;

  const value = {
    addresses,
    queries,
    isShowContracts,
    setIsShowContracts,
    filter,
    setFilter,
    selectedAddressId,
    setSelectedAddressId,
    blockchains,
    isCreatingAddress,
    setIsCreatingAddress,
    isEditingContract,
    setIsEditingContract,
    selectedQueryId,
    setSelectedQueryId,
    reset,
    templates,
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
