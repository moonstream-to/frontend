import { Flex } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import ABIViwLeftPanel from "./abiView/ABIViewLeftPanel";
import ABIViewRightPanel from "./abiView/ABIViewRightPanel";

const ABIView = () => {
  const [abi, setAbi] = useState("");
  const [abiObject, setAbiObject] = useState([]);

  // const [loadingMessage, setLoadingMessage] = useState("");
  // const [recentTransactions, setRecentTransactions] = useState([]);
  // const [recentTransactionsChain, setRecentTransactionsChain] = useState("");
  // const [loadedFromTx, setLoadedFromTx] = useState("");

  const [src, setSrc] = useState("");

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView();
  }, []);

  useEffect(() => {
    try {
      const newAbiObject = JSON.parse(abi).map((item: { type: string }) =>
        item.type === "constructor" ? { ...item, name: "constructor" } : { ...item },
      );
      setAbiObject(newAbiObject.filter((item: { name: string; type: string }) => item.name));
    } catch {
      setAbiObject([]);
    }
  }, [abi]);

  useEffect(() => {
    setAbi("");
  }, [src]);

  // interface RequestParameters {
  //   url?: string;
  //   headers?: any;
  //   method?: string;
  //   mode?: string;
  // }

  // const getFromPresignedURL = async (url: string, requestTimestamp: string) => {
  //   let triesLeft = 5;
  //   const requestParameters: RequestParameters = {
  //     url: url,
  //     headers: {
  //       "If-Modified-Since": requestTimestamp,
  //     },
  //     method: "GET",
  //   };
  //   while (triesLeft) {
  //     triesLeft = triesLeft - 1;
  //     try {
  //       const response = await axios(requestParameters);
  //       return response; //TODO handle not 404 || 304 errors
  //     } catch (e) {
  //       console.log(e);
  //       await new Promise((r) => setTimeout(r, 3000));
  //     }
  //   }
  //   // return new Promise((_, reject) => reject(new Error("interrupted by user")));
  // };

  // const { account, chainId } = useContext(Web3Context);

  // const getTransactions = async ({ queryKey }: { queryKey: any[] }) => {
  //   const [_, account] = queryKey;
  //   const end_timestamp = String(Math.floor(Date.now() / 1000));
  //   const date = new Date(Date.now());
  //   let newMonth = date.getUTCMonth() - 1;
  //   if (newMonth === -1) {
  //     newMonth = 11;
  //   }
  //   date.setMonth(newMonth);
  //   const start_timestamp = String(Math.floor(date.getTime() / 1000));
  //   const paramsObj = {
  //     start_timestamp,
  //     end_timestamp,
  //     // user_address: "0x99F1117F13e072b299942037E6A5d1469912B47A",
  //     user_address: account,
  //   };
  //   const requestTimestamp = new Date().toUTCString();
  //   const chainName = Object.values(chains).find((chain) => chain.chainId === chainId)?.name ?? "";
  //   // https://api.moonstream.to/queries/template_contract_addresses_deployment/update_data
  //   console.log("to call presURL");
  //   const presignedUrl = await http({
  //     method: "POST",
  //     url: `${API}/queries/template_address_transactions/update_data`,
  //     data: {
  //       blockchain: chainName,
  //       params: { ...paramsObj },
  //     },
  //   })
  //     .then(async (res: any) => {
  //       return res.data;
  //     })
  //     .catch((e: Error) => {
  //       // toast(e.message, "error");
  //     });

  //   if (presignedUrl?.url) {
  //     try {
  //       const addresses = await getFromPresignedURL(presignedUrl.url, requestTimestamp).then(
  //         (res: any) => {
  //           const txs = res.data?.data?.filter((tx: any) => tx.to_address);
  //           const addresses = txs.map((tx: any) => tx.to_address);
  //           const addressesSet = new Set(addresses);
  //           setRecentTransactions([...addressesSet]);
  //           setRecentTransactionsChain(chainName);
  //           return [...addressesSet, "0x8d528e98A69FE27b11bb02Ac264516c4818C3942"];
  //         },
  //       );
  //       let idx = 0;
  //       while (idx < addresses.length && abi.length === 0) {
  //         try {
  //           const res = await getFromAddress(addresses[idx] as string);
  //           setLoadedFromTx(addresses[idx] as string);
  //           idx = addresses.length;
  //         } catch (e) {
  //           await new Promise((r) => setTimeout(r, 3000));
  //         }
  //         idx += 1;
  //       }
  //     } catch (e: any) {
  //       console.log(e);
  //     }
  //   } else {
  //     console.log("error");
  //   }
  // };

  // const abiFromTransactionsQuery = useQuery(
  //   ["deployedContracts", "0x99F1117F13e072b299942037E6A5d1469912B47A"],
  //   getTransactions,
  //   {
  //     onSuccess: (data: any) => {
  //       console.log(data);
  //     },
  //     onError: (e: any) => {
  //       console.log(e);
  //     },
  //     retry: false,
  //     // enabled: false,
  //   },
  // );

  return (
    <Flex
      gap="0px"
      mt="30px"
      px="0"
      minH="calc(100vh - 20px)"
      maxH="calc(100vh - 20px)"
      minW="100vw"
      position="relative"
      alignSelf="stretch"
      ref={scrollRef}
    >
      <ABIViwLeftPanel abi={abi} setAbi={setAbi} src={src} setSrc={setSrc} />
      <ABIViewRightPanel src={src} setSrc={setSrc} abiObject={abiObject} />
    </Flex>
  );
};

export default ABIView;
