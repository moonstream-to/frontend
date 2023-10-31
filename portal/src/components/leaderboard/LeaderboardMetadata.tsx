import RouterLink from "next/link";

import { Flex, Box, Heading, Text, Spacer, Button, Link } from "@chakra-ui/react";
import { LinkIcon } from "@chakra-ui/icons";

import { FiEdit2 } from "react-icons/fi";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import { UseQueryResult } from "react-query";

const printDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const LeaderboardMetadata = ({
  leaderboard,
  lastUpdate,
  handleEdit,
}: {
  leaderboard: any;
  lastUpdate: UseQueryResult<any, unknown>;
  handleEdit: () => void;
}) => {
  return (
    <Box>
      <Flex mb="20px">
        <Heading fontSize={["lg", "2xl"]}>{leaderboard.title}</Heading>
        <Spacer />
        <Spacer />
        <Flex gap="10px">
          <Button
            variant="solidWhite"
            fontSize="md"
            color="#F56646"
            h="30px"
            rightIcon={<LinkIcon />}
          >
            <Link
              as={RouterLink}
              href={`/leaderboards/?leaderboard_id=${leaderboard.id}`}
              target="_blank"
            >
              Public Leaderboard
            </Link>
          </Button>
          <Button
            h="30px"
            fontWeight="700"
            bgColor="transparent"
            color="inherit"
            rightIcon={<FiEdit2 />}
            _hover={{ bg: "accent.500" }}
            onClick={handleEdit}
          >
            Edit
          </Button>
        </Flex>
      </Flex>
      <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm, remarkBreaks]}>
        {leaderboard.description}
      </ReactMarkdown>
      <Box bgColor="#232323" rounded="lg" p="10px" my="20px">
        <Flex>
          <Text>leaderboard id</Text>
          <Spacer />
          <Text>{leaderboard.id}</Text>
        </Flex>
        <Flex>
          <Text>Created date</Text>
          <Spacer />
          <Text>{printDate(leaderboard.created_at)}</Text>
        </Flex>
        <Flex>
          <Text>Last Score Update</Text>
          <Spacer />
          <Text>{lastUpdate.data && printDate(lastUpdate.data)}</Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default LeaderboardMetadata;
