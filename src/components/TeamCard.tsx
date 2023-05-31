import React from "react";
import { Heading, Avatar, Box, Center, Text } from "@chakra-ui/react";

export default function SocialProfileSimple({
  avatarURL,
  name,
  atName,
  content,
}: {
  avatarURL: string;
  avatarAlt?: string;
  name: string;
  atName: string;
  content: string;
}) {
  return (
    <Center py={6}>
      <Box
        maxW={"320px"}
        h="420px"
        w={"full"}
        borderRadius="20px"
        border="1px solid white"
        p={6}
        textAlign={"center"}
      >
        <Avatar size={"xl"} src={avatarURL} mb={4} pos={"relative"} bg="white" />
        <Heading fontSize={"2xl"} fontFamily={"body"}>
          {name}
        </Heading>
        <Text fontWeight={600} color={"blue.850"} mb={4}>
          {atName}
        </Text>
        <Text textAlign={"center"} px={3}>
          {content}
        </Text>
      </Box>
    </Center>
  );
}
