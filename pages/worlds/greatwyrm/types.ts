import { NFTInfo } from "../../../src/components/nft/types";

export type StakedTokenInfo = NFTInfo & {
  sessionId: number;
};
