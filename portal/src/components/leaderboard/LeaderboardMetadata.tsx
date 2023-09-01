import { Flex, Box, Heading, Text, Spacer, Button } from "@chakra-ui/react";
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
      <Flex>
        <Heading fontSize={["lg", "2xl"]} mb="20px">
          {leaderboard.title}
        </Heading>
        <Spacer />
        <Box>
          <Button
            width="100%"
            fontWeight="700"
            bgColor="transparent"
            color="inherit"
            my="20px"
            rightIcon={<FiEdit2 />}
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
