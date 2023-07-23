import {
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightAddon,
  InputRightElement,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Spinner,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { RxDotsHorizontal } from "react-icons/rx";
import { useQuery } from "react-query";
import Web3 from "web3";
import { chains } from "../contexts/Web3Context";
import useRecentAddresses from "../hooks/useRecentAddresses";
import http from "../utils/httpMoonstream";

const JSONEdit = dynamic(() => import("./JSONEdit2"), { ssr: false });

const ABIView = () => {
  const [abi, setAbi] = useState("");
  const [abiObject, setAbiObject] = useState([]);
  const [filter, setFilter] = useState("function");
  const [search, setSearch] = useState("");
  const [savedSearch, setSavedSearch] = useState("");
  const [src, setSrc] = useState(
    "",
    // "0x8d528e98A69FE27b11bb02Ac264516c4818C3942",
    //  "https://raw.githubusercontent.com/moonstream-to/web3/main/abi/Dropper/v0.2.0/DropperFacet.json",
  );

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);
  const web3 = new Web3();

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
    axios.get(url).then((res) => {
      if (res.data) {
        try {
          setAbi(JSON.stringify(res.data, null, "\t"));
        } catch (e) {
          console.log(e);
        }
      }
      return res.data;
    });
  };

  const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

  const getFromAddress = async (address: string) => {
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
    }
  };

  const getABI = () => {
    if (web3.utils.isAddress(src)) {
      return getFromAddress(src);
    } else {
      return getFromUrl(src);
    }
  };

  const getABIQuery = useQuery(["getABI", src], getABI, {
    enabled: false,
    onSuccess: () => {
      const name = web3.utils.isAddress(src)
        ? src.slice(0, 8) + "..." + src.slice(-6)
        : src.split("/").slice(-1)[0];
      addRecentAddress(src, { src, name });
    },
  });

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
          <>
            <span style={{ color: colorScheme.param }}>{input.name}</span>
            {input.name && ":"}
            {input.name && <span>&nbsp;</span>}
            {getType(input)}
            {idx + 1 < inputs.length && ",  "}
          </>
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
          <>
            <span style={{ color: colorScheme.param }}>{output.name}</span>
            {output.name && ":"}
            {output.name && <span>&nbsp;</span>}

            {getType(output)}
            {idx + 1 < outputs.length && ",  "}
          </>
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

  return (
    <Flex
      gap="0px"
      mt="30px"
      px={{ base: 0, xl: "5%", "2xl": "10%" }}
      minH="calc(100vh - 20px)"
      maxH="calc(100vh - 20px)"
      minW="90%"
      position="relative"
      alignSelf="stretch"
      ref={scrollRef}
    >
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
              <Button variant="transparent" _hover={{ bg: "transparent" }}>
                <RxDotsHorizontal />
              </Button>
            </MenuButton>
            <MenuList zIndex="7">
              <MenuGroup title="Recent">
                {recentAddresses.map((recent, idx) => (
                  <MenuItem key={idx} title={recent.src} onClick={() => setSrc(recent.src)}>
                    <Text>{recent.name}</Text>
                  </MenuItem>
                ))}
              </MenuGroup>
            </MenuList>
          </Menu>
        </Flex>

        <Flex w="100" minH="40px" bg="#282a36" boxShadow="0px 2px 2px black" position="relative">
          {" "}
          <Input
            placeholder="url or contract address"
            value={src}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            border="none"
            _focus={{ border: "none" }}
            _active={{ border: "none" }}
            _focusVisible={{ border: "none" }}
            minW="90vw"
            w="90vw"
          />
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
              // borderTop={search ? "1px solid #ff54a2" : "none"}
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
          <Text color="#7b7f8b" fontSize="16px">
            {src}
          </Text>
        </Flex>
        {abiObject && (
          <Flex
            direction="column"
            pl="40px"
            py="10px"
            overflowY="auto"
            fontFamily="Cascadia code, sans-serif"
          >
            {abiObject
              .filter(filterFunction)
              .map((item: { name: string; inputs: any[]; outputs: any[] }, idx) => (
                <Text
                  key={idx}
                  mt="5px"
                  border="0px solid white"
                  textIndent="-20px"
                  ml="20px"
                  pr="20px"
                >
                  <span style={{ color: colorScheme.name }}>{item.name}</span>
                  {":  ("}
                  <Inputs inputs={item.inputs} />
                  {item.outputs ? ") => " : ")"}
                  {item.outputs && <Outputs outputs={item.outputs} />}
                </Text>
              ))}
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default ABIView;
