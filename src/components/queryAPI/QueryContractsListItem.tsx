import { useEffect, useState } from "react";

import { Flex, Image, Text } from "@chakra-ui/react";

import useQueryAPI from "../../contexts/QueryAPIContext";

import ChainTag from "../ChainTag";
import Tag from "../Tag";

const QueryContractsListItem = ({
  contract,
  idx,
  types,
}: {
  contract: any;
  idx: number;
  types: any;
}) => {
  const [type, setType] = useState<{ icon_url?: string }>({});
  const [isShow, setIsShow] = useState(true);
  const [selected, setSelected] = useState(false);
  const { selectedContractId, setSelectedContractId, filter } = useQueryAPI();

  useEffect(() => {
    if (contract && types) {
      setType(types.find(({ id }: { id: string }) => id === contract.subscription_type_id) ?? {});
    }
  }, [contract, types]);

  useEffect(() => {
    setSelected(idx === selectedContractId);
  }, [idx, selectedContractId]);

  useEffect(() => {
    if (filter === "") {
      setIsShow(true);
      return;
    }
    const lowCaseFilter = filter.toLowerCase();
    if (contract.label.toLowerCase().includes(lowCaseFilter)) {
      setIsShow(true);
      return;
    }

    if (contract.subscription_type_id.toLowerCase().includes(lowCaseFilter)) {
      setIsShow(true);
      return;
    }

    setIsShow(false);
  }, [contract, filter]);

  return (
    <>
      {isShow && (
        <Flex
          flexDirection="column"
          gap="15px"
          p="10px"
          onClick={() => setSelectedContractId(idx)}
          borderRadius="10px"
          bg={selected ? "#4d4d4d" : "transparent"}
          cursor="pointer"
        >
          <Flex gap="10px" alignItems="center">
            {type && type.icon_url && <Image h="20px" w="20px" alt="" src={type.icon_url} />}
            <Text fontSize="18px">{contract.label}</Text>
          </Flex>
          <Flex gap="5px">
            <ChainTag name={contract.subscription_type_id.split("_")[0]} />
            <Tag name={contract.subscription_type_id.split("_").slice(1).join("")} />
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default QueryContractsListItem;
