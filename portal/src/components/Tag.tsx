import { Box } from "@chakra-ui/react";

const Tag = ({ name }: { name: string }) => {
  return (
    <Box
      p="4px 8px"
      w="fit-content"
      fontSize="12px"
      lineHeight="100%"
      fontWeight="500"
      color="black"
      bg="#FFFFFF"
      borderRadius="30px"
      // border="0.5px solid #358BF5"
    >
      {name}
    </Box>
  );
};

export default Tag;
