import dynamic from "next/dynamic";

import { Button, Flex, Image, Spinner, Text } from "@chakra-ui/react";

import { AWS_ASSETS_PATH } from "../../constants";
import useMoonToast from "../../hooks/useMoonToast";

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
  onCancel,
}: {
  result: string;
  filename: string;
  status: string;
  onCancel: () => void;
}) => {
  const toast = useMoonToast();
  const handleSave = () => {
    try {
      const rawJSON = JSON.stringify(JSON.parse(result));
      download(filename, rawJSON);
    } catch (e) {
      console.log(e);
      toast("Error saving file", "error");
    }
  };

  return (
    <Flex
      direction="column"
      gap="20px"
      p="20px"
      bg="#232323"
      border="1px solid #4d4d4d"
      borderRadius="10px"
    >
      <Flex justifyContent="space-between" gap="10px" alignItems="center" fontSize="16px" p="0">
        {result && (
          <Text fontWeight="700" p="0px">
            JSON
          </Text>
        )}
        <Text>{status}</Text>
        {(status === "executing..." || status === "uploading...") && <Spinner w="20px" h="20px" />}
        {status === "uploading..." && (
          <Button variant="cancelButton" maxH="24px" fontSize="14px" onClick={() => onCancel()}>
            Cancel
          </Button>
        )}
        {result && (
          <Button variant="transparent" onClick={handleSave} p="0px" h="16px">
            <Text fontWeight="400">Save</Text>
            <Image alt="" src={icons.download} h="16px" ml="10px" />
          </Button>
        )}
      </Flex>
      {result && <MyJsonComponent json={result} readOnly={true} />}
    </Flex>
  );
};

export default QueryAPIResult;
