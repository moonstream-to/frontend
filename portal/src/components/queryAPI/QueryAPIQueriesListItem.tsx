import { useEffect, useState } from "react";

import { Flex, Text } from "@chakra-ui/react";

import useQueryAPI from "../../contexts/QueryAPIContext";

const QueryAPIQueriesListItem = ({
  query,
  idx,
}: {
  query: { entry_id: string; name: string };
  idx: number;
}) => {
  const [isShow, setIsShow] = useState(true);
  const [selected, setSelected] = useState(false);
  const { selectedQueryId, setSelectedQueryId, filter } = useQueryAPI();

  useEffect(() => {
    setSelected(idx === selectedQueryId);
  }, [idx, selectedQueryId]);

  useEffect(() => {
    setIsShow(!filter || query.name.toLowerCase().includes(filter.toLowerCase()));
  }, [query, filter]);

  return (
    <>
      {isShow && (
        <Flex
          flexDirection="column"
          gap="15px"
          p="10px"
          onClick={() => setSelectedQueryId(idx)}
          borderRadius="10px"
          bg={selected ? "#4d4d4d" : "transparent"}
          cursor="pointer"
        >
          <Flex gap="10px" alignItems="center">
            <Text fontSize="18px" textTransform="capitalize">
              {query.name.split("_").join(" ")}
            </Text>
          </Flex>
        </Flex>
      )}
    </>
  );
};

export default QueryAPIQueriesListItem;
