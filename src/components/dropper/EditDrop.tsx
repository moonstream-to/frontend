/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Box, IconButton, Spinner } from "@chakra-ui/react";

import Web3Context from "../../contexts/Web3Context/context";
import { Dropper } from "../../web3/contracts/types/Dropper";
const dropperAbi = require("../../web3/abi/Dropper.json");
import useMoonToast from "../../hooks/useMoonToast";
import { Button, Flex, Text } from "@chakra-ui/react";
import { AiOutlineUndo } from "react-icons/ai";
import ClaimButton from "../ClaimButton";
import TimestampInput from "../TimestampInput";
import { DropChainData, DropDBData, EditDropProps } from "../../types";
import EditRow from "./EditRow";
import { useClaimUpdate } from "./useClaimUpdate";
import useValidation from "./useValidation";

const dbKeys = ["terminusAddress", "terminusPoolId", "deadline"];
const chainKeys = ["signer", "uri"];

const EditDrop: React.FC<EditDropProps> = ({ dbData, chainData, address, claimId }) => {
  const [newDBData, setNewDBData] = useState<DropDBData>(dbData);
  const [newChainData, setNewChainData] = useState<DropChainData>(chainData);
  const [isDBDataChanged, setIsDBDataChanged] = useState(false);
  const [isChainDataChanged, setIsChainDataChanged] = useState(false);
  const [childKey, setChildKey] = useState(Date.now());

  const toast = useMoonToast();
  const ctx = useContext(Web3Context);
  const { errors: validationErrors, validateChainData, validateDBData } = useValidation(ctx);
  const updateClaim = useClaimUpdate();

  const dropperContract = new ctx.web3.eth.Contract(dropperAbi) as unknown as Dropper;
  dropperContract.options.address = address ?? "";

  const queryClient = useQueryClient();
  const handleError = (e: unknown) => {
    if (e instanceof Error) {
      toast(e.message, "error");
    } else {
      toast("An error occurred", "error");
    }
  };

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
    {
      ...commonProps,
    },
  );

  const setClaimSigner = useMutation(
    ({ signer }: { signer: string }) =>
      dropperContract.methods.setSignerForClaim(claimId ?? "", signer).send({ from: ctx.account }),
    { ...commonProps },
  );

  const isMutationLoading = setClaimURI.isLoading || setClaimSigner.isLoading;

  const isValid = (keys: string[]) => {
    let inputsAreValid = true;
    keys.forEach((k) => {
      if (validationErrors[k]) {
        toast(validationErrors[k], "error");
        inputsAreValid = false;
      }
    });
    return inputsAreValid;
  };

  const handleSaveClick = () => {
    if (!isValid(dbKeys)) return;
    updateClaim.mutate(newDBData, {
      onSuccess: () => {
        queryClient.invalidateQueries("claimAdmin");
        setIsDBDataChanged(false);
        toast("Updated drop info", "success");
      },
      onError: handleError,
    });
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

  const handleChangeDBData = <T extends keyof DropDBData>(key: T, value: DropDBData[T]) => {
    validateDBData(key, value);
    const newDBDataTemp = { ...newDBData, [key]: value };
    setNewDBData(newDBDataTemp);
    setIsDBDataChanged(
      Object.keys(dbData).some(
        (k) => dbData[k as keyof DropDBData] !== newDBDataTemp[k as keyof DropDBData],
      ),
    );
  };

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

  const revertDBDataChanges = () => {
    setNewDBData(dbData);
    setChildKey(Date.now());
    setIsDBDataChanged(false);
    (dbKeys as Array<keyof DropDBData>).forEach((k) => validateDBData(k, dbData[k]));
  };

  const revertChainDataChanges = () => {
    setNewChainData(chainData);
    setIsChainDataChanged(false);
    (chainKeys as Array<keyof DropChainData>).forEach((k) => validateChainData(k, chainData[k]));
  };

  return (
    <Flex direction="column" gap="10px" p={5} borderRadius="10px" bg="#232323">
      <Flex justifyContent="end" mb="10px">
        <ClaimButton dropState={{ id: dbData.claimUUID, active: dbData.active }} />
      </Flex>
      <EditRow
        title="Terminus address:"
        onChange={(e) => handleChangeDBData("terminusAddress", e.target.value)}
        value={newDBData.terminusAddress}
        validationError={validationErrors["terminusAddress"]}
      />
      <EditRow
        title="Terminus pool ID:"
        onChange={(e) => handleChangeDBData("terminusPoolId", e.target.value)}
        value={newDBData.terminusPoolId}
        validationError={validationErrors["terminusPoolId"]}
      />
      <Flex justifyContent="space-between" alignItems="center">
        <Text>deadline</Text>
        <Box w="50ch">
          <TimestampInput
            key={childKey}
            timestamp={newDBData.deadline}
            setTimestamp={(newValue: string) => handleChangeDBData("deadline", String(newValue))}
          />
        </Box>
      </Flex>
      <Flex justifyContent="end" gap="15px" alignItems="center">
        <IconButton
          aria-label=""
          icon={<AiOutlineUndo />}
          variant="cancelButton"
          mb="15px"
          disabled={!isDBDataChanged || updateClaim.isLoading}
          onClick={revertDBDataChanges}
        />
        <Button
          variant="saveButton"
          alignSelf="end"
          mb="15px"
          w="200px"
          disabled={!isDBDataChanged || updateClaim.isLoading}
          onClick={handleSaveClick}
        >
          {updateClaim.isLoading ? <Spinner /> : "Save"}
        </Button>
      </Flex>
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
    </Flex>
  );
};

export default EditDrop;
