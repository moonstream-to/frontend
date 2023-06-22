import { Box } from "@chakra-ui/react";

const ChainTag = ({ name }: { name: string }) => {
  return (
    <Box
      p="4px 8px"
      w="fit-content"
      fontSize="12px"
      lineHeight="100%"
      fontWeight="500"
      color="#101114"
      bg="#94C2FA"
      borderRadius="30px"
      border="0.5px solid #E6E6E6"
      textTransform="capitalize"
    >
      {name}
    </Box>
  );
};

export default ChainTag;
