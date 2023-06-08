import { useEffect, useState } from "react";

import { Flex, Image, Text } from "@chakra-ui/react";

// import useQueryAPI from "../../contexts/QueryAPIContext";

import ChainTag from "../ChainTag";
import Tag from "../Tag";
import useAnalytics from "../../contexts/AnalyticsContext";

const AnalyticsAddressesListItem = ({
  address,
  idx,
  types,
}: {
  address: any;
  idx: number;
  types: any;
}) => {
  const [type, setType] = useState<{ icon_url?: string }>({});
  const [isShow, setIsShow] = useState(true);
  const [selected, setSelected] = useState(false);
  const { selectedContractId, setSelectedContractId, filter } = useAnalytics();

  useEffect(() => {
    if (address && types) {
      setType(types.find(({ id }: { id: string }) => id === address.subscription_type_id) ?? {});
    }
  }, [address, types]);

  useEffect(() => {
    setSelected(idx === selectedContractId);
  }, [idx, selectedContractId]);

  useEffect(() => {
    if (filter === "") {
      setIsShow(true);
      return;
    }
    const lowCaseFilter = filter.toLowerCase();
    if (address.label.toLowerCase().includes(lowCaseFilter)) {
      setIsShow(true);
      return;
    }

    if (address.subscription_type_id.toLowerCase().includes(lowCaseFilter)) {
      setIsShow(true);
      return;
    }

    setIsShow(false);
  }, [address, filter]);

  return (
    <>
      {isShow && (
        <Flex
          flexDirection="column"
          gap="15px"
          p="10px"
          onClick={() => setSelectedContractId(idx)}
          borderRadius="10px"
          // bg={selected ? "#4d4d4d" : "transparent"}
          border={selected ? "1px solid white" : "none"}
          cursor="pointer"
        >
          <Flex gap="10px" alignItems="center">
            {type && type.icon_url && <Image h="20px" w="20px" alt="" src={type.icon_url} />}
            <Text fontSize="18px">{address.label}</Text>
          </Flex>
          <Flex gap="5px" wrap="wrap">
            <ChainTag name={address.subscription_type_id.split("_")[0]} />
            {address.tags.map((a: string, idx: number) => (
              <Tag key={idx} name={a} />
            ))}
            {/* <Tag name={address.subscription_type_id.split("_").slice(1).join("")} /> */}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default AnalyticsAddressesListItem;
