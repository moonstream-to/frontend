/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { IconButton, Spinner } from "@chakra-ui/react";

import Web3Context from "../../contexts/Web3Context/context";
import { Dropper } from "../../web3/contracts/types/Dropper";
const dropperAbi = require("../../web3/abi/Dropper.json");
import useMoonToast from "../../hooks/useMoonToast";
import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { AiOutlineUndo } from "react-icons/ai";
import { UpdateClaim } from "../../types/Moonstream";
import { patchHttp } from "../../utils/http";
import ClaimButton from "../ClaimButton";

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
}: {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  title: string;
  value: string;
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
      />
    </Flex>
  );
};

const EditDrop: React.FC<EditDropProps> = ({ dbData, chainData, address, claimId }) => {
  const [newDBData, setNewDBData] = useState<DBData>(dbData);
  const [newChainData, setNewChainData] = useState<ChainData>(chainData);
  const [isDBDataChanged, setIsDBDataChanged] = useState(false);
  const [isChainDataChanged, setIsChainDataChanged] = useState(false);

  const toast = useMoonToast();
  const ctx = useContext(Web3Context);

  const dropperContract = new ctx.web3.eth.Contract(dropperAbi) as any as Dropper;
  dropperContract.options.address = address ?? "";

  const queryClient = useQueryClient();
  const commonProps = {
    onSuccess: () => {
      toast("Successfully updated contract", "success");
      queryClient.invalidateQueries("dropperContract");
    },
    onError: (e: Error) => {
      toast(e.message, "error");
    },
  };

  const update = useMutation(
    (data: DBData) => {
      const patchData: UpdateClaim = {
        claim_block_deadline: data.deadline,
        terminus_address: data.terminusAddress,
        terminus_pool_id: data.terminusPoolId,
      };
      console.log(dbData.claimUUID);
      if (dbData.claimUUID) return patchHttp(`/admin/drops/${dbData.claimUUID}`, { ...patchData });
      else throw new Error("Cannot use update without claimid");
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("dropperContract");
        setIsDBDataChanged(false);
        toast("Updated drop info", "success");
      },
      onError: (e: Error) => {
        toast(e.message, "error");
      },
    },
  );

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

  const handleSendClick = async () => {
    try {
      if (newChainData.uri !== chainData.uri) {
        await setClaimURI.mutateAsync({ uri: newChainData.uri });
      }

      if (newChainData.signer !== chainData.signer) {
        await setClaimSigner.mutateAsync({ signer: newChainData.signer });
      }

      // Reset state after successful mutations
      setIsChainDataChanged(false);
    } catch (error: any) {
      toast(error.message, "error");
    }
  };

  const handleChangeDBData = <T extends keyof DBData>(key: T, value: DBData[T]) => {
    const newDBDataTemp = { ...newDBData, [key]: value };
    setNewDBData(newDBDataTemp);
    setIsDBDataChanged(
      Object.keys(dbData).some(
        (k) => dbData[k as keyof DBData] !== newDBDataTemp[k as keyof DBData],
      ),
    );
  };

  const handleChangeChainData = <T extends keyof ChainData>(key: T, value: ChainData[T]) => {
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
      />
      <EditRow
        title="Terminus pool ID:"
        onChange={(e) => handleChangeDBData("terminusPoolId", e.target.value)}
        value={newDBData.terminusPoolId}
      />
      <EditRow
        title="Deadline:"
        onChange={(e) => handleChangeDBData("deadline", e.target.value)}
        value={newDBData.deadline}
      />
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
      />
      <EditRow
        title="Metadata uri:"
        onChange={(e) => handleChangeChainData("uri", e.target.value)}
        value={newChainData.uri}
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
