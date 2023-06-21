import { Button, Flex, useDisclosure } from "@chakra-ui/react";
import AddTagModal from "../AddTagModal";
import Tag from "../Tag";

const AnalyticsAddressTags = ({
  chainName,
  tags,
  onAdd,
  onDelete,
}: {
  chainName?: string;
  tags: string[];
  onAdd?: (newTag: string) => void;
  onDelete?: (tag: string) => void;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleAddTag = (newTag: string) => {
    if (newTag.trim() !== "" && onAdd) {
      onAdd(newTag);
    }
    onClose();
  };

  return (
    <Flex gap="5px" h="24px" wrap="wrap" alignItems="center">
      {onAdd && <AddTagModal isOpen={isOpen} onClose={onClose} onAddTag={handleAddTag} />}
      {chainName && <Tag name={chainName} h="24px" bg="#94C2FA" textTransform="capitalize" />}
      {tags &&
        tags.map((tag: string, idx: number) => (
          <Tag
            key={idx}
            name={tag}
            h="24px"
            onDelete={onDelete ? () => onDelete(tag) : undefined}
            fontSize="14px"
          />
        ))}
      <Button
        onClick={onOpen}
        variant="transparent"
        color="#BFBFBF"
        fontSize="14px"
        py="0"
        h="fit-content"
      >
        + Add a tag...
      </Button>
    </Flex>
  );
};

export default AnalyticsAddressTags;
