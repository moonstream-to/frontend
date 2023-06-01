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
import { Dropper } from "../../web3/contracts/types/Dropper";
import EditRow from "./EditRow";
import useValidation from "./useValidation";
const dropperAbi = require("../../web3/abi/Dropper.json");

const chainKeys = ["signer", "uri"];

const ChainDataEditSection: React.FC<{
  chainData: DropChainData;
  claimId: string;
  address: string;
  handleError: (error: unknown) => void;
}> = ({ address, chainData, claimId, handleError }) => {
  const toast = useMoonToast();
  const ctx = useContext(Web3Context);
  const [newChainData, setNewChainData] = useState<DropChainData>(chainData);
  const [isChainDataChanged, setIsChainDataChanged] = useState(false);
  const { errors: validationErrors, validateChainData, isValid } = useValidation(ctx);
  const dropperContract = new ctx.web3.eth.Contract(dropperAbi) as unknown as Dropper;
  dropperContract.options.address = address ?? "";

  const queryClient = useQueryClient();
  const commonProps = {
    onSuccess: () => {
      toast("Successfully updated drop", "success");
      queryClient.invalidateQueries("claimsList");
      queryClient.invalidateQueries("claimState");
    },
    onError: handleError,
  };

  const setClaimURI = useMutation(
    ({ uri }: { uri: string }) =>
      dropperContract.methods.setClaimUri(claimId ?? "", uri).send({ from: ctx.account }),
    { ...commonProps },
  );

  const setClaimSigner = useMutation(
    ({ signer }: { signer: string }) =>
      dropperContract.methods.setSignerForClaim(claimId ?? "", signer).send({ from: ctx.account }),
    { ...commonProps },
  );

  const isMutationLoading = setClaimURI.isLoading || setClaimSigner.isLoading;

  const handleChangeChainData = <T extends keyof DropChainData>(
    key: T,
    value: DropChainData[T],
  ) => {
    validateChainData(key, value);
    const newChainDataTemp = { ...newChainData, [key]: value };
    setNewChainData(newChainDataTemp);
    setIsChainDataChanged(
      Object.keys(chainData).some(
        (k) => chainData[k as keyof DropChainData] !== newChainDataTemp[k as keyof DropChainData],
      ),
    );
  };

  const revertChainDataChanges = () => {
    setNewChainData(chainData);
    setIsChainDataChanged(false);
    (chainKeys as Array<keyof DropChainData>).forEach((k) => validateChainData(k, chainData[k]));
  };

  const handleSendClick = async () => {
    if (!isValid(chainKeys)) return;
    try {
      if (newChainData.uri !== chainData.uri) {
        await setClaimURI.mutateAsync({ uri: newChainData.uri });
      }

      if (newChainData.signer !== chainData.signer) {
        await setClaimSigner.mutateAsync({ signer: newChainData.signer });
      }
      setIsChainDataChanged(false);
    } catch (error: unknown) {
      handleError(error);
    }
  };

  return (
    <>
      <EditRow
        title="Signer:"
        onChange={(e) => handleChangeChainData("signer", e.target.value)}
        value={newChainData.signer}
        validationError={validationErrors["signer"]}
      />
      <EditRow
        title="Metadata uri:"
        onChange={(e) => handleChangeChainData("uri", e.target.value)}
        value={newChainData.uri}
        validationError={validationErrors["uri"]}
      />
      <Flex justifyContent="end" gap="15px" alignItems="center">
        <IconButton
          aria-label=""
          icon={<AiOutlineUndo />}
          variant="cancelButton"
          mb="15px"
          disabled={!isChainDataChanged || isMutationLoading}
          onClick={revertChainDataChanges}
        />
        <Button
          variant="saveButton"
          mb="15px"
          disabled={!isChainDataChanged || isMutationLoading}
          onClick={handleSendClick}
          w="200px"
        >
          {isMutationLoading ? <Spinner /> : "Send"}
        </Button>
      </Flex>
    </>
  );
};

export default ChainDataEditSection;
