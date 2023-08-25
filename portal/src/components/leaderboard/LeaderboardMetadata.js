import { Flex, Box, Heading, Text, Spacer, Button } from "@chakra-ui/react";
import { FiEdit2 } from "react-icons/fi";

const LeaderboardMetadata = ({ leaderboard, handleEdit }) => {
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
      <Text my="10px">{leaderboard.description}</Text>
      <Box bgColor="#232323" rounded="lg" p="10px" my="20px">
        <Flex>
          <Text>leaderboard id</Text>
          <Spacer />
          <Text>{leaderboard.id}</Text>
        </Flex>
        <Flex>
          <Text>Created date</Text>
          <Spacer />
          <Text>{new Date(leaderboard.created_at).toDateString()}</Text>
        </Flex>
      </Box>
    </Box>
  );
};

export default LeaderboardMetadata;
