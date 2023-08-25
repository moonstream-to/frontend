import { Flex, Box, Heading, Text, Spacer, Button, Input } from "@chakra-ui/react";
import { FiEdit2 } from "react-icons/fi";

const LeaderboardFields = ({ title, setTitle, description, setDescription }) => {
  return (
    <Flex flexDir="column" my="20px" gap="20px">
      <Box>
        <Text fontSize="sm" mb="6px">
          Title
        </Text>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          // placeholder="search"
          borderRadius="10px"
          p="8px 15px"
        />
      </Box>
      <Box>
        <Text fontSize="sm" mb="6px">
          Description
        </Text>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          // placeholder="search"
          borderRadius="10px"
          p="8px 15px"
        />
      </Box>
    </Flex>
  );
};

export default LeaderboardFields;
