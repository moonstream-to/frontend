import { useEffect, useState } from "react";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/react";

import useLink from "../../hooks/useLink";
import useTermiminus from "../../contexts/TerminusContext";

const TerminusPoolsListItem = ({ poolId, uri }: { poolId: number; uri: string }) => {
  const metadata = useLink({ link: uri });

  const { selectPool, setSelectedPoolMetadata, selectedPool, queryPoolId, poolsFilter } =
    useTermiminus();
  const [selected, setSelected] = useState(poolId === selectedPool);
  const handleClick = () => {
    selectPool(poolId);
    setSelectedPoolMetadata(metadata.data);
  };

  useEffect(() => {
    setSelected(poolId === selectedPool);
  }, [selectedPool, poolId]);

  useEffect(() => {
    if (selected) {
      setSelectedPoolMetadata(metadata.data);
    }
  }, [selected, metadata.data, poolId]);

  useEffect(() => {
    if (poolId === queryPoolId) {
      const element = document.getElementById(`pool-${poolId}`);
      element?.scrollIntoView({ block: "center" });
      const poolView = document.getElementById("poolView");
      poolView?.scrollIntoView();
    }
  }, [queryPoolId, poolId]);

  const [show, setShow] = useState(true);
  useEffect(() => {
    if (poolsFilter === "") {
      setShow(true);
      return;
    }
    const lowCaseFilter = poolsFilter.toLowerCase();
    if (metadata.data?.name?.toLowerCase().includes(lowCaseFilter)) {
      setShow(true);
      return;
    }
    if (metadata.data?.description?.toLowerCase().includes(lowCaseFilter)) {
      setShow(true);
      return;
    }
    if (poolId.toString().startsWith(lowCaseFilter)) {
      setShow(true);
      return;
    }
    setShow(false);
  }, [poolsFilter, metadata.data, poolId]);

  return (
    <>
      {show && (
        <Flex
          gap="15px"
          alignItems="center"
          bg={selected ? "#4d4d4d" : "transparent"}
          fontWeight={selected ? "900" : "400"}
          borderRadius="10px"
          onClick={handleClick}
          cursor="pointer"
          p="10px"
          id={`pool-${String(poolId)}`}
        >
          {!metadata.data?.image && (
            <>
              <Box border="1px solid black" borderRadius="5px" w="32px" h="32px" />
            </>
          )}
          {metadata.data && (
            <>
              {metadata.data.image && (
                <Image
                  src={metadata.data.image}
                  width="32px"
                  height="32px"
                  alt={metadata.data.image}
                  borderRadius="5px"
                />
              )}
              <Text unselectable="on">{metadata.data.name}</Text>
            </>
          )}
          {!metadata.data?.name && (
            <>
              <Text borderRadius="5px" h="32px" flexGrow="1" textStyle="italic" color="gray">
                no name
              </Text>
            </>
          )}
        </Flex>
      )}
    </>
  );
};

export default TerminusPoolsListItem;
