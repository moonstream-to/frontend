import { LinkIcon } from "@chakra-ui/icons";
import { Flex, IconButton, Text, useClipboard } from "@chakra-ui/react";
import { AiFillEdit, AiOutlineEdit } from "react-icons/ai";

type DropHeaderProps = {
  address: string;
  claimId: string;
  PORTAL_PATH: string;
  toggleEdit: () => void;
  isEdit: boolean;
  title?: string;
  status?: boolean;
};

const DropHeader: React.FC<DropHeaderProps> = ({
  address,
  claimId,
  PORTAL_PATH,
  toggleEdit,
  isEdit,
  title,
  status,
}) => {
  const { onCopy, hasCopied } = useClipboard(
    `${PORTAL_PATH}/dropperV2/?contractAddress=${address}&claimId=${claimId}`,
  );

  return (
    <Flex w="100%" justifyContent="space-between" mb="20px">
      <Flex gap="30px" position="relative" w="fit-content" alignItems="center">
        {title && (
          <Text fontWeight="700" fontSize="24px">
            {title}
          </Text>
        )}
        {hasCopied && <Text variant="tooltip">copied</Text>}
        <Flex gap="10px" alignItems="center">
          <Text textAlign="start" color="#c2c2c2" w="fit-content" py={1} pr={0} fontSize="20px">
            {`drop ${claimId}`}
          </Text>
          <IconButton
            bg="transparent"
            paddingInline="0"
            onClick={onCopy}
            color="#c2c2c2"
            _hover={{ bg: "transparent", color: "white" }}
            icon={<LinkIcon />}
            aria-label="copy link"
            minWidth="0"
          />
        </Flex>
        {status !== undefined && (
          <Text fontWeight="700" fontSize="16px" color={status ? "#46C370" : "#EE8686"}>
            {status ? "Active" : "Inactive"}
          </Text>
        )}
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
