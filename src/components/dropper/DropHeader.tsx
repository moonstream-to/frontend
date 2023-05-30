import { LinkIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text, useClipboard } from "@chakra-ui/react";

type DropHeaderProps = {
  address: string;
  claimId: string;
  PORTAL_PATH: string;
};

const DropHeader: React.FC<DropHeaderProps> = ({ address, claimId, PORTAL_PATH }) => {
  const { onCopy, hasCopied } = useClipboard(
    `${PORTAL_PATH}/dropper/?contractAddress=${address}&claimId=${claimId}`,
  );

  return (
    <Flex gap={2} position="relative" w="fit-content">
      {hasCopied && <Text variant="tooltip">copied</Text>}
      <Text
        textAlign="start"
        color="#c2c2c2"
        w="fit-content"
        py={1}
        pr={0}
        borderBottom="1px solid #c2c2c2"
        fontSize="20px"
        mb="20px"
      >
        {`drop ${claimId}`}
      </Text>
      <IconButton
        bg="transparent"
        onClick={onCopy}
        color="#c2c2c2"
        _hover={{ bg: "transparent", color: "white" }}
        icon={<LinkIcon />}
        aria-label="copy link"
      />
    </Flex>
  );
};

export default DropHeader;
