import { Flex, Text, Select, Spinner, Box } from "@chakra-ui/react";
import { useState } from "react";

type props = {
  onPageSizeChange: (arg0: number) => void;
  onOffsetChange: (arg0: number) => void;
  count: number;
  isFetching: boolean;
};

const LeaderboardPaginator: React.FC<props> = ({
  onPageSizeChange,
  onOffsetChange,
  count,
  isFetching,
}) => {
  const _pageOptions = ["10", "25", "50", "500"];
  const [pageSize, setPageSize] = useState(Number(_pageOptions[0]));
  const [currentPage, setCurrentPage] = useState(1);
  const pageCount = Math.ceil(count / pageSize);
  const getPageNumbers = () => {
    if (pageCount < 8) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }
    const numbers = [1];
    if (currentPage > 4 && pageCount > 7) {
      numbers.push(0);
      if (currentPage > pageCount - 4) {
        for (let i = -4; i < 1; i += 1) {
          numbers.push(pageCount + i);
        }
        return numbers;
      }
    }

    if (currentPage > 4) {
      for (let i = -1; i < 2; i += 1) {
        if (currentPage + i > 1 && currentPage + i < pageCount - 1) {
          numbers.push(currentPage + i);
        }
      }
    } else {
      for (let i = 2; i < 6; i += 1) {
        numbers.push(i);
      }
    }

    if (pageCount > 7) {
      numbers.push(0);
    }
    numbers.push(pageCount);
    return numbers;
  };

  return (
    <Flex alignItems="center" justifyContent="center" gap="30px" fontWeight="300" w="100%">
      <Flex gap="10px">
        {getPageNumbers().map((page, idx) => (
          <Text
            key={idx}
            onClick={() => {
              if (page) {
                setCurrentPage(page);
                onOffsetChange(pageSize * (page - 1));
              }
            }}
            color={page === currentPage ? "white" : "#AAAAAA"}
            fontWeight={page === currentPage ? "700" : "400"}
            cursor={!page ? "default" : "pointer"}
          >
            {page === 0 ? "..." : page}
          </Text>
        ))}
      </Flex>
      <Flex gap="5px" alignItems="center" id="paginator">
        <Select
          bg="transparent"
          color="white"
          borderRadius="10px"
          borderColor="#4d4d4d"
          size="sm"
          w="fit-content"
          onChange={(e) => {
            const newPageSize = Number(e.target.value);
            const newCurrentPage = Math.ceil(((currentPage - 1) * pageSize + 1) / newPageSize);
            console.log(newCurrentPage);
            setCurrentPage(newCurrentPage);
            setPageSize(newPageSize);
            onPageSizeChange(newPageSize);
            onOffsetChange((newCurrentPage - 1) * newPageSize);
          }}
          value={pageSize}
        >
          {_pageOptions.map((pageSize: string) => {
            return (
              <option
                style={{ color: "white", backgroundColor: "#2D2d2d" }}
                key={`paginator-options-pagesize-${pageSize}`}
                value={pageSize}
              >
                {pageSize}
              </option>
            );
          })}
        </Select>
        <Text>per page</Text>
      </Flex>
      {isFetching ? <Spinner h="20px" w="20px" color="#999999" /> : <Box h="20px" w="20px" />}
    </Flex>
  );
};

export default LeaderboardPaginator;
