import { Button, Flex, Text } from "@chakra-ui/react";
import { useMutation, useQuery } from "react-query";
// import http from "../../utils/http";
import http from "../../utils/httpMoonstream";

const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

const DropperV2ClaimsView = () => {
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
        blockchain: "80001",
        address: "0x6FF32C81600Ec625c68b0D687ba3C2681eD43867",
        contract_type: "dropper-v0.2.0",
      },
    });
  };

  const addContract = useMutation(registerContract, {
    onSuccess: () => {
      contractsQuery.refetch();
    },
  });

  return (
    <Flex direction="column" gap="20px">
      {contractsQuery.data && <Text>{contractsQuery.data.length}</Text>}
      <Button onClick={() => addContract.mutate()}>Add contract</Button>
    </Flex>
  );
};

export default DropperV2ClaimsView;
