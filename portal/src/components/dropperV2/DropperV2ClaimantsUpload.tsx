/* eslint-disable react/no-children-prop */
import { useContext, useState } from "react";

import { useQueryClient } from "react-query";
import { Flex } from "@chakra-ui/react";

import Web3Context from "../../contexts/Web3Context/context";
import useMoonToast from "../../hooks/useMoonToast";
import JSONUpload from "./JSONUpload";
import http from "../../utils/httpMoonstream";

const DropperV2ClaimantsUpload = ({ contractAddress }: { contractAddress: string }) => {
  const toast = useMoonToast();

  // const web3ctx = useContext(Web3Context);

  const [isUploading, setIsUploading] = useState(false);

  const createRequests = ({ specifications }: { specifications: any[] }) => {
    const ttl = prompt("TTL (days):");
    return http({
      method: "POST",
      url: "https://engineapi.moonstream.to/metatx/requests",
      data: {
        contract_address: contractAddress,
        ttl_days: ttl,
        specifications,
      },
    });
  };

  const onDrop = (file: any) => {
    if (!file.length) {
      return;
    }
    const fileReader = new FileReader();
    setIsUploading(true);
    try {
      fileReader.readAsText(file[0]);
      fileReader.onloadend = async (readerEvent: ProgressEvent<FileReader>) => {
        if (readerEvent?.target?.result) {
          try {
            const content = JSON.parse(readerEvent?.target?.result);
            console.log(content);
            const specifications = content.map((item: any) => {
              const { dropId, requestID, caller, blockDeadline, amount, signature, signer } = item;
              return {
                method: "claim",
                caller,
                request_id: requestID,
                parameters: { dropId, blockDeadline, amount, signature, signer },
              };
            });
            const response = await createRequests({ specifications });
            if (response.status === 200) {
              toast(`Successfully added ${response.data} requests`, "success");
            }
          } catch (e) {
            toast(`Upload failed - ${e.message ?? "Error creating request"}`, "error");
          }
          // console.log(response);
          setIsUploading(false);
        }
      };
    } catch (e) {
      console.log(e);
      setIsUploading(false);
    }
  };

  return (
    <Flex position="relative">
      <JSONUpload minW="100%" isUploading={isUploading} onDrop={onDrop} />
    </Flex>
  );
};

export default DropperV2ClaimantsUpload;
