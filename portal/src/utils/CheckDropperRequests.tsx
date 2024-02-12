import Web3 from "web3";
import BN from "bn.js";

export interface ClaimRequest {
  requestID: string;
  dropId: string;
  blockDeadline: string;
  amount: string;
  caller?: string;
  claimant?: string;
  signer?: string;
  signature?: string;
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

export const isValidUint256 = (value: string) => {
  // Regular expression to check if string is a positive integer
  const isNumeric = /^[0-9]+$/.test(value);

  if (!isNumeric) {
    return false;
  }

  // Create a BigNumber instance for comparison
  const number = new BN(value);

  // Define uint256 range
  const uint256Max = new BN("2").pow(new BN("256")).sub(new BN("1"));

  // Check if the number is within the uint256 range
  return number.gte(new BN("0")) && number.lte(uint256Max);
};

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

const checkField = (
  content: ClaimRequest[],
  fn: (r: ClaimRequest) => boolean,
  fieldName: string,
) => {
  const invalidRows = content
    .map((r, idx) => {
      return { r, idx };
    })
    .filter(({ r }) => !fn(r))
    .map(
      ({ idx }) => `${idx + 1}${!content[idx][fieldName as keyof ClaimRequest] ? "(missed)" : ""}`,
    );
  return invalidRows.length > 0 ? `Invalid ${fieldName} in rows: ${invalidRows.join(", ")}` : "";
};

export const checkRequestIDs = (content: ClaimRequest[]) => {
  const wrongRequestIDs = content
    .map((r, idx) => {
      return { r, idx };
    })
    .filter(({ r }) => !isValidUint256(r.requestID))
    .map(({ idx }) => idx + 1);
  return wrongRequestIDs.length > 0
    ? `Invalid requestIDs in rows: ${wrongRequestIDs.join(", ")}`
    : "";
};
const checkBlockDeadlines = (content: ClaimRequest[]) => {
  const blockDeadlines = content
    .filter((r) => !isValidUint256(r.blockDeadline))
    .map((r) => r.requestID);
  return blockDeadlines.length > 0 ? `Invalid blockdeadlines in: ${blockDeadlines.join(", ")}` : "";
};

const checkDropIDs = (content: ClaimRequest[]) => {
  const wrongDropIDs = content
    .filter((r) => isNaN(Number(r.dropId)) || Number(r.dropId) <= 0)
    .map((r) => r.requestID);
  return wrongDropIDs.length > 0 ? `Invalid dropIDs in: ${wrongDropIDs.join(", ")}` : "";
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

const checkClaimants = (content: WaggleClaimRequest[]) => {
  const wrongClaimants = content
    .filter((r) => !web3.utils.isAddress(r.claimant))
    .map((r) => r.requestID);
  return wrongClaimants.length > 0
    ? `Invalid claimant addresses in: ${wrongClaimants.join(", ")}`
    : "";
};

const checkCallers = (content: MetaTxClaimRequest[]) => {
  const wrongCallers = content
    .filter((r) => !web3.utils.isAddress(r.caller))
    .map((r) => r.requestID);
  return wrongCallers.length > 0 ? `Invalid caller addresses in: ${wrongCallers.join(", ")}` : "";
};
export const checkDropperRequests = ({
  content,
  isSigned,
}: {
  content: ClaimRequest[];
  isSigned: boolean;
}) => {
  const duplicatedIDs = checkDuplicatedRequestIDs(content);
  const invalidSigners = isSigned
    ? checkField(
        content as MetaTxClaimRequest[],
        (r: ClaimRequest) => web3.utils.isAddress(r.signer ?? ""),
        "signer",
      )
    : "";
  const invalidSignatures = isSigned
    ? checkField(
        content as MetaTxClaimRequest[],
        (r: ClaimRequest) =>
          verifySignature(
            Number(r.requestID),
            r.caller ?? "",
            Number(r.blockDeadline),
            Number(r.amount),
            r.signature ?? "",
            r.signer ?? "",
          ),
        "signature",
      )
    : "";
  console.log(isSigned, invalidSignatures);
  const invalidIDs = checkRequestIDs(content);
  const invalidBlockDeadlines = checkField(
    content,
    (r: ClaimRequest) => isValidUint256(r.blockDeadline),
    "blockDeadline",
  );
  const invalidAmounts = checkField(
    content,
    (r: ClaimRequest) => isValidUint256(r.amount),
    "amount",
  );
  const invalidDropIDs = checkField(
    content,
    (r: ClaimRequest) => isValidUint256(r.dropId),
    "dropId",
  );
  const invalidClaimants = !isSigned
    ? checkField(content, (r: ClaimRequest) => web3.utils.isAddress(r.claimant ?? ""), "claimant")
    : "";

  const criticalErrors =
    duplicatedIDs +
    "\n" +
    invalidSigners +
    "\n" +
    invalidSignatures +
    "\n" +
    invalidIDs +
    "\n" +
    invalidBlockDeadlines +
    "\n" +
    invalidDropIDs +
    "\n" +
    invalidClaimants +
    "\n" +
    invalidAmounts;
  if (criticalErrors.split("\n").join("")) {
    return criticalErrors;
  }
};

function claimMessageHash(
  claimId: number,
  claimant: string,
  blockDeadline: number,
  amount: number,
): string {
  const hash = web3.utils.soliditySha3(
    { type: "uint256", value: String(claimId) },
    { type: "address", value: claimant },
    { type: "uint256", value: String(blockDeadline) },
    { type: "uint256", value: String(amount) },
  );
  return hash ?? "";
}

function verifySignature(
  claimId: number,
  claimant: string,
  blockDeadline: number,
  amount: number,
  signature: string,
  expectedSigner: string,
): boolean {
  const hash = claimMessageHash(claimId, claimant, blockDeadline, amount);
  const signer = web3.eth.accounts.recover(hash, signature);
  return signer.toLowerCase() === expectedSigner.toLowerCase();
}
