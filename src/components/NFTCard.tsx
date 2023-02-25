import React from "react";
import {
  Flex,
  Image,
  Text,
  chakra,
  Spacer,
  VStack,
  Box,
} from "@chakra-ui/react";
import LongTextMarkdownDisplay from "./LongTextMarkdownDisplay";

const _NFTCard = ({
  name,
  imageUrl,
  description,
  balance,
  showQuantity = true,
  isVideo = false,
  grayedOut = false,
  ...props
}: {
  name: string;
  imageUrl: string;
  balance: number;
  description?: string;
  showQuantity?: boolean;
  isVideo?: boolean;
  grayedOut?: boolean;
}) => {
  return (
    <Flex {...props} pb={10}>
      <VStack maxW="250" border="solid" borderColor="white" borderRadius="lg">
        <Image
          src={imageUrl}
          as={isVideo ? "video" : undefined}
          filter={grayedOut ? "grayscale(100%)" : undefined}
          opacity={grayedOut ? "0.3" : undefined}
          loading="lazy"
          p={2}
          borderRadius="sm"
          alt="NFT Image"
        />
        <Box px={2} pb={2}>
          <Text fontSize="md" pb={2}>{name}</Text>
          {description && (
            <LongTextMarkdownDisplay longTextMarkdown={description} header={name}></LongTextMarkdownDisplay>
          )}
          {showQuantity && (
            <Flex fontSize="sm" w="100%">
              <Text>Quantity</Text>
              <Spacer />
              <Text>{balance}</Text>
            </Flex>
          )}
        </Box>
      </VStack>
    </Flex>
  );
};

const NFTCard = chakra(_NFTCard);
export default NFTCard;
