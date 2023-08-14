/* eslint-disable react/no-children-prop */
import { useState } from "react";

import { Flex } from "@chakra-ui/react";

import useMoonToast from "../../hooks/useMoonToast";
import JSONUpload from "./JSONUpload";
import http from "../../utils/httpMoonstream";

const DropperV2ClaimantsUpload = ({ contractAddress }: { contractAddress: string }) => {
  const toast = useMoonToast();

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
          } catch (e: any) {
            toast(`Upload failed - ${e.message ?? "Error creating request"}`, "error");
          }
          setIsUploading(false);
        }
      };
    } catch (e) {
      console.log(e);
    }
    setIsUploading(false);
  };

  return (
    <Flex position="relative">
      <JSONUpload minW="100%" isUploading={isUploading} onDrop={onDrop} />
    </Flex>
  );
};

export default DropperV2ClaimantsUpload;
