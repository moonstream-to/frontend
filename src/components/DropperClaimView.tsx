/* eslint-disable @typescript-eslint/no-var-requires */
import { useContext, useEffect, useState } from "react";

import { useQuery } from "react-query";
import { Spinner } from "@chakra-ui/react";
import { Flex, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import remarkGfm from "remark-gfm";

import ClaimantsView from "./ClaimantsView";
import Web3Context from "../contexts/Web3Context/context";
import useDrops from "../hooks/useDrops";
import queryCacheProps from "../hooks/hookCommon";
import { PORTAL_PATH } from "../constants";
const dropperAbi = require("../web3/abi/Dropper.json");
import { Dropper } from "../web3/contracts/types/Dropper";
import DropData from "./dropper/DropData";
import DropHeader from "./dropper/DropHeader";
import EditDrop from "./dropper/EditDrop";

const DropperClaimView = ({
  address,
  claimId,
  metadata,
}: {
  address: string;
  claimId: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  metadata: any;
}) => {
  const { chainId, web3 } = useContext(Web3Context);

  const [isEdit, setIsEdit] = useState(true);

  const headerMeta = ["name", "description", "image", "attributes"];
  const web3ctx = useContext(Web3Context);

  const { adminClaims } = useDrops({
    dropperAddress: address,
    ctx: web3ctx,
  });

  useEffect(() => {
    adminClaims.refetch();
  }, [address, web3ctx.account]);

  const [dropState, setDropState] = useState<
    | {
        deadline: string;
        id: string;
        terminusAddress: string;
        terminusPoolId: string;
        active: boolean;
      }
    | undefined
  >(undefined);

  useEffect(() => {
    if (adminClaims.data) {
      const claimState = adminClaims.data.find(
        (claim: { drop_number: number }) => claim.drop_number === Number(claimId),
      );
      if (claimState) {
        const {
          id,
          claim_block_deadline: deadline,
          terminus_address: terminusAddress,
          terminus_pool_id: terminusPoolId,
          active,
        } = claimState;
        setDropState({
          id,
          terminusAddress,
          terminusPoolId,
          deadline,
          active,
        });
      } else {
        setDropState(undefined);
      }
    }
  }, [adminClaims.data, claimId]);

  const dropTypes = new Map<string, string>([
    ["20", "ERC20"],
    ["721", "ERC721"],
    ["1155", "ERC1155"],
    ["1", "Mint Terminus"],
  ]);

  const claimState = useQuery(
    ["claimState", address, claimId, chainId],
    async () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dropperContract = new web3.eth.Contract(dropperAbi) as any as Dropper;
      dropperContract.options.address = address ?? "";
      const claim = await dropperContract.methods.getClaim(claimId).call();
      const claimUri = await dropperContract.methods.claimUri(claimId).call(); //TODO take from ClaimsList
      const signer = await dropperContract.methods.getSignerForClaim(claimId).call(); //TODO MULTICALL?
      const dropType = dropTypes.get(claim[3]) ?? "undefined";
      return { claim, claimUri, signer, dropType };
    },
    {
      ...queryCacheProps,
      retry: false,
      enabled: Number(claimId) > 0 && !!address,
      // onSuccess: () => {}, //TODO
    },
  );

  if (Number(claimId) < 1) {
    return <></>;
  }

  return (
    <Flex
      id="claimView"
      bg="#2d2d2d"
      minW="800px"
      borderRadius="20px"
      p="30px"
      pb="0"
      color="white"
      direction="column"
      maxW="800px"
      position="relative"
    >
      <DropHeader address={address} claimId={claimId} PORTAL_PATH={PORTAL_PATH} />

      {!!claimState.data && (
        <>
          {metadata?.name && (
            <Text fontWeight="700" fontSize="24px" mb="20px">
              {metadata.name}
            </Text>
          )}
          <Flex direction="column" gap="20px" overflowY="auto" id="claim-content">
            <Flex gap="20px">
              {metadata?.image && (
                <Image
                  w="140px"
                  h="140px"
                  borderRadius="20px"
                  border="1px solid #4d4d4d"
                  src={metadata.image}
                  alt="image"
                />
              )}
              {metadata?.description && (
                <ReactMarkdown className="markdown" remarkPlugins={[remarkGfm]}>
                  {metadata.description}
                </ReactMarkdown>
              )}
            </Flex>
            {dropState && claimState.data && isEdit && (
              <EditDrop
                address={address}
                claimId={claimId}
                dbData={{
                  terminusAddress: dropState.terminusAddress,
                  terminusPoolId: dropState.terminusPoolId,
                  active: dropState.active,
                  deadline: String(dropState.deadline),
                  claimUUID: dropState.id,
                }}
                chainData={{
                  uri: claimState.data.claimUri,
                  signer: claimState.data.signer,
                }}
              />
            )}
            {claimState.data?.claim && !isEdit && (
              <DropData
                metadata={metadata}
                claimState={claimState}
                dropState={dropState}
                excludeFields={headerMeta}
                PORTAL_PATH={PORTAL_PATH}
              />
            )}
            {dropState && !isEdit && <ClaimantsView claimId={dropState.id} />}
          </Flex>
        </>
      )}
      {claimState.isLoading && (
        <Flex alignItems="center" justifyContent="center" h="100%">
          <Spinner h="50px" w="50px" />
        </Flex>
      )}
    </Flex>
  );
};

export default DropperClaimView;
