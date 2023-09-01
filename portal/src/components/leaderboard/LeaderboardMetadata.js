import RouterLink from "next/link";

import { chakra, Flex, Box, Heading, Text, Spacer, Button, Link } from "@chakra-ui/react";
import { FiEdit2 } from "react-icons/fi";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";

const printDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
};

const LeaderboardMetadata = ({ leaderboard, lastUpdate, handleEdit }) => {
  return (
    <Box>
      <Flex>
        <Heading fontSize={["lg", "2xl"]}>{leaderboard.title}</Heading>
        <Spacer />
        <Link
          as={RouterLink}
          href={`/leaderboards/?leaderboard_id=${leaderboard.id}`}
          target="_blank"
          pt="5px"
        >
          <chakra.span
            style={{ textDecoration: "underline" }}
            _hover={{ color: "accent.500", textDecoration: "underline" }}
          >
            link to public leaderboard
          </chakra.span>
        </Link>
        <Spacer />
        <Box>
          <Button
            width="100%"
            fontWeight="700"
            bgColor="transparent"
            color="inherit"
            rightIcon={<FiEdit2 />}
            _hover={{ bg: "accent.500" }}
            onClick={handleEdit}
          >
            Edit
          </Button>
        </Box>
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
