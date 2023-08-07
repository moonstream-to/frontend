import { SearchIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Text,
} from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Web3Context from "../../contexts/Web3Context/context";
import useMoonToast from "../../hooks/useMoonToast";
// import http from "../../utils/http";
import http from "../../utils/httpMoonstream";

const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

const DropperV2ClaimsView = ({ address }: { address: string }) => {
  const [searchAddress, setSearchAddress] = useState("");

  const getContracts = () => {
    return http({
      method: "GET",
      url: `https://engineapi.moonstream.to/metatx/contracts`,
      // params: {
      //   blockchain: "80001",
      //   address: "0x6FF32C81600Ec625c68b0D687ba3C2681eD43867",
      //   contract_type: "dropper-v0.2.0",
      //   offset: 0,
      //   limit: 10,
      // },
    }).then((res) => res.data);
  };

  const [searchResult, setSearchResult] = useState<{
    result?: string | undefined;
    isSearching: boolean;
  }>({ isSearching: false });

  type responseWithDetails = {
    response: { data: { detail: string } };
    message: string;
  };

  const searchForAddress = async (searchAddress: string) => {
    setSearchResult((prev) => {
      return { ...prev, isSearching: true };
    });

    http({
      method: "GET",
      url: `https://engineapi.moonstream.to/metatx/requests`,
      params: { contract_address: address, caller: searchAddress },
    })
      .then((res: { data: { address: string; raw_amount: string } }) => {
        console.log("qq", res.data);
        if (!res.data?.address) {
          throw new Error("Not found");
        }
        setSearchResult({ result: `Amount: ${res.data.raw_amount}`, isSearching: false });
      })
      .catch((e: responseWithDetails) => {
        const result =
          e.response?.data?.detail === "Address not present in that drop."
            ? "Not found"
            : e.message;
        setSearchResult({ result, isSearching: false });
      });
  };
  const toast = useMoonToast();

  const web3ctx = useContext(Web3Context);
  const handleSearchClick = () => {
    if (web3ctx.web3.utils.isAddress(searchAddress)) {
      searchForAddress(searchAddress);
      // onOpen();
    } else {
      toast("invalid address", "error");
    }
  };

  const contractsQuery = useQuery(["metatxContracts"], getContracts, {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (e) => {
      console.log(e);
    },
  });

  const registerContract = () => {
    return http({
      method: "POST",
      url: "https://engineapi.moonstream.to/metatx/contracts",
      data: {
        blockchain: "mumbai",
        address: "0x6FF32C81600Ec625c68b0D687ba3C2681eD43869",
        contract_type: "dropper-v0.2.0",
        title: "Test",
      },
    });
  };

  const addContract = useMutation(registerContract, {
    onSuccess: () => {
      contractsQuery.refetch();
    },
  });

  const createRequests = () => {
    const parameters = {
      dropId: 1,
      requestID: 1,
      blockDeadline: "12312312312312313",
      amount: 5,
      signer: "0x9ed191DB1829371F116Deb9748c26B49467a592A",
      signature:
        "c4dc06dd59a1c4d315cfd449a5ba8a7cf52895608227674ef83703bc1a31369747c85d20b158ce53f58642e15551a8f9d3a435cdbfa68a51b0a3f3e43d6d26bb1c",
    };
    console.log(parameters);
    return http({
      method: "POST",
      url: "https://engineapi.moonstream.to/metatx/requests",
      data: {
        contract_address: address,
        ttl_days: 1,
        specifications: [
          { caller: "0x605825459E3e98565827Af31DF4cA854A7cCED28", method: "claim", parameters },
        ],
      },
    });
  };

  const addClaimant = useMutation(createRequests, {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  if (!contractsQuery.data) {
    return <></>;
  }

  return (
    <Flex direction="column" gap="10px" p={5} borderRadius="10px" bg="#232323" mt="20px">
      {!contractsQuery.data.some(
        (contract: { address: string }) => contract.address === address,
      ) ? (
        <Flex gap="20px">
          <Text>Contract is not registered</Text>
          <Button variant="whiteOutline" onClick={() => addContract.mutate()}>
            Add contract
          </Button>
        </Flex>
      ) : (
        <Flex direction="column" gap="20px">
          <Text>Contract is registered</Text>
          <Flex justifyContent="start" alignItems="center">
            <Input
              value={searchAddress}
              onChange={(e) => setSearchAddress(e.target.value)}
              placeholder="search for address"
              borderRadius="10px"
              p="8px 15px"
            />

            <IconButton
              icon={<SmallCloseIcon />}
              _hover={{ color: "#ffccd4" }}
              bg="transparent"
              aria-label="clean"
              onClick={() => setSearchAddress("")}
              m="0"
              minW="20px"
              pl="10px"
            />
            <IconButton
              _hover={{ color: "#ffccd4" }}
              bg="transparent"
              aria-label="search"
              icon={<SearchIcon />}
              minW="20px"
              onClick={() => handleSearchClick()}
              pl="10px"
            />
          </Flex>
          <Button onClick={() => addClaimant.mutate()}>Add</Button>
        </Flex>
      )}
    </Flex>
  );
};

export default DropperV2ClaimsView;
