import Web3 from "web3";

export interface ClaimRequest {
  requestID: string;
  dropId: string;
  blockDeadline: string;
  amount: string;
  claimant?: string;
}
const web3 = new Web3();

export interface MetaTxClaimRequest extends ClaimRequest {
  caller: string;
  signer: string;
  signature: string;
}

export interface WaggleClaimRequest extends ClaimRequest {
  claimant: string;
}

export const checkDuplicatedRequestIDs = (content: ClaimRequest[]) => {
  const requestIDMap: Record<string, number[]> = {};
  content.forEach((obj, index) => {
    if (!requestIDMap[obj.requestID]) {
      requestIDMap[obj.requestID] = [];
    }
    requestIDMap[obj.requestID].push(index + 1);
  });

  let message = "";

  for (const requestID in requestIDMap) {
    if (requestIDMap[requestID].length > 1) {
      message += `requestID ${requestID} is in the rows ${requestIDMap[requestID].join(", ")}; `;
    }
  }
  return message;
};

export const checkRequestIDs = (content: ClaimRequest[]) => {
  const wrongRequestIDs = content
    .filter((r) => !web3.utils.isBN(r.requestID))
    .map((r) => r.requestID);
  return wrongRequestIDs.length > 0 ? `Invalid requestIDS: ${wrongRequestIDs.join(", ")}` : "";
};
const checkBlockDeadlines = (content: ClaimRequest[]) => {
  const wrongRequestIDs = content
    .filter((r) => !web3.utils.isBN(r.blockDeadline))
    .map((r) => r.requestID);
  return wrongRequestIDs.length > 0 ? `Invalid blockdeadlines: ${wrongRequestIDs.join(", ")}` : "";
};

const checkSigners = (content: MetaTxClaimRequest[]) => {
  const missedSigners = content.filter((r) => !r.signer).map((r) => r.requestID);
  return missedSigners.length > 0 ? `No signer for requests: ${missedSigners.join(", ")}` : "";
};

const checkSignatures = (content: MetaTxClaimRequest[]) => {
  const missedSignatures = content.filter((r) => !r.signer).map((r) => r.requestID);
  return missedSignatures.length > 0
    ? `No signature for requests: ${missedSignatures.join(", ")}`
    : "";
};

export const checkDropperRequests = ({
  content,
  isSigned,
}: {
  content: ClaimRequest[];
  isSigned: boolean;
}) => {
  const duplicatedIDs = checkDuplicatedRequestIDs(content);
  const invalidSigners = isSigned ? checkSigners(content as MetaTxClaimRequest[]) : "";
  const invalidSignatures = isSigned ? checkSignatures(content as MetaTxClaimRequest[]) : "";
  const invalidIDs = checkRequestIDs(content);
  const invalidBlockdeadlines = checkBlockDeadlines(content);

  const criticalErrors =
    duplicatedIDs +
    "\n" +
    invalidSigners +
    "\n" +
    invalidSignatures +
    "\n" +
    invalidIDs +
    "\n" +
    invalidBlockdeadlines;
  if (criticalErrors) {
    return criticalErrors;
  }
};
