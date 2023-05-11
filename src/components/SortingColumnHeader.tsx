import { Flex } from "@chakra-ui/react";

import { ArrowDownIcon, ArrowUpIcon } from "@chakra-ui/icons";

interface SortBy {
  title: string;
  direction: "ASC" | "DESC";
}

const SortingColumnHeader = ({
  title,
  sortBy,
  setSortBy,
}: {
  title: string;
  sortBy: SortBy;
  setSortBy: (arg0: SortBy) => void;
}) => {
  return (
    <Flex
      textAlign="center"
      cursor="pointer"
      w="100%"
      onClick={() =>
        setSortBy({
          title,
          direction:
            sortBy.title === title
              ? sortBy.direction === "ASC"
                ? "DESC"
                : "ASC"
              : sortBy.direction,
        })
      }
    >
      <Flex gap="10px" w="100%" justifyContent="center" alignItems="center" userSelect="none">
        {title}
        {sortBy.title === title ? (
          sortBy.direction === "ASC" ? (
            <ArrowDownIcon />
          ) : (
            <ArrowUpIcon />
          )
        ) : (
          <ArrowDownIcon color="transparent" />
        )}
      </Flex>
    </Flex>
  );
};

export default SortingColumnHeader;
