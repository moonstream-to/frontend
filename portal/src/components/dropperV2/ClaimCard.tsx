import { Request } from "./ClaimView";
import { Flex, Spinner, Text } from "@chakra-ui/react";
import PoolDetailsRow from "../PoolDetailsRow";
import { useMutation, useQueryClient } from "react-query";
import Web3Context from "../../contexts/Web3Context/context";
import { useContext } from "react";
import http from "../../utils/httpMoonstream";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const dropperAbi = require("../../web3/abi/DropperV2.json");
import styles from "./SigningAccountView.module.css";

const ClaimCard = ({
  request,
  isClaimed,
  currentBlock,
  dropperAddress,
}: {
  request: Request;
  isClaimed: boolean;
  currentBlock: number | undefined;
  dropperAddress: string;
}) => {
  const { account, web3 } = useContext(Web3Context);
  const dropperContract = new web3.eth.Contract(dropperAbi);
  dropperContract.options.address = dropperAddress ?? "";
  const humanReadableInterval = (dateString: string) => {
    const inputDate = new Date(dateString).getTime();
    const currentDate = new Date().getTime();

    // Calculate the difference in milliseconds
    let diff = currentDate - inputDate;

    const isPast = diff >= 0;
    diff = Math.abs(diff);

    // Convert milliseconds to minutes, hours, and days
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const daysString = days > 0 ? `${days}D, ` : "";

    // Get the remaining hours and minutes after subtracting days
    const remainingHours = hours % 24;
    const hoursString = remainingHours > 0 || days > 0 ? `${remainingHours}H, ` : "";
    const remainingMinutes = minutes % 60;

    // Construct the result string
    let result = `${daysString}${hoursString}${remainingMinutes}m`;
    if (isPast) {
      result += " ago";
    } else {
      result = "in " + result;
    }

    return result;
  };

  const isPast = (dateString: string) => {
    const inputDate = new Date(dateString).getTime();
    const currentDate = new Date().getTime();
    return currentDate > inputDate;
  };

  const claimDrop = useMutation(({ request }: { request: Request }) => {
    console.log(dropperContract.options, request);
    return dropperContract.methods
      .claim(
        request.parameters.dropId,
        request.request_id,
        request.parameters.blockDeadline,
        request.parameters.amount,
        request.parameters.signer,
        `0x${request.parameters.signature}`,
      )
      .send({ from: account, maxPriorityFeePerGas: null, maxFeePerGas: null });
  });

  const queryClient = useQueryClient();
  const deleteRequests = useMutation(
    ({ ids }: { ids: string[] }) => {
      return http({
        method: "DELETE",
        url: "https://engineapi.moonstream.to/metatx/requests",
        data: ids,
      });
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries("requests");
      },
    },
  );

  return (
    <Flex direction={"column"} p={"10px"} backgroundColor={"#353535"}>
      <PoolDetailsRow
        value={request.request_id}
        type={"request_id"}
        canBeCopied
        fontSize={"11px"}
      />
      <PoolDetailsRow value={request.parameters.dropId} type={"dropID"} fontSize={"11px"} />
      <PoolDetailsRow value={"" + request.parameters.amount} type={"amount"} fontSize={"11px"} />

      <Text mt="10px" fontSize={"11px"}>{`Created ${humanReadableInterval(
        request.created_at,
      )}`}</Text>
      <Text fontSize={"11px"} color={isPast(request.expires_at) ? "red" : "white"}>{`${
        isPast(request.expires_at) ? "Expired" : "Expires"
      } ${humanReadableInterval(request.expires_at)}`}</Text>
      <PoolDetailsRow
        mt="10px"
        value={request.parameters.blockDeadline}
        type={"blockDeadline"}
        fontSize={"11px"}
      />
      {currentBlock && (
        <PoolDetailsRow
          color={Number(request.parameters.blockDeadline) - currentBlock > 0 ? "white" : "red"}
          value={
            Number(request.parameters.blockDeadline) - currentBlock > 0
              ? "" + (Number(request.parameters.blockDeadline) - currentBlock)
              : "0"
          }
          type={"blocks left"}
          fontSize={"11px"}
        />
      )}

      <PoolDetailsRow
        mt="10px"
        value={request.parameters.signer}
        type={"signer"}
        fontSize={"11px"}
      />
      <PoolDetailsRow
        value={`0x${request.parameters.signature}`}
        canBeCopied
        type={"signature"}
        fontSize={"11px"}
      />
      <Flex justifyContent={"center"} gap={"20px"} mt={"15px"}>
        {!isClaimed ? (
          <button onClick={() => claimDrop.mutate({ request })}>Claim</button>
        ) : (
          <Text fontSize={"16px"} color={"#4d4d4d"}>
            Claimed
          </Text>
        )}
        <button onClick={() => deleteRequests.mutate({ ids: [request.id] })}>
          {deleteRequests.isLoading ? <Spinner /> : "Delete"}
        </button>
      </Flex>
    </Flex>
  );
};

export default ClaimCard;
