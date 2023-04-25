import { Button, Flex, Image, Text } from "@chakra-ui/react";
import dynamic from "next/dynamic";

import { AWS_ASSETS_PATH } from "../../constants";

const icons = {
  download: `${AWS_ASSETS_PATH}/icons/file-down.png`,
};

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

const QueryAPIResult = ({
  result,
  filename,
  status,
}: {
  result: string;
  filename: string;
  status: string;
}) => {
  return (
    <Flex
      direction="column"
      gap="20px"
      p="20px"
      bg="#232323"
      border="1px solid #4d4d4d"
      borderRadius="10px"
    >
      <Flex justifyContent="space-between" alignItems="center" fontSize="16px" p="0">
        {result && (
          <Text fontWeight="700" p="0px">
            JSON
          </Text>
        )}
        <Text fontWeight="400" color="#bfbfbf">
          {status}
        </Text>
        {result && (
          <Button variant="transparent" onClick={() => download(filename, result)} p="0px" h="16px">
            <Text fontWeight="400">Download</Text>
            <Image alt="" src={icons.download} h="16px" ml="10px" />
          </Button>
        )}
      </Flex>
      {result && <MyJsonComponent json={result} readOnly={true} />}
    </Flex>
  );
};

export default QueryAPIResult;
