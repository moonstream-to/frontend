import { Flex, Box, Heading, Text, UnorderedList, ListItem } from "@chakra-ui/react";
import { FiEdit2 } from "react-icons/fi";

const APIMethod = ({
  id,
  methodTitle,
  methodDescription,
  parameterList,
  endpoint,
}: {
  id: string;
  methodTitle: string;
  methodDescription?: string;
  parameterList: any[];
  endpoint: string;
}) => {
  return (
    <>
      <Box py="5px">
        <Heading fontSize="md">{methodTitle}:</Heading>
        <Flex flexDir="column" m="20px" fontSize="sm" gap="10px">
          {methodDescription && <Text>{methodDescription}</Text>}
          <Text>Available parameters:</Text>
          <UnorderedList pl="20px">
            {parameterList.map((parameter, idx) => {
              return (
                <ListItem key={idx}>
                  {parameter.name} - {parameter.description}
                </ListItem>
              );
            })}
          </UnorderedList>
          <Text>Request:</Text>
          <Text>{endpoint}</Text>
        </Flex>
      </Box>
    </>
  );
};

export default APIMethod;
