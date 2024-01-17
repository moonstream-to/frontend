import {
  Flex,
  Menu,
  MenuButton,
  MenuGroup,
  MenuItem,
  MenuList,
  Spinner,
  Text,
  Spacer,
} from "@chakra-ui/react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useEffect } from "react";
import { chains } from "../../contexts/Web3Context";
import Web3 from "web3";

import { RxDotsHorizontal } from "react-icons/rx";
import http from "../../utils/httpMoonstream";
import { useQuery } from "react-query";
import useRecentAddresses from "../../hooks/useRecentAddresses";

const JSONEdit = dynamic(() => import("../JSONEdit2"), { ssr: false });

const web3 = new Web3();

const ABIViwLeftPanel = ({
  abi,
  setAbi,
  src,
  setSrc,
}: {
  abi: any;
  setAbi: any;
  src: string;
  setSrc: (arg0: string) => void;
}) => {
  const { recentAddresses, addRecentAddress } = useRecentAddresses("ABIExplorer");

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
    } else {
      return new Promise((_, reject) => {
        reject(new Error("ABI not found"));
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
    retry: false,
    onSuccess: () => {
      const name = web3.utils.isAddress(src)
        ? src.slice(0, 8) + "..." + src.slice(-6)
        : src.split("/").slice(-1)[0];
      addRecentAddress(src, { src, name });
    },
  });

  useEffect(() => {
    if (src) {
      getABIQuery.refetch();
    }
  }, [src, getABIQuery.refetch]);

  return (
    <Flex
      bg="#1b1d22"
      w="100%"
      minH="100%"
      direction="column"
      overflowY="auto"
      p="0px"
      flex="1"
      id={"leftPanel"}
    >
      <Flex
        width="100%"
        h="40px"
        minH="40px"
        bg="#1b1d22"
        alignItems="center"
        justifyContent="space-between"
        px="20px"
      >
        <Spacer />
        {getABIQuery.isFetching && <Spinner h="15px" w="15px" />}
        <Menu>
          <MenuButton
            _hover={{ bg: "transparent" }}
            _active={{ bg: "transparent" }}
            _focus={{ bg: "transparent" }}
          >
            <RxDotsHorizontal />
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
          </MenuList>
        </Menu>
      </Flex>
      <Flex width="100%" h="3px" bg="transparent" />

      <JSONEdit
        json={abi}
        onChange={(value) => {
          setAbi(value);
        }}
        style={{
          backgroundColor: "#1b1d22",
          fontSize: "14px",
          borderRight: "1px solid #777",
        }}
        height="100%"
      />
    </Flex>
  );
};

export default ABIViwLeftPanel;
