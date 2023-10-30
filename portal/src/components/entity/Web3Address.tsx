import { Button, Flex, Spinner, Text, useClipboard } from "@chakra-ui/react";
import { useDeleteEntity, useJournal } from "../../hooks/useJournal";
import AddEntityButton from "./AddEntityButton";
import { AiOutlineCopy, AiOutlineDelete, AiOutlineSave } from "react-icons/ai";
import { useEffect } from "react";
import { useQueryClient } from "react-query";

const Web3Address = ({
  label,
  address,
  isTruncated = false,
  canDelete = false,
  entityTag,
  blockchain,
  ...props
}: {
  label?: string;
  address: string;
  entityTag?: string;
  blockchain?: string;
  isTruncated?: boolean;
  canDelete?: boolean;
  [x: string]: any;
}) => {
  const { onCopy, hasCopied } = useClipboard(address);

  const entity = useJournal({ tags: [`address:${address}`] });
  const deleteAddress = useDeleteEntity();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (deleteAddress.isSuccess) {
      console.log("setting query data");
      queryClient.setQueryData(
        ["journalByName", "Web3Addresses", [`address:${address}`]],
        (oldData) => {
          console.log(oldData);
          return [];
        },
      );
    }
  }, [deleteAddress.isSuccess]);

  return (
    <Flex justifyContent={"space-between"} alignItems={"center"} {...props}>
      {label && <Text>{label}</Text>}
      <Flex gap={"10px"} position={"relative"} alignItems={"center"}>
        {entity.data?.totalLength ? (
          <Text cursor={"pointer"} onClick={onCopy} title={address}>
            {entity.data?.entities[0].title}
          </Text>
        ) : (
          <Text
            cursor={"pointer"}
            onClick={onCopy}
            fontFamily={"JetBrains Mono, monospace"}
            title={address}
          >
            {isTruncated ? `${address.slice(0, 6)}...${address.slice(-4)}` : address}
          </Text>
        )}
        <AiOutlineCopy onClick={onCopy} cursor="pointer" title={"Copy address"} />
        {hasCopied && (
          <Text
            fontWeight="700"
            position="absolute"
            bottom="-40px"
            left="-69%"
            transform="translate(-50%, 0)"
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
