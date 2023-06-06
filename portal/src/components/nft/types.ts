export interface NFTMetadata {
  name: string;
  image: string;
  description?: string;
}

export interface NFTInfo {
  tokenID: string;
  tokenURI: string;
  imageURI: string;
  metadata: NFTMetadata;
}

export type GreatWyrmToken = "gamemaster" | "character_creation" | "experience";
export type GreatWyrmTokenBalances = { [key in GreatWyrmToken]: string };
