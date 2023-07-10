import { createContext, useContext, useState } from "react";

import { useQuery } from "react-query";
import useUser from "../../contexts/UserContext";

import queryCacheProps from "../../hooks/hookCommon";
import useMoonToast from "../../hooks/useMoonToast";
import { SubscriptionsService } from "../../services";
import http from "../../utils/httpMoonstream";

type CrawlingStatus = {
  methodsNumber: number;
  methodsLoaded: number;
  eventsNumber: number;
  eventsLoaded: number;
  loaded: boolean;
};

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
  templates: any;
  jobs: any;
  statuses: Record<string, CrawlingStatus>;
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

  interface Status {
    type: "event" | "function";
    finished: boolean;
  }

  const [statuses, setStatuses] = useState<Record<string, CrawlingStatus>>({});
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

  const addresses = useQuery(["subscriptions"], getSubscriptions, {
    ...queryCacheProps,
    onError: (error) => {
      toast(error.message, "error");
    },
    enabled: !!user,
  });

  const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const jobs = useQuery(
    ["jobs", addresses.data],
    async () => {
      addresses.data
        .filter((address: any) => address.type !== "eoa")
        .forEach(async (address: any, index: number) => {
          await delay(index * 1000);
          const res = await http({
            method: "GET",
            url: `${API}/subscriptions/${address.id}/jobs`,
          });
          const jobsList = res.data.map((job: any) => {
            return {
              type: job.tags.includes("type:event") ? "event" : "function",
              finished:
                job.tags.includes("historical_crawl_status:finished") ||
                !job.tags.some((t: string) => t.includes("historical_crawl_status")),
            };
          });
          const status: CrawlingStatus = {
            loaded: !jobsList.some((s: Status) => !s.finished),
            eventsNumber: jobsList.filter((s: Status) => s.type === "event").length,
            eventsLoaded: jobsList.filter((s: Status) => s.type === "event" && s.finished).length,
            methodsNumber: jobsList.filter((s: Status) => s.type === "function").length,
            methodsLoaded: jobsList.filter((s: Status) => s.type === "function" && s.finished)
              .length,
          };
          setStatuses((prevState) => ({
            ...prevState,
            [address.id]: status,
          }));
        });
    },
    {
      enabled: !!addresses.data,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  );

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
    types,
    setTypes,
    isCreatingAddress,
    setIsCreatingAddress,
    isEditingContract,
    setIsEditingContract,
    selectedQueryId,
    setSelectedQueryId,
    reset,
    templates,
    jobs,
    statuses,
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
