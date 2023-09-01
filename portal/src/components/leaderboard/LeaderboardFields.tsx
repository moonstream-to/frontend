import { Flex, Box, Text, Textarea, Input } from "@chakra-ui/react";

const LeaderboardFields = ({
  title,
  setTitle,
  description,
  setDescription,
}: {
  title: string;
  setTitle: any;
  description: string;
  setDescription: any;
}) => {
  return (
    <Flex flexDir="column" my="20px" gap="20px">
      <Box>
        <Text fontSize="sm" mb="6px">
          Title
        </Text>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          borderRadius="10px"
          p="8px 15px"
        />
      </Box>
      <Box>
        <Text fontSize="sm" mb="6px">
          Description
        </Text>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter leaderboard description."
          size="md"
          borderRadius="10px"
          p="8px 15px"
        />
      </Box>
    </Flex>
  );
};

export default LeaderboardFields;
