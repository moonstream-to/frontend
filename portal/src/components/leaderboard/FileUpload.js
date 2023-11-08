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

function FileUpload({ isUploading, onDrop, ...props }) {
  const { getRootProps, getInputProps, isFocused, isDragAccept, isDragReject } = useDropzone({
    accept: {
      "text/csv": [".csv"],
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
      <Box h={[null, null, "275px"]} {...getRootProps({ style })} justifyContent="center">
        {isUploading ? (
          <Spinner speed="1s" size="md" p="0" m="0" />
        ) : (
          <Flex
            w="100%"
            alignItems="center"
            gap="20px"
            justifyContent="space-between"
            flexDirection="column"
          >
            <input {...getInputProps()} />
            <Flex>
              <Icon as={AiOutlineCloudUpload} w="30px" h="30px" pr="10px" />
              <Text>{`Upload a CSV or JSON file of addresses and scores`}</Text>
            </Flex>
            <Flex gap="20px" alignItems="center">
              <Box textAlign="center">
                <Text>CSV</Text>
                <Image
                  src={`${AWS_ASSETS_PATH}/leaderboard/csv-example.png`}
                  alt="CSV sample upload"
                  w="150px"
                  h="50px"
                />
              </Box>
              <Box textAlign="center">
                <Text>JSON</Text>
                <Image
                  src={`${AWS_ASSETS_PATH}/leaderboard/json-example.png`}
                  alt="JSON sample upload"
                  w="150px"
                  h="150px"
                />
              </Box>
            </Flex>
          </Flex>
        )}
      </Box>
    </Container>
  );
}

export default chakra(FileUpload);
