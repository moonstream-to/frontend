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
// import { Dropper } from "../../web3/contracts/types/Dropper";
import useValidation from "../dropper/useValidation";
import EditRow from "../dropper/EditRow";

const dropperAbi = require("../../web3/abi/DropperV2.json");

const chainKeys: (keyof DropChainData)[] = ["uri"];

interface ChainDataEditSectionProps {
  chainData: any;
  address: string;
  handleError: (error: unknown) => void;
  dropId: string;
}

const DropperV2ChainDataEdit: React.FC<ChainDataEditSectionProps> = ({
  address,
  chainData,
  handleError,
  dropId,
}) => {
  const toast = useMoonToast();
  const { web3, account } = useContext(Web3Context);
  const [newChainData, setNewChainData] = useState<DropChainData>({ ...chainData });
  const [isChainDataChanged, setIsChainDataChanged] = useState(false);
  const { errors: validationErrors, validateChainData, isValid } = useValidation();
  const dropperContract = new web3.eth.Contract(dropperAbi) as any;
  dropperContract.options.address = address ?? "";

  const queryClient = useQueryClient();
  const commonMutationOptions = {
    onSuccess: () => {
      toast("Successfully updated drop", "success");
      queryClient.invalidateQueries("claimsList");
      queryClient.invalidateQueries("claimState");
    },
    onError: handleError,
  };

  const setDropURI = useMutation(
    ({ uri }: { uri: string }) =>
      dropperContract.methods.setDropUri(dropId, uri).send({ from: account }),
    commonMutationOptions,
  );

  // const setClaimSigner = useMutation(
  //   ({ signer }: { signer: string }) =>
  //     dropperContract.methods.setSignerForClaim(dropId, signer).send({ from: account }),
  //   commonMutationOptions,
  // );

  const isMutationLoading = setDropURI.isLoading; //|| setClaimSigner.isLoading;

  const handleChangeChainData = <T extends keyof DropChainData>(
    key: T,
    value: DropChainData[T],
  ) => {
    validateChainData(key, value);
    console.log(chainData);
    const updatedChainData = { ...newChainData, [key]: value };
    setNewChainData(updatedChainData);
    setIsChainDataChanged(chainKeys.some((k) => chainData[k] !== updatedChainData[k]));
  };

  const revertChainDataChanges = () => {
    setNewChainData(chainData);
    setIsChainDataChanged(false);
    chainKeys.forEach((k) => validateChainData(k, chainData[k]));
  };

  const handleSendClick = async () => {
    console.log(isValid(chainKeys), validationErrors);
    if (!isValid(chainKeys)) return;

    try {
      if (newChainData.uri !== chainData.uri) {
        await setDropURI.mutateAsync({ uri: newChainData.uri });
      }

      // if (newChainData.signer !== chainData.signer) {
      //   await setClaimSigner.mutateAsync({ signer: newChainData.signer });
      // }

      setIsChainDataChanged(false);
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <>
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
