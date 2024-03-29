import { useQuery } from "react-query";
import { queryCacheProps } from "./hookCommon";
import { useToast } from ".";
import axios from "axios";

const usePresignedURL = ({
  url,
  headers,
  cacheType,
  id,
  requestNewURLCallback,
  isEnabled,
  hideToastOn404,
  retryCallbackFn,
}: {
  url: string;
  headers?: any;
  cacheType: any;
  id: string;
  requestNewURLCallback: any;
  isEnabled: boolean;
  hideToastOn404?: boolean;
  retryCallbackFn?: any;
}) => {
  const toast = useToast();

  interface RequestParameters {
    url?: string;
    headers?: any;
    method?: string;
  }

  const getFromPresignedURL = async () => {
    const requestParameters: RequestParameters = {
      url: url,
      // You can uncomment this to use mockupsLibrary in development
      // url: `https://example.com/s3`,
      headers: {},
      method: "GET",
    };

    if (headers) {
      Object.keys(headers).map((key) => {
        requestParameters["headers" as keyof typeof requestParameters][key] = headers[key];
      });
    }

    const response = await axios(requestParameters);
    return response.data;
  };

  const { data, isLoading, error, failureCount, isFetching } = useQuery(
    ["presignedURL", cacheType, id, url],
    getFromPresignedURL,
    {
      ...queryCacheProps,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      staleTime: Infinity,
      enabled: isEnabled && url ? true : false,
      keepPreviousData: false,
      retry: (attempts, e: any) => {
        if (retryCallbackFn) return retryCallbackFn(attempts, e?.response?.status);
        else {
          return queryCacheProps.retry(attempts, e?.response?.status);
        }
      },
      onError: (e) => {
        if (e?.response?.data?.includes("Request has expired") || e?.response?.status === 403) {
          requestNewURLCallback();
        } else {
          !hideToastOn404 && e?.response?.status !== 304 && toast(error, "error");
        }
      },
    },
  );

  return {
    data,
    isLoading,
    error,
    failureCount,
    isFetching,
  };
};

export default usePresignedURL;
