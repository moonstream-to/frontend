import { CloseIcon } from "@chakra-ui/icons";
import { Box, BoxProps } from "@chakra-ui/react";

const Tag = ({
  name,
  onDelete,
  ...rest
}: { name: string; onDelete?: () => void } & Omit<BoxProps, "name">) => {
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
      gap="5px"
      {...rest}
    >
      {name}
      {onDelete && <CloseIcon h="16px" w="16px" p="4px" cursor="pointer" onClick={onDelete} />}
    </Box>
  );
};

export default Tag;
