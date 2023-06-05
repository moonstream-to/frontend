import { LinkIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text, useClipboard } from "@chakra-ui/react";
import { AiFillEdit, AiOutlineEdit } from "react-icons/ai";

type DropHeaderProps = {
  address: string;
  claimId: string;
  PORTAL_PATH: string;
  toggleEdit: () => void;
  isEdit: boolean;
};

const DropHeader: React.FC<DropHeaderProps> = ({
  address,
  claimId,
  PORTAL_PATH,
  toggleEdit,
  isEdit,
}) => {
  const { onCopy, hasCopied } = useClipboard(
    `${PORTAL_PATH}/dropper/?contractAddress=${address}&claimId=${claimId}`,
  );

  return (
    <Flex w="100%" justifyContent="space-between">
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
      <IconButton
        aria-label={isEdit ? "Disable Edit" : "Enable Edit"}
        bg="transparent"
        _hover={{ bg: "transparent", color: "white" }}
        icon={isEdit ? <AiFillEdit /> : <AiOutlineEdit />}
        onClick={toggleEdit}
      />
    </Flex>
  );
};

export default DropHeader;
