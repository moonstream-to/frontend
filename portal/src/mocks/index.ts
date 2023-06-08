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
  "Ethereum",
  "ERC20",
  "ERC721",
  "ERC1155",
  "Metamask",
  "MEW",
  "Development",
  "Testing",
  "Production",
  "Kovan",
  "Rinkeby",
];

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
