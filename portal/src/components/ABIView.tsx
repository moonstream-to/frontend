import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Icon,
  Spacer,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import dynamic from "next/dynamic";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineClose, AiOutlineSave } from "react-icons/ai";
import { RxDotsHorizontal } from "react-icons/rx";
import { useQuery } from "react-query";
import Web3 from "web3";
import Web3Provider, { chains } from "../contexts/Web3Context";
import Web3Context from "../contexts/Web3Context/context";
import chainByChainId from "../contexts/Web3Context/";
import useRecentAddresses from "../hooks/useRecentAddresses";
import http from "../utils/httpMoonstream";
import CallABIFunction from "./abiView/CallABIFunction";
const dropperAbi = require("../web3/abi/DropperV2.json");

const JSONEdit = dynamic(() => import("./JSONEdit2"), { ssr: false });

const ABIView = () => {
  const [abi, setAbi] = useState("");
  const [abiObject, setAbiObject] = useState([]);
  const [filter, setFilter] = useState("function");
  const [search, setSearch] = useState("");
  const [savedSearch, setSavedSearch] = useState("");
  const [loadingMessage, setLoadingMessage] = useState("");
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [recentTransactionsChain, setRecentTransactionsChain] = useState("");
  const [loadedFromTx, setLoadedFromTx] = useState("");

  const [src, setSrc] = useState(
    "",
    // "0x8d528e98A69FE27b11bb02Ac264516c4818C3942",
    //  "https://raw.githubusercontent.com/moonstream-to/web3/main/abi/Dropper/v0.2.0/DropperFacet.json",
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  // const web3 = new Web3();
  const web3ctx = useContext(Web3Context);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [fnToCall, setFnToCall] = useState<{
    name: string;
    inputs: any[];
    stateMutability: string;
  } | null>(null);
  const web3 = web3ctx.web3;

  const colorScheme = {
    name: "#a188cc",
    param: "#fab56b",
    type: "#97e1f1",
  };

  const { recentAddresses, addRecentAddress } = useRecentAddresses("ABIExplorer");

  useEffect(() => {
    scrollRef?.current?.scrollIntoView();
  }, []);

  useEffect(() => {
    try {
      if (abi) {
        const newAbiObject = JSON.parse(abi).map((item: { type: string }) =>
          item.type === "constructor" ? { ...item, name: "constructor" } : { ...item },
        );
        setAbiObject(newAbiObject.filter((item: { name: string; type: string }) => item.name));
      }
    } catch {
      setAbiObject([]);
    }
  }, [abi]);

  const stateMutabilities = useMemo(
    () =>
      abiObject.reduce(
        (acc: string[], item: { stateMutability: string }) =>
          item.stateMutability && !acc.includes(item.stateMutability)
            ? acc.concat(item.stateMutability)
            : acc,
        [],
      ),
    [abiObject],
  );

  const types = useMemo(
    () =>
      abiObject.reduce(
        (acc: string[], item: { type: string }) =>
          item.type && !acc.includes(item.type) ? acc.concat(item.type) : acc,
        [],
      ),
    [abiObject],
  );

  const filterFunction = search
    ? (item: { name: string }) => item.name.toLowerCase().includes(search.toLowerCase())
    : stateMutabilities.includes(filter)
    ? (item: { stateMutability: string }) => item.stateMutability === filter
    : (item: { type: string }) => item.type === filter;

  const getFromUrl = (url: string) => {
    return axios.get(url).then((res) => {
      if (res.data) {
        try {
          setAbi(JSON.stringify(res.data, null, "\t"));
        } catch (e: any) {
          console.log(e);
          return new Promise((_, reject) => {
            reject(new Error("Not valid JSON"));
          });
        }
      }
      return res.data;
    });
  };

  const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

  const getFromAddress = async (address: string) => {
    console.log("address: ", address);
    const chain = await http({
      method: "GET",
      url: `${API}/subscriptions/is_contract?address=${address}`,
    })
      .then((res) => {
        let contractChain = Object.keys(res.data.contract_info)[0];
        if (contractChain === "xdai") contractChain = "gnosis";
        return contractChain;
      })
      .catch((e) => {
        console.log(e);
        return undefined;
      });
    console.log(address, chain);
    if (chain && chains[chain as keyof typeof chains]?.ABIScan?.url) {
      return axios({
        method: "GET",
        url: `${chains[chain as keyof typeof chains]?.ABIScan?.url}&address=${address}`,
      }).then((res) => {
        try {
          const json = JSON.stringify(JSON.parse(res.data?.result), null, "\t");
          setAbi(json);
        } catch (e: any) {
          return new Promise((_, reject) => reject(new Error(e.message)));
        }
      });
    } else {
      return new Promise((_, reject) => {
        reject(new Error("ABI not found"));
      });
    }
  };

  const getABI = () => {
    setLoadedFromTx("");
    if (web3.utils.isAddress(src)) {
      return getFromAddress(src);
    } else {
      return getFromUrl(src);
    }
  };

  const getABIQuery = useQuery(["getABI", src], getABI, {
    enabled: false,
    retry: false,
    onSuccess: () => {
      const name = web3.utils.isAddress(src)
        ? src.slice(0, 8) + "..." + src.slice(-6)
        : src.split("/").slice(-1)[0];
      addRecentAddress(src, { src, name });
    },
  });

  interface RequestParameters {
    url?: string;
    headers?: any;
    method?: string;
    mode?: string;
  }

  const getFromPresignedURL = async (url: string, requestTimestamp: string) => {
    let triesLeft = 5;
    const requestParameters: RequestParameters = {
      url: url,
      headers: {
        "If-Modified-Since": requestTimestamp,
      },
      method: "GET",
    };
    while (triesLeft) {
      triesLeft = triesLeft - 1;
      try {
        const response = await axios(requestParameters);
        return response; //TODO handle not 404 || 304 errors
      } catch (e) {
        console.log(e);
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
    // return new Promise((_, reject) => reject(new Error("interrupted by user")));
  };

  const { account, chainId } = useContext(Web3Context);

  const getTransactions = async ({ queryKey }: { queryKey: any[] }) => {
    const [_, account] = queryKey;
    const end_timestamp = String(Math.floor(Date.now() / 1000));
    const date = new Date(Date.now());
    let newMonth = date.getUTCMonth() - 1;
    if (newMonth === -1) {
      newMonth = 11;
    }
    date.setMonth(newMonth);
    const start_timestamp = String(Math.floor(date.getTime() / 1000));
    const paramsObj = {
      start_timestamp,
      end_timestamp,
      // user_address: "0x99F1117F13e072b299942037E6A5d1469912B47A",
      user_address: account,
    };
    const requestTimestamp = new Date().toUTCString();
    const chainName = Object.values(chains).find((chain) => chain.chainId === chainId)?.name ?? "";
    // https://api.moonstream.to/queries/template_contract_addresses_deployment/update_data
    console.log("to call presURL");
    const presignedUrl = await http({
      method: "POST",
      url: `${API}/queries/template_address_transactions/update_data`,
      data: {
        blockchain: chainName,
        params: { ...paramsObj },
      },
    })
      .then(async (res: any) => {
        return res.data;
      })
      .catch((e: Error) => {
        // toast(e.message, "error");
      });

    if (presignedUrl?.url) {
      try {
        const addresses = await getFromPresignedURL(presignedUrl.url, requestTimestamp).then(
          (res: any) => {
            const txs = res.data?.data?.filter((tx: any) => tx.to_address);
            const addresses = txs.map((tx: any) => tx.to_address);
            const addressesSet = new Set(addresses);
            setRecentTransactions([...addressesSet]);
            setRecentTransactionsChain(chainName);
            return [...addressesSet, "0x8d528e98A69FE27b11bb02Ac264516c4818C3942"];
          },
        );
        let idx = 0;
        while (idx < addresses.length && abi.length === 0) {
          try {
            const res = await getFromAddress(addresses[idx] as string);
            setLoadedFromTx(addresses[idx] as string);
            idx = addresses.length;
          } catch (e) {
            await new Promise((r) => setTimeout(r, 3000));
          }
          idx += 1;
        }
      } catch (e: any) {
        console.log(e);
      }
    } else {
      console.log("error");
    }
  };

  const abiFromTransactionsQuery = useQuery(
    ["deployedContracts", "0x99F1117F13e072b299942037E6A5d1469912B47A"],
    getTransactions,
    {
      onSuccess: (data: any) => {
        console.log(data);
      },
      onError: (e: any) => {
        console.log(e);
      },
      retry: false,
      // enabled: false,
    },
  );
  const getType = (token: any) => {
    if (token.type != "tuple") return <span style={{ color: "#97e1f1" }}>{token.type}</span>;

    return (
      <>
        {"{"}
        <Inputs inputs={token.components} />
        {"}"}
      </>
    );
  };

  const Inputs = ({ inputs }: { inputs: { name: string; type: string }[] }) => {
    return (
      <>
        {inputs.map((input, idx) => (
          <React.Fragment key={idx}>
            <span style={{ color: colorScheme.param }}>{input.name}</span>
            {input.name && ":"}
            {input.name && <span>&nbsp;</span>}
            {getType(input)}
            {idx + 1 < inputs.length && ",  "}
          </React.Fragment>
        ))}
      </>
    );
  };

  const Outputs = ({ outputs }: { outputs: { name: string; type: string }[] }) => {
    if (outputs.length === 0) {
      return <span style={{ color: colorScheme.type }}>void</span>;
    }

    return (
      <>
        {outputs.length > 1 && "["}
        {outputs.map((output, idx) => (
          <React.Fragment key={idx}>
            <span style={{ color: colorScheme.param }}>{output.name}</span>
            {output.name && ":"}
            {output.name && <span>&nbsp;</span>}

            {getType(output)}
            {idx + 1 < outputs.length && ",  "}
          </React.Fragment>
        ))}
        {outputs.length > 1 && "]"}
      </>
    );
  };

  useEffect(() => {
    if (src) {
      getABIQuery.refetch();
    }
  }, [src, getABIQuery.refetch]);

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 46 || e.keyCode === 8) {
      setSrc("");
    }
  };

  const handlePaste = (e: any) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text");
    if (pastedText) {
      setSrc(pastedText);
    }
  };

  const handleItemClick = async (name: string, inputs: any[], stateMutability: string) => {
    setFnToCall({ name, inputs, stateMutability });
    onOpen();
  };

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
      <CallABIFunction
        isOpen={isOpen}
        onClose={onClose}
        name={fnToCall?.name}
        inputs={fnToCall?.inputs}
        abi={abiObject}
        stateMutability={fnToCall?.stateMutability ?? ""}
      />
      <Flex bg="#262626" w="100%" minH="100%" direction="column" overflowY="auto" p="0px" flex="1">
        <Flex
          width="100%"
          h="40px"
          minH="40px"
          bg="#262626"
          alignItems="center"
          justifyContent="space-between"
          px="20px"
        >
          <Text fontWeight="400" fontSize="16px">
            ABI Explorer
          </Text>
          {getABIQuery.isFetching && <Spinner h="15px" w="15px" />}
          <Menu>
            <MenuButton
              _hover={{ bg: "transparent" }}
              _active={{ bg: "transparent" }}
              _focus={{ bg: "transparent" }}
            >
              {/* <Button variant="transparent" _hover={{ bg: "transparent" }}> */}
              <RxDotsHorizontal />
              {/* </Button> */}
            </MenuButton>
            <MenuList zIndex="7">
              <MenuGroup title="Recent" color="#CCCCCC">
                {recentAddresses.map((recent, idx) => (
                  <MenuItem
                    color="#AAAAAA"
                    key={idx}
                    title={recent.src}
                    onClick={() => setSrc(recent.src)}
                  >
                    <Text>{recent.name}</Text>
                  </MenuItem>
                ))}
              </MenuGroup>
              <MenuGroup color="#CCCCCC" title={`Recent txs on ${recentTransactionsChain}`}>
                {recentTransactions.map((tx, idx) => (
                  <MenuItem color="#AAAAAA" key={idx} title={tx} onClick={() => setSrc(tx)}>
                    <Text>{tx.slice(0, 6) + "..." + tx.slice(-4)}</Text>
                  </MenuItem>
                ))}
              </MenuGroup>
            </MenuList>
          </Menu>
        </Flex>

        <Flex
          w="100"
          minH="40px"
          bg="#282a36"
          boxShadow="0px 2px 2px black"
          alignItems="center"
          justifyContent="space-between"
        >
          {getABIQuery.isError && (
            <Text pl="20px" color="error.500">
              {getABIQuery.error?.message}
            </Text>
          )}
          {abiFromTransactionsQuery.isLoading && (
            <Text ml="40px" placeSelf="center" color="#BBBBBB">
              searching...
            </Text>
          )}
          {loadedFromTx && (
            <Text ml="40px" placeSelf="center" color="#BBBBBB">
              {loadedFromTx}
            </Text>
          )}

          <Spacer />
          <Icon as={AiOutlineSave} mr="33px" />
        </Flex>
        <Flex width="100%" h="3px" bg="transparent" />

        <JSONEdit
          json={abi}
          onChange={(value) => {
            setAbi(value);
          }}
          style={{
            backgroundColor: "#262626",
            fontSize: "14px",
          }}
          height="100%"
        />
      </Flex>
      <Flex bg="#282a36" w="100%" minH="100%" direction="column" overflowY="auto" flex="2">
        <Flex
          gap="0px"
          alignItems="center"
          h="40px"
          bg="#191a21"
          boxShadow="0px 2px 2px black"
          fontWeight="700"
          userSelect="none"
        >
          {types.concat(stateMutabilities).map((type, idx) => (
            <Flex
              key={idx}
              px="20px"
              onClick={() => {
                setFilter(type);
                if (search) {
                  setSavedSearch(search);
                  setSearch("");
                }
              }}
              color={filter === type && !search ? "white" : "#7b7f8b"}
              bg={filter === type && !search ? "#282a36" : "#262626"}
              h="100%"
              alignItems="center"
              cursor="pointer"
              borderRight="1px solid black"
              borderTop={filter === type && !search ? "1px solid #ff54a2" : "none"}
            >
              {type}
            </Flex>
          ))}
          {abiObject.length > 0 && (
            <Flex
              alignItems={"center"}
              h="100%"
              bg={search ? "#282a36" : "#262626"}
              cursor="default"
            >
              <Text
                pl="60px"
                pr="10px"
                bg={search ? "#282a36" : "#262626"}
                color={search ? "white" : "#7b7f8b"}
                onClick={() => {
                  setSearch(savedSearch);
                  searchRef.current?.focus();
                }}
                cursor="pointer"
              >
                Search
              </Text>
            </Flex>
          )}
          {abiObject.length > 0 && (
            <InputGroup>
              <Input
                border="none"
                borderBottom="1px solid #777777"
                borderRadius="0"
                ref={searchRef}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setSavedSearch(e.target.value);
                }}
                _focus={{ border: "none", borderBottom: "1px solid #777777" }}
                _active={{ border: "none", borderBottom: "1px solid #777777" }}
                _focusVisible={{ border: "none", borderBottom: "1px solid #777777" }}
                spellCheck="false"
              />
              <InputRightElement>
                <AiOutlineClose
                  cursor="pointer"
                  color="#BBBBBB"
                  onClick={() => {
                    setSavedSearch("");
                    setSearch("");
                  }}
                />
              </InputRightElement>
            </InputGroup>
          )}
        </Flex>
        <Flex
          pl="20px"
          w="100"
          h="40px"
          minH="40px"
          alignItems="center"
          bg="#282a36"
          boxShadow="0px 2px 2px black"
        >
          <Input
            placeholder="paste url or contract address"
            defaultValue={src}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            border="none"
            _focus={{ border: "none" }}
            _active={{ border: "none" }}
            _focusVisible={{ border: "none" }}
            _placeholder={{ color: "#7b7f8b" }}
            minW="100%"
            w="100%"
            spellCheck="false"
            color={getABIQuery.isError ? "error.500" : "#7b7f8b"}
          />
        </Flex>
        {abiObject && (
          <Flex
            direction="column"
            pl="40px"
            py="10px"
            overflowY="auto"
            fontFamily="Cascadia code, sans-serif"
          >
            {abiObject.filter(filterFunction).map(
              (
                item: {
                  type: string;
                  stateMutability: string;
                  name: string;
                  inputs: any[];
                  outputs: any[];
                },
                idx,
              ) => (
                <Text
                  key={idx}
                  mt="5px"
                  border="0px solid white"
                  textIndent="-20px"
                  ml="20px"
                  pr="20px"
                  onClick={() => handleItemClick(item.name, item.inputs, item.stateMutability)}
                  w="fit-content"
                  cursor={item.type === "function" ? "pointer" : "default"}
                >
                  <span style={{ color: colorScheme.name }}>{item.name}</span>
                  {":  ("}
                  <Inputs inputs={item.inputs} />
                  {item.outputs ? ") => " : ")"}
                  {item.outputs && <Outputs outputs={item.outputs} />}
                </Text>
              ),
            )}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default ABIView;
