import { Button, Flex, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import { useRouter } from "next/router";
import { useMutation } from "react-query";
import useLink from "../../hooks/useLink";
import http from "../../utils/httpMoonstream";

const DropperV2ContractCard = ({
  title,
  uri,
  address,
  id,
}: {
  title: string;
  uri: string;
  address: string;
  id: string;
}) => {
  // const metadata = useLink({ link: uri });

  const deleteContract = useMutation(async () => {
    const res = await http({
      method: "DELETE",
      url: "https://api.moonstream.to/metatx/contracts",
      data: {
        contract_id: id,
      },
    });
    console.log(res);
  });

  const router = useRouter();

  const handleClick = () => {
    router.push({
      pathname: `/portal/dropperV2`,
      query: {
        contractAddress: address,
      },
    });
  };

  return (
    <Flex
      direction="column"
      gap="20px"
      borderRadius="20px"
      p="20px"
      bg="#4d4d4d"
      alignItems="center"
    >
      {uri && (
        <Image
          src={uri}
          width="180px"
          height="180px"
          alt={uri}
          borderRadius="5px"
          border="1px solid #2d2d2d"
        />
      )}
      <Text textAlign="center" variant="title2" maxW="180px" lineHeight="1.25">
        {title}
      </Text>
      <Button variant="saveButton" onClick={handleClick} minW="0" px="40px">
        Manage
      </Button>
    </Flex>
  );
};

export default DropperV2ContractCard;
