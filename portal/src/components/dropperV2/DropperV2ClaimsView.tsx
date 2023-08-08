import { SearchIcon, SmallCloseIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Grid,
  GridItem,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useMutation, useQuery } from "react-query";
import Web3Context from "../../contexts/Web3Context/context";
import useMoonToast from "../../hooks/useMoonToast";
// import http from "../../utils/http";
import http from "../../utils/httpMoonstream";

const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

const DropperV2ClaimsView = ({
  address,
  isContractRegistered,
}: {
  address: string;
  isContractRegistered: boolean;
}) => {
  const [searchAddress, setSearchAddress] = useState("");
  const [requestsFound, setRequestsFound] = useState([]);

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
      .then((res: any) => {
        console.log("qq", res.data);
        if (!res.data?.length) {
          throw new Error("Not found");
        }
        const amount = res.data.reduce((acc: number, req: any) => acc + req.parameters.amount, 0);
        setSearchResult({
          result: `${amount} token in ${res.data.length} request${
            res.data.length > 1 ? "s" : ""
          } found`,
          isSearching: false,
        });
        setRequestsFound(
          res.data.map((r: any) => {
            const expiresAtDate = new Date(r.expires_at);
            const expiresAt = `${expiresAtDate.toLocaleDateString()} ${expiresAtDate.toLocaleTimeString()}`;
            return {
              amount: r.parameters.amount,
              expiresAt,
              blockDeadline: r.parameters.blockDeadline,
            };
          }),
        );
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
    // console.log(parameters);
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

  if (!isContractRegistered) {
    return <></>;
  }

  return (
    <Flex direction="column" gap="20px" p={5} borderRadius="10px" bg="#232323" mt="20px">
      <Text variant="title3">Claimants</Text>
      <Flex justifyContent="start" alignItems="center">
        <Input
          value={searchAddress}
          onChange={(e) => {
            setSearchAddress(e.target.value);
            setSearchResult({ result: undefined, isSearching: searchResult.isSearching });
            setRequestsFound([]);
          }}
          placeholder="search for address"
          borderRadius="10px"
          p="8px 15px"
          spellCheck="false"
        />
        {searchResult.isSearching ? (
          <Spinner mx="18px" h="15px" w="15px" />
        ) : (
          <>
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
          </>
        )}
      </Flex>
      {searchResult.result && <Text fontSize="14px">{searchResult.result}</Text>}
      {requestsFound.length > 0 && (
        <Grid templateColumns="auto auto auto" mt="-15px">
          <GridItem textAlign="center" px="10px">
            amount
          </GridItem>
          <GridItem textAlign="center" px="10px">
            blockDeadline
          </GridItem>
          <GridItem textAlign="center" px="10px" mb="10px">
            expires
          </GridItem>
          {requestsFound.map((req: any, idx: number) => (
            <React.Fragment key={idx}>
              <GridItem textAlign="center" fontFamily="monospace">
                {req.amount}
              </GridItem>
              <GridItem textAlign="center" fontFamily="monospace">
                {req.blockDeadline}
              </GridItem>
              <GridItem textAlign="center" fontFamily="monospace">
                {req.expiresAt}
              </GridItem>
            </React.Fragment>
          ))}
        </Grid>
      )}

      <Button
        placeSelf="end"
        onClick={() => addClaimant.mutate()}
        variant="transparent"
        border="1px solid white"
      >
        Add
      </Button>
    </Flex>
  );
};

export default DropperV2ClaimsView;
