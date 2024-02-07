import { Button, Flex, Spinner, Text, useClipboard, Link } from "@chakra-ui/react";
import { useDeleteEntity, useJournal } from "../../hooks/useJournal";
import AddEntityButton from "./AddEntityButton";
import { AiOutlineCopy, AiOutlineDelete, AiOutlineSave } from "react-icons/ai";

const Web3Address = ({
  label,
  address,
  isTruncated = false,
  canDelete = false,
  entityTag,
  blockchain,
  copyByAddressClick = true,
  href,
  ...props
}: {
  label?: string;
  address: string;
  entityTag?: string;
  blockchain?: string;
  isTruncated?: boolean;
  canDelete?: boolean;
  copyByAddressClick?: boolean;
  href?: string;
  [x: string]: any;
}) => {
  const { onCopy, hasCopied } = useClipboard(address);

  const entity = useJournal({ tags: [`address:${address}`] });
  const deleteAddress = useDeleteEntity();

  const RenderText = () => (
    <Text
      cursor={"pointer"}
      onClick={copyByAddressClick && !href ? onCopy : undefined}
      fontFamily={entity.data?.totalLength ? undefined : "JetBrains Mono, monospace"}
      title={href ? `${window.location.origin}${href}` : address}
    >
      {entity.data?.totalLength
        ? entity.data?.entities[0].title
        : isTruncated
        ? `${address.slice(0, 6)}...${address.slice(-4)}`
        : address}
    </Text>
  );

  return (
    <Flex justifyContent={"space-between"} alignItems={"center"} {...props}>
      {label && <Text>{label}</Text>}
      <Flex gap={"5px"} position={"relative"} alignItems={"center"}>
        {href ? (
          <Link
            href={href}
            color="orange.1000"
            _hover={{ color: "orange.400", textDecoration: "none" }}
            target="_blank"
          >
            <RenderText />
          </Link>
        ) : (
          <RenderText />
        )}

        <AiOutlineCopy onClick={onCopy} cursor="pointer" title={"Copy address"} />
        {hasCopied && (
          <Text
            fontSize={"16px"}
            fontWeight="400"
            position="absolute"
            top="100%"
            right="0"
            bg="#2d2d2d"
            borderRadius="8px"
            p="5px 10px"
            border="2px solid #BBBBBB"
            zIndex="100"
          >
            {`copied ${address}`}
          </Text>
        )}
        {entity.data?.totalLength === 0 && entityTag && blockchain && (
          <AddEntityButton address={address} tags={[entityTag]} blockchain={blockchain}>
            <AiOutlineSave title={"Save to the Entities"} />
          </AddEntityButton>
        )}
        {canDelete && !!entity.data?.totalLength && entity.data?.totalLength > 0 && (
          <Button
            variant={"transparent"}
            h={"18px"}
            w={"18px"}
            minW={"0"}
            p={"0"}
            title={"Delete from entities"}
            onClick={() =>
              deleteAddress.mutate({
                entity: entity.data?.entities[0],
              })
            }
          >
            {deleteAddress.isLoading ? <Spinner h={"18px"} w={"18px"} /> : <AiOutlineDelete />}
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default Web3Address;
