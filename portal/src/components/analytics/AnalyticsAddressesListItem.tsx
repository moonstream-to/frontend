import { useEffect, useState } from "react";

import { Box, Flex, Image, Spacer, Text } from "@chakra-ui/react";

import ChainTag from "../ChainTag";
import Tag from "../Tag";
import useAnalytics from "../../contexts/AnalyticsContext";
import { AWS_ASSETS_PATH_CF, getChainImage } from "../../constants";

const AnalyticsAddressesListItem = ({
  address,
  idx,
}: // types,
{
  address: any;
  idx: number;
  // types: any;
}) => {
  // const [type, setType] = useState<{ icon_url?: string }>({});
  const [isShow, setIsShow] = useState(true);
  const [selected, setSelected] = useState(false);
  const { selectedAddressId, setSelectedAddressId, filter } = useAnalytics();

  // useEffect(() => {
  //   if (address && types) {
  //     setType(types.find(({ id }: { id: string }) => id === address.subscription_type_id) ?? {});
  //   }
  // }, [address, types]);

  useEffect(() => {
    setSelected(idx === selectedAddressId);
  }, [idx, selectedAddressId]);

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

    if (
      address.tags &&
      address.tags.some((tag: string) => tag.toLocaleLowerCase().includes(lowCaseFilter))
    ) {
      setIsShow(true);
      return;
    }

    if (address.chainName.toLowerCase().includes(lowCaseFilter)) {
      setIsShow(true);
      return;
    }

    setIsShow(false);
  }, [address, filter]);

  const chainName = address.chainName; // subscription_type_id.split("_")[0];

  return (
    <>
      {isShow && (
        <Flex
          flexDirection="column"
          gap="15px"
          p="10px"
          onClick={() => setSelectedAddressId(idx)}
          borderRadius="10px"
          border="1px solid"
          borderColor={selected ? "white" : "transparent"}
          cursor="pointer"
        >
          <Flex gap="10px" alignItems="center">
            {address.type === "smartcontract" ? (
              <>
                {chainName ? (
                  <Image
                    h="20px"
                    w="20px"
                    alt=""
                    src={getChainImage(chainName)}
                    filter="invert(100%)"
                  />
                ) : (
                  <Box w="20px" />
                )}
              </>
            ) : (
              <Image h="20px" w="20px" alt="" src={`${AWS_ASSETS_PATH_CF}/icons/account.png`} />
            )}
            <Text fontSize="14px" lineHeight="18px">
              {address.label}
            </Text>
            <Spacer />
          </Flex>

          <Flex gap="5px" wrap="wrap">
            {address.type === "smartcontract" && <ChainTag name={chainName} />}
            {address.tags &&
              address.tags.map((a: string, idx: number) => <Tag key={idx} name={a} />)}
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default AnalyticsAddressesListItem;
