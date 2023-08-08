import React from "react";
import { Box, Spinner, chakra, Container, Text, Flex, Icon, Image } from "@chakra-ui/react";
import { useDropzone } from "react-dropzone";
import { AiOutlineCloudUpload } from "react-icons/ai";

import { AWS_ASSETS_PATH } from "../../constants";

const baseStyle = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderWidth: "2px",
  borderRadius: "5px",
  borderColor: "#bfbfbf",
  borderStyle: "dashed",
  backgroundColor: "#4d4d4d",
  color: "white",
  outline: "none",
  transition: "border .24s ease-in-out",
  cursor: "pointer",
};

const focusedStyle = {
  // borderColor: "#219aa3",
};

const acceptStyle = {
  borderColor: "#f56646",
  backgroundColor: "#90574a",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

function JSONUpload({ isUploading, onDrop, ...props }) {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    accept: {
      "text/json": [".json"],
    },
    onDrop,
  });

  const style = React.useMemo(
    () => ({
      ...baseStyle,
      ...(isFocused ? focusedStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isFocused, isDragAccept, isDragReject],
  );

  return (
    <Container
      {...props}
      minH="50px"
      w="100%"
      m="0"
      p="0"
      alignItems={"center"}
      pointerEvents={isUploading ? "none" : "all"}
    >
      <Box h={[null, null, "105px"]} {...getRootProps({ style })} justifyContent="center">
        {isUploading ? (
          <Spinner speed="1s" size="md" p="0" m="0" />
        ) : (
          <Flex w="100%" alignItems="center" gap="20px" justifyContent="space-between" px="30px">
            <input {...getInputProps()} />
            <Flex gap="20px">
              <Icon as={AiOutlineCloudUpload} w="30px" h="30px" />
              <Flex direction="column">
                <Text>Upload a JSON file</Text>
                <Text>{"[ {dropId, requestID, blockDeadline, amount, signer, signature} ]"}</Text>
              </Flex>
            </Flex>
            {/* <Image src={`${AWS_ASSETS_PATH}/csv-dropper-example.png`} alt="" w="153px" h="70px" /> */}
          </Flex>
        )}
      </Box>
    </Container>
  );
}

export default chakra(JSONUpload);
