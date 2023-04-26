import { useEffect, useState } from "react";

import { Flex, Text } from "@chakra-ui/react";

import useQueryAPI from "../../contexts/QueryAPIContext";

const QueryAPIQueriesListItem = ({ query }: { query: { entry_id: string; name: string } }) => {
  const [isShow, setIsShow] = useState(true);
  const [selected, setSelected] = useState(false);
  const { selectedQuery, setSelectedQuery, filter } = useQueryAPI();

  useEffect(() => {
    setSelected(query.entry_id === selectedQuery.entry_id);
  }, [query, selectedQuery]);

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
          onClick={() => setSelectedQuery(query)}
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
