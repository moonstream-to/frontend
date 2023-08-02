import { Button, Flex, Text } from "@chakra-ui/react";
import { useMutation, useQuery } from "react-query";
import http from "../../utils/httpMoonstream";

const API = process.env.NEXT_PUBLIC_MOONSTREAM_API_URL;

const DropperV2ClaimsView = () => {
  const getContracts = () => {
    return http({
      method: "GET",
      url: `https://engineapi.moonstream.to/metatx/contracts`,
    }).then((res) => res.data);
  };

  const contractsQuery = useQuery(["metatxContracts"], getContracts, {
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const registerContract = () => {
    return http({
      method: "POST",
      url: "https://engineapi.moonstream.to/metatx/contracts",
      data: {
        blockchain: "80001",
        address: "0x2360aBCf3b533f9ac059dA8db87f2C9e4Ba49041",
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
