/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Box, IconButton, Spinner } from "@chakra-ui/react";

import Web3Context from "../../contexts/Web3Context/context";
import { Dropper } from "../../web3/contracts/types/Dropper";
const dropperAbi = require("../../web3/abi/Dropper.json");
import useMoonToast from "../../hooks/useMoonToast";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { AiOutlineUndo } from "react-icons/ai";
import { UpdateClaim } from "../../types/Moonstream";
import { patchHttp } from "../../utils/http";
import ClaimButton from "../ClaimButton";
import TimestampInput from "../TimestampInput";
import { balanceOfAddress } from "../../web3/contracts/terminus.contracts";

type DBData = {
  active: boolean;
  terminusAddress: string;
  terminusPoolId: string;
  deadline: string;
  claimUUID: string;
};

type ChainData = {
  uri: string;
  signer: string;
};

type EditDropProps = {
  dbData: DBData;
  chainData: ChainData;
  address: string;
  claimId: string;
};

const EditRow = ({
  title,
  onChange,
  value,
  validationError,
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  value: string;
  validationError: string;
}) => {
  return (
    <Flex justifyContent="space-between" alignItems="center">
      <Text>{title}</Text>
      <Input
        w="50ch"
        fontSize="16px"
        type="text"
        variant="address"
        value={value}
        onChange={onChange}
        borderColor={!validationError || !value ? "#4d4d4d" : "error.500"}
      />
    </Flex>
  );
};

const EditDrop: React.FC<EditDropProps> = ({ dbData, chainData, address, claimId }) => {
  const [newDBData, setNewDBData] = useState<DBData>(dbData);
  const [newChainData, setNewChainData] = useState<ChainData>(chainData);
  const [isDBDataChanged, setIsDBDataChanged] = useState(false);
  const [isChainDataChanged, setIsChainDataChanged] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [childKey, setChildKey] = useState(Date.now());

  const toast = useMoonToast();
  const ctx = useContext(Web3Context);

  const dropperContract = new ctx.web3.eth.Contract(dropperAbi) as any as Dropper;
  dropperContract.options.address = address ?? "";

  const queryClient = useQueryClient();
  const commonProps = {
    onSuccess: () => {
      toast("Successfully updated drop", "success");
      queryClient.invalidateQueries("claimsList");
      queryClient.invalidateQueries("claimState");
    },
    onError: (e: Error) => {
      toast(e.message, "error");
    },
  };

  const dbKeys = ["terminusAddress", "terminusPoolId", "deadline"];

  const update = useMutation(
    async (data: DBData) => {
      let inputsAreValid = true;
      dbKeys.forEach((k) => {
        if (validationErrors[k]) {
          toast(validationErrors[k], "error");
          inputsAreValid = false;
        }
      });
      if (!inputsAreValid) {
        throw new Error("");
      }
      const patchData: UpdateClaim = {
        claim_block_deadline: data.deadline,
        terminus_address: data.terminusAddress,
        terminus_pool_id: data.terminusPoolId,
      };
      const balance = await balanceOfAddress(
        ctx.account,
        data.terminusAddress,
        Number(data.terminusPoolId),
        ctx,
      )();
      if (Number(balance) <= 0) {
        const confirmation = window.confirm("Balance is 0 or less. Do you want to proceed?");

        if (!confirmation) {
          throw new Error("User cancelled operation due to low balance.");
        }
      }
      if (dbData.claimUUID && Number(balance) === -1)
        return patchHttp(`/admin/drops/${dbData.claimUUID}`, { ...patchData });
      else throw new Error("Cannot use update without claimid");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("claimAdmin");
        setIsDBDataChanged(false);
        toast("Updated drop info", "success");
      },
      onError: (e: Error) => {
        if (e.message) toast(e.message, "error");
      },
    },
  );

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

  const handleSendClick = async () => {
    try {
      if (newChainData.uri !== chainData.uri) {
        if (validationErrors["uri"]) {
          throw new Error(validationErrors["uri"]);
        }
        await setClaimURI.mutateAsync({ uri: newChainData.uri });
      }

      if (newChainData.signer !== chainData.signer) {
        if (validationErrors["signer"]) {
          throw new Error(validationErrors["signer"]);
        }
        await setClaimSigner.mutateAsync({ signer: newChainData.signer });
      }

      // Reset state after successful mutations
      setIsChainDataChanged(false);
    } catch (error: any) {
      toast(error.message, "error");
    }
  };

  const handleChangeDBData = <T extends keyof DBData>(key: T, value: DBData[T]) => {
    const valueString = value as unknown as string;
    let errorMessage: string;
    switch (key) {
      case "terminusAddress":
        errorMessage = ctx.web3.utils.isAddress(valueString) ? "" : "Invalid Ethereum address";
        break;
      case "terminusPoolId":
        errorMessage = Number.isInteger(Number(valueString)) ? "" : "Pool ID should be an integer";
        break;
      case "deadline":
        const dateFromTimestamp = new Date(Number(valueString) * 1000);
        const isValidTimestamp = !isNaN(dateFromTimestamp.getTime());
        errorMessage = isValidTimestamp ? "" : "Invalid timestamp";
        break;
      default:
        break;
    }
    setValidationErrors((errors) => ({ ...errors, [key]: errorMessage }));

    const newDBDataTemp = { ...newDBData, [key]: value };
    setNewDBData(newDBDataTemp);
    setIsDBDataChanged(
      Object.keys(dbData).some(
        (k) => dbData[k as keyof DBData] !== newDBDataTemp[k as keyof DBData],
      ),
    );
  };

  const handleChangeChainData = <T extends keyof ChainData>(key: T, value: ChainData[T]) => {
    const valueString = value as unknown as string;
    let errorMessage: string;
    switch (key) {
      case "signer":
        errorMessage = ctx.web3.utils.isAddress(valueString) ? "" : "Invalid Ethereum address";
        break;
      case "uri":
        errorMessage = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm.test(valueString)
          ? ""
          : "Invalid URL";
        break;
      default:
        break;
    }
    setValidationErrors((errors) => ({ ...errors, [key]: errorMessage }));

    const newChainDataTemp = { ...newChainData, [key]: value };
    setNewChainData(newChainDataTemp);
    setIsChainDataChanged(
      Object.keys(chainData).some(
        (k) => chainData[k as keyof ChainData] !== newChainDataTemp[k as keyof ChainData],
      ),
    );
  };

  const revertDBDataChanges = () => {
    setNewDBData(dbData);
    setChildKey(Date.now());
    setIsDBDataChanged(false);
  };

  const revertChainDataChanges = () => {
    setNewChainData(chainData);
    setIsChainDataChanged(false);
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
          disabled={!isDBDataChanged || update.isLoading}
          onClick={revertDBDataChanges}
        />
        <Button
          variant="saveButton"
          alignSelf="end"
          mb="15px"
          w="200px"
          disabled={!isDBDataChanged || update.isLoading}
          onClick={() => update.mutate(newDBData)}
        >
          {update.isLoading ? <Spinner /> : "Save"}
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
