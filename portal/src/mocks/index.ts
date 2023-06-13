export const web3tags = [
  "PersonalWallet",
  "BusinessWallet",
  "ColdStorage",
  "SmartContract",
  "TokenContract",
  "CrowdsaleContract",
  "DAOContract",
  "NFTContract",
  "DeFiContract",
  "MultisigWallet",
  "LendingPlatform",
  "OracleContract",
  "Dapp",
  "TokenSwap",
  "Stablecoin",
  "YieldFarming",
  "StakingContract",
  "InsuranceContract",
  "GameContract",
  "ERC20",
  "ERC721",
  "ERC1155",
  "Metamask",
  "MEW",
  "Development",
  "Testing",
  "Production",
  "Kovan",
];

const smartContracts: string[] = [
  "Virtual Marketplace Contract: This smart contract facilitates secure and fair transactions in a virtual marketplace, ensuring transparent rules for acquiring and trading virtual goods.",
  "Gaming Asset Exchange Contract: Designed for gaming enthusiasts, this smart contract ensures secure and fair transactions when exchanging virtual assets, with transparent rules governing the acquisition and trading process.",
  "NFT Auction Contract: This smart contract establishes a secure and fair auction platform for non-fungible tokens (NFTs), incorporating transparent rules for acquiring and trading these unique digital assets.",
  "Decentralized Virtual Goods Exchange Contract: Enabling decentralized trading of virtual goods, this smart contract ensures security and fairness while providing transparent rules for acquiring and trading various digital items within a virtual ecosystem.",
  "Blockchain Ticketing Contract: This smart contract guarantees secure and fair ticket transactions by leveraging blockchain technology, with transparent rules governing the acquisition and trading of event tickets.",
  "Virtual Real Estate Contract: Designed for virtual worlds and metaverses, this smart contract establishes secure and fair transactions for virtual real estate, incorporating transparent rules for acquiring and trading virtual properties.",
  "Collectibles Marketplace Contract: This smart contract facilitates secure and fair transactions in a marketplace dedicated to collectibles, ensuring transparent rules for acquiring and trading rare and valuable digital items.",
  "Tokenized Artwork Contract: Leveraging blockchain technology, this smart contract enables secure and fair transactions for tokenized artwork, with transparent rules governing the acquisition and trading of digital art pieces.",
  "Gaming Loot Box Contract: This smart contract ensures secure and fair distribution of gaming loot boxes, with transparent rules for acquiring and trading these randomized virtual reward containers within a gaming ecosystem.",
  "Music Royalties Contract: Designed for the music industry, this smart contract enables secure and fair distribution of royalties, incorporating transparent rules for acquiring and trading music rights and revenue shares.",
];

export function getRandomSmartContractDescription(): string {
  const randomIndex: number = Math.floor(Math.random() * smartContracts.length);
  return smartContracts[randomIndex];
}

export function getRandomTags() {
  const numTags = Math.floor(Math.random() * 4) + 1; // Get random number between 1 and 4
  const randomTags: string[] = [];

  for (let i = 0; i < numTags; i++) {
    let tag;

    do {
      tag = web3tags[Math.floor(Math.random() * web3tags.length)];
    } while (randomTags.includes(tag));

    randomTags.push(tag);
  }

  return randomTags;
}

// console.log(getRandomTags()); // Use the function
