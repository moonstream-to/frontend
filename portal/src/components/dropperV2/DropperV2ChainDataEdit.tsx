/* eslint-disable @typescript-eslint/no-var-requires */

import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Button, IconButton } from "@chakra-ui/button";
import { Flex } from "@chakra-ui/layout";
import { Spinner } from "@chakra-ui/spinner";
import { AiOutlineUndo } from "react-icons/ai";

import Web3Context from "../../contexts/Web3Context/context";
import useMoonToast from "../../hooks/useMoonToast";
import { DropChainData } from "../../types";
import useValidation from "../dropper/useValidation";
import EditRow from "../dropper/EditRow";
import ActivateDropButton from "./ActivateDropButton";

const dropperAbi = require("../../web3/abi/DropperV2.json");

const chainKeys: (keyof DropV2ChainData)[] = ["uri", "terminusAddress", "poolId"];

interface ChainDataEditSectionProps {
  chainData: any;
  address: string;
  handleError: (error: unknown) => void;
  dropId: string;
}

export type DropV2ChainData = {
  uri: string;
  terminusAddress: string;
  poolId: string;
  dropStatus: boolean;
};

const DropperV2ChainDataEdit: React.FC<ChainDataEditSectionProps> = ({
  address,
  chainData,
  handleError,
  dropId,
}) => {
  const toast = useMoonToast();
  const { web3, account } = useContext(Web3Context);
  const [newChainData, setNewChainData] = useState<DropV2ChainData>({ ...chainData });
  const [isChainDataChanged, setIsChainDataChanged] = useState(false);
  const { errors: validationErrors, validateChainDataV2, isValid } = useValidation();
  const dropperContract = new web3.eth.Contract(dropperAbi) as any;
  dropperContract.options.address = address ?? "";

  const queryClient = useQueryClient();
  const commonMutationOptions = {
    onSuccess: () => {
      toast("Successfully updated drop", "success");
      queryClient.invalidateQueries("dropsList");
      queryClient.invalidateQueries("dropState");
    },
    onError: handleError,
  };

  const setDropURI = useMutation(
    ({ uri }: { uri: string }) =>
      dropperContract.methods
        .setDropUri(dropId, uri)
        .send({ from: account, maxPriorityFeePerGas: null, maxFeePerGas: null }),
    commonMutationOptions,
  );

  const setDropAuthorization = useMutation(
    ({ terminusAddress, poolId }: { terminusAddress: string; poolId: number }) =>
      dropperContract.methods
        .setDropAuthorization(dropId, terminusAddress, poolId)
        .send({ from: account, maxPriorityFeePerGas: null, maxFeePerGas: null }),
    commonMutationOptions,
  );

  const isMutationLoading = setDropURI.isLoading || setDropAuthorization.isLoading;

  const handleChangeChainData = <T extends keyof DropV2ChainData>(
    key: T,
    value: DropV2ChainData[T],
  ) => {
    validateChainDataV2(key, value);
    const updatedChainData = { ...newChainData, [key]: value };
    setNewChainData(updatedChainData);
    setIsChainDataChanged(chainKeys.some((k) => chainData[k] !== updatedChainData[k]));
  };

  const revertChainDataChanges = () => {
    setNewChainData(chainData);
    setIsChainDataChanged(false);
    chainKeys.forEach((k) => validateChainDataV2(k, chainData[k]));
  };

  const handleSendClick = async () => {
    if (!isValid(chainKeys)) return;

    try {
      if (newChainData.uri !== chainData.uri) {
        await setDropURI.mutateAsync({ uri: newChainData.uri });
      }
      if (
        newChainData.terminusAddress !== chainData.terminusAddress ||
        newChainData.poolId !== chainData.poolId
      ) {
        await setDropAuthorization.mutateAsync({
          terminusAddress: newChainData.terminusAddress,
          poolId: Number(newChainData.poolId),
        });
      }

      setIsChainDataChanged(false);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
      <Flex justifyContent="end" mb="10px">
        <ActivateDropButton
          dropState={{ active: chainData.active, dropId }}
          handleError={handleError}
          dropperContract={dropperContract}
          account={account}
        />
      </Flex>
      {chainKeys.map((key) => (
        <EditRow
          key={key}
          title={`${key.charAt(0).toUpperCase() + key.slice(1)}:`}
          onChange={(e) => handleChangeChainData(key, e.target.value)}
          value={newChainData[key]}
          validationError={validationErrors[key]}
        />
      ))}
      <Flex justifyContent="end" gap="15px" alignItems="center">
        <IconButton
          aria-label=""
          icon={<AiOutlineUndo />}
          variant="cancelButton"
          mb="15px"
          isDisabled={!isChainDataChanged || isMutationLoading}
          onClick={revertChainDataChanges}
        />
        <Button
          variant="saveButton"
          mb="15px"
          isDisabled={!isChainDataChanged || isMutationLoading}
          onClick={handleSendClick}
          w="200px"
        >
          {isMutationLoading ? <Spinner /> : "Send"}
        </Button>
      </Flex>
    </>
  );
};

export default DropperV2ChainDataEdit;
