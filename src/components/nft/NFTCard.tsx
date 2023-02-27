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
import TextWithPopup from "../TextWithPopup";

const defaultImageUrl = "https://s3.amazonaws.com/static.greatwyrm.xyz/anonymous_person.jpg";

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
  const calculatedImaged = imageUrl && imageUrl.trim() != "" ? imageUrl : defaultImageUrl;
  return (
    <Flex {...props} backgroundColor="#353535">
      <VStack maxW="250" border="solid" borderColor="white" borderRadius="lg">
        <Image
          src={imageUrl && imageUrl.trim() != "" ? imageUrl : defaultImageUrl}
          as={isVideo ? "video" : undefined}
          filter={grayedOut ? "grayscale(100%)" : undefined}
          opacity={grayedOut ? "0.3" : undefined}
          loading="lazy"
          w="200px"
          h="200px"
          px={2}
          py={4}
          borderRadius="sm"
          alt="NFT Image"
        />
        <Box px={2} pb={2}>
          {description ? (
            <TextWithPopup text={description} image={calculatedImaged} title={name} />
          ): (
            <Text fontSize="md" pb={2}>{name}</Text>
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
