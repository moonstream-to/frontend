import { Box, BoxProps } from "@chakra-ui/react";

const Tag = ({ name, ...rest }: { name: string } & Omit<BoxProps, "name">) => {
  return (
    <Box
      display="flex"
      p="4px 8px"
      w="fit-content"
      fontSize="12px"
      lineHeight="100%"
      fontWeight="500"
      color="black"
      bg="#FFFFFF"
      borderRadius="30px"
      alignItems="center"
      {...rest}
    >
      {name}
    </Box>
  );
};

export default Tag;
