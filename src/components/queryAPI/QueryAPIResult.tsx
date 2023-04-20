import { Button, Flex, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";

const MyJsonComponent = dynamic(() => import("../JSONEdit2"), { ssr: false });

function download(filename: string, text: string) {
  const element = document.createElement("a");
  element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

const QueryAPIResult = ({ result, filename }: { result: string; filename: string }) => {
  return (
    <Flex
      direction="column"
      gap="20px"
      p="20px"
      bg="#232323"
      border="1px solid #4d4d4d"
      borderRadius="10px"
    >
      <Flex justifyContent="space-between" alignItems="center" fontSize="16px">
        <Text fontWeight="700">JSON</Text>
        <Button variant="transparent" onClick={() => download(filename, result)}>
          <Text fontWeight="400">Download</Text>
        </Button>
      </Flex>
      <MyJsonComponent json={result} readOnly={true} />
      {/* <Text
        fontSize="14px"
        bg="#2d2d2d"
        border="1px solid #353535"
        borderRadius="5px"
        overflow="auto"
      >
        {result}
      </Text> */}
    </Flex>
  );
};

export default QueryAPIResult;
