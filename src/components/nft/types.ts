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