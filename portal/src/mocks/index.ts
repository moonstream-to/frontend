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

const smartContracts: { [key: string]: string } = {
  "Fair Trade Coffee Tracking":
    "Enables coffee buyers to verify their coffee's origins and ensure farmer payments. Upon bean shipment, the contract records the details in a transparent and unalterable ledger.",

  "Rental Property Agreement":
    "Automates rent payments from tenants to landlords and handles lease agreement stipulations. In case of a lease breach, this contract provides predefined resolutions.",

  "Supply Chain Management":
    "Provides real-time updates on product location and condition, ensuring a smooth flow from manufacturers to consumers. Enhances transparency and trust in the supply chain.",

  "Music Royalty Distribution":
    "Automatically splits and distributes royalties to artists when their music is streamed or purchased. Eliminates intermediaries, ensuring artists get paid fairly and promptly.",

  "Decentralized Exchange (DEX)":
    "Allows users to trade cryptocurrencies directly with each other without a centralized third party, providing secure, swift, and low-fee trading experiences.",

  "Energy Grid Management":
    "Manages energy distribution and payments in a decentralized grid. Allows energy producers to sell excess energy directly to consumers and facilitates automatic billing.",

  "Election Voting":
    "Provides a transparent, secure, and tamper-proof system for casting, tracking, and counting votes, making elections more accessible and reliable.",

  "Healthcare Patient Records":
    "Securely stores and manages access to patient health records. Allows healthcare providers to access up-to-date patient information, improving care coordination and patient outcomes.",

  "Insurance Claims Processing":
    "Automates the processing and payout of insurance claims based on verified events. Increases efficiency and reduces the possibility of fraudulent claims.",

  "Loyalty Rewards Program":
    "Manages the issuance and redemption of loyalty points. Enhances customer engagement and provides a transparent view of points earned and redeemed.",

  Crowdfunding:
    "Manages contributions and milestone-based fund release to project creators. Ensures funds are used as promised, increasing trust between backers and creators.",

  "Intellectual Property Rights":
    "Tracks and protects intellectual property rights, ensuring creators are acknowledged and compensated when their work is used.",

  "Academic Credential Verification":
    "Stores and verifies academic credentials, reducing fraud and making it easier for employers to verify qualifications.",

  "Land Registry":
    "Manages the registry of land and property ownership, preventing fraud and disputes while increasing transparency in property transactions.",

  "Digital Identity Verification":
    "Stores and verifies digital identities, reducing fraud and streamlining online identity verification processes.",

  "Charitable Donation Tracking":
    "Tracks charitable donations from source to end-use, ensuring funds are used as intended and enhancing trust in charitable organizations.",

  "Peer-to-Peer Lending":
    "Manages direct loans between individuals, automating interest payments and principal repayment schedules.",

  "Sports Betting":
    "Facilitates sports betting, with automatic payouts based on verified game outcomes.",

  "Ad Impressions Tracking":
    "Tracks ad impressions and clicks, automating payment from advertisers to publishers based on actual ad performance.",

  "Subscription Services":
    "Manages recurring subscription payments, automatically deducting fees based on the agreed schedule.",

  "Waste Management Tracking":
    "Tracks waste from source to disposal, improving accountability and efficiency in waste management services.",

  "Job Marketplace":
    "Facilitates contract work arrangements, with automatic payment upon job completion and satisfaction verification.",

  "Video Content Streaming":
    "Automates payments to content creators based on the number of views, likes, or shares their videos receive.",

  "Freelance Work Contract":
    "Ensures timely payment to freelancers upon completion of tasks. Defines and automates payment based on milestones.",

  "Online Auction":
    "Manages bidding and auction closing, with automatic transfer of goods to the highest bidder upon auction close.",

  "Tax Collection":
    "Automates tax calculations and collections based on income or sales, reducing errors and fraud.",

  "Parking Space Rental":
    "Manages rental of parking spaces, with automatic billing based on the length of parking time.",

  "Logistics and Shipping":
    "Tracks goods from sender to recipient, automating notifications and payment upon delivery confirmation.",

  "Digital Art Ownership (NFTs)":
    "Assigns and verifies ownership of digital art pieces, allowing artists to benefit from initial sales and any future transactions.",

  "Automated Stock Trading":
    "Automates buying and selling of stocks based on predefined rules and triggers, like price or volume changes.",
};

const smartContracts2: { [title: string]: string } = {
  "Real-Time Weather Insurance":
    "Offers weather-based insurance coverage to businesses and individuals. Automatically triggers payouts when specific weather conditions occur, providing protection against weather-related risks.",
  "Blockchain-Based Voting":
    "Ensures secure and transparent voting processes by leveraging blockchain technology. Enables verifiable and tamper-proof digital voting, increasing trust and integrity in elections.",
  "Digital Identity Verification":
    "Provides a decentralized and secure system for verifying and managing digital identities. Enhances user privacy, reduces identity theft risks, and simplifies identity verification processes.",
  "Freelance Service Agreement":
    "Facilitates agreements between freelancers and clients. Automates payment releases upon project completion, protects intellectual property rights, and streamlines the freelance service delivery process.",
  "Carbon Credit Trading":
    "Enables the trading of carbon credits on a blockchain platform. Automates transactions, verifies carbon offset projects, and promotes the adoption of sustainable practices.",
  "Digital Asset Ownership":
    "Establishes ownership and transfers of digital assets, such as cryptocurrencies, non-fungible tokens (NFTs), and intellectual property rights. Provides transparency and security in the digital asset ecosystem.",
  "Smart Home Automation":
    "Automates the control and management of smart home devices. Enables personalized settings, energy optimization, and remote access to enhance convenience and energy efficiency.",
  "Peer-to-Peer Lending":
    "Facilitates lending and borrowing transactions between individuals without the need for traditional financial institutions. Automates loan agreements, interest calculations, and repayment schedules.",
  "Healthcare Data Exchange":
    "Enables secure and consent-based sharing of healthcare data between healthcare providers, ensuring privacy, interoperability, and improved patient care coordination.",
  "Blockchain-Based Traceability for Luxury Goods":
    "Establishes provenance and authenticity for luxury goods using blockchain technology. Enables consumers to verify the origin and authenticity of high-end products, reducing the risk of counterfeiting.",
  "Ride-Sharing":
    "Facilitates ride-sharing services by automating trip requests, fare calculations, and payment settlements between drivers and passengers. Increases efficiency and transparency in the transportation industry.",
  "Digital Rights Management":
    "Manages and protects digital content rights, such as music, videos, and e-books. Automates licensing agreements, royalty distribution, and copyright enforcement.",
  "Sustainable Supply Chain Verification":
    "Verifies and tracks the sustainability credentials of products throughout the supply chain. Enables transparency, verifies eco-friendly practices, and supports responsible sourcing.",
  "Tokenized Asset Offering (TAO)":
    "Facilitates the issuance and management of security tokens for fundraising and investment purposes. Automates compliance, investor verification, and distribution of tokenized assets.",
  "Smart Energy Grid Management":
    "Optimizes the management and distribution of energy resources in a smart grid. Automates energy trading, demand response, and grid balancing to achieve a more efficient and sustainable energy ecosystem.",
  "Intellectual Property Licensing":
    "Automates the licensing and usage rights of intellectual property assets, such as patents, trademarks, and copyrights. Enables transparent royalty calculations and ensures proper attribution.",
  "Decentralized Content Publishing":
    "Enables decentralized content publishing and monetization. Provides fair compensation for content creators, eliminates intermediaries, and empowers the community.",
  "Charity Donations":
    "Facilitates transparent and traceable donations to charitable organizations. Automates donation tracking, ensures accountability, and increases transparency in the philanthropic sector.",
  "Prescription Drug Traceability":
    "Tracks the journey of prescription drugs from manufacturers to patients. Ensures authenticity, reduces counterfeit drugs, and enhances patient safety in the pharmaceutical industry.",
  "Smart Parking Management":
    "Automates parking spot reservation, payment, and enforcement. Enhances parking space utilization, reduces congestion, and improves overall parking management efficiency.",
  "Smart Waste Recycling":
    "Incentivizes recycling by automatically rewarding individuals or businesses for depositing recyclable waste into designated recycling systems. Promotes sustainable waste management practices.",
  "Asset Tokenization":
    "Enables the fractional ownership and trading of physical assets, such as real estate, art, or collectibles, through tokenization. Enhances liquidity and accessibility for a wider range of investors.",
  "Event Sponsorship":
    "Facilitates sponsorship agreements between event organizers and sponsors. Automates payment schedules, brand visibility metrics, and deliverables, simplifying the sponsorship process.",
  "Food Safety Assurance":
    "Verifies and ensures the safety and quality of food products throughout the supply chain. Tracks origin, storage conditions, and certifications to guarantee compliance with food safety standards.",
  "Sports Performance Incentive":
    "Provides incentives to athletes based on performance metrics, such as goals scored, assists made, or records broken. Automates bonus calculations and ensures fair compensation in the sports industry.",
  "Health and Wellness Rewards":
    "Encourages individuals to maintain healthy habits by automatically rewarding them with tokens or discounts for achieving specific health goals, such as exercise targets or healthy eating habits.",
  "Smart Auction":
    "Conducts secure and transparent online auctions. Automates bidding processes, ensures fair competition, and establishes a trusted environment for buyers and sellers.",
  "Personalized Learning":
    "Facilitates personalized learning experiences by tracking individual progress, recommending educational resources, and automating the delivery of learning materials based on a learner's needs.",
  "Sustainable Fisheries Management":
    "Implements sustainable fishing practices by tracking and managing fishing quotas, enforcing fishing regulations, and promoting responsible fishing methods. Protects marine ecosystems and supports long-term fishery sustainability.",
  "Online Marketplace Escrow":
    "Provides escrow services for online marketplaces, ensuring secure transactions between buyers and sellers. Safeguards funds until both parties are satisfied with the completion of the transaction.",
  "Royalty Distribution":
    "Ensures fair and transparent royalty distribution for artists and content creators. Automates payment calculations, tracks usage data, and distributes royalties based on predetermined terms. Streamlines the process and provides accurate compensation in the art and entertainment industry.",
  "Agricultural Supply Chain":
    "Optimizes the agricultural supply chain by automating processes like inventory management, quality control, and payment settlements. Enhances traceability, reduces waste, and ensures fair compensation for farmers, distributors, and retailers.",
  "Personal Training Agreement":
    "Facilitates personalized training agreements between trainers and clients. Defines fitness goals, tracks progress, and automates payment for training services. Streamlines the client-trainer relationship and promotes accountability in the fitness industry.",
  "Environmental Impact Offset":
    "Enables organizations to offset their environmental impact by automatically funding and tracking environmental conservation projects. Ensures transparency, encourages sustainability, and mitigates the carbon footprint of large corporations.",
  "Event Ticket Resale":
    "Provides a secure and transparent platform for reselling event tickets. Ensures authenticity, prevents fraud, and enables fair ticket pricing in the entertainment industry. Facilitates seamless transactions and reduces ticket scalping.",
  "Health Insurance Claims":
    "Streamlines the health insurance claims process by automating claim submissions, verification, and payment settlements. Enhances efficiency, reduces administrative costs, and improves transparency and trust in the insurance sector.",
  "Waste Management":
    "Automates waste management processes, including waste collection, disposal, and recycling. Facilitates tracking and auditing of waste streams, promotes sustainable practices, and ensures proper waste management across industries.",
  "Online Gambling":
    "Provides a secure and decentralized platform for online gambling. Automates betting, payout calculations, and ensures fairness through transparent and auditable transactions. Enhances trust and minimizes the risk of fraud in the gambling industry.",
  "Music Licensing":
    "Simplifies the music licensing process for artists and content creators. Automates licensing agreements, tracks usage, and ensures timely and accurate royalty payments. Streamlines music licensing and promotes fair compensation.",
  "Personal Wellness Monitoring":
    "Enables individuals to monitor and track their personal wellness goals, such as exercise routines, nutrition plans, and health data. Automates reminders, provides insights, and encourages healthy habits for individuals seeking to improve their well-being.",
};

// Function to get a random title
export function getRandomTitle(): string {
  const titles = Object.keys(smartContracts);
  const randomIndex = Math.floor(Math.random() * titles.length);
  return titles[randomIndex];
}

// Function to get the description for a given title
export function getDescriptionForTitle(title: string): string {
  return smartContracts[title] || "No description available for the given title.";
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

const contractQueries: string[] = [
  "Contract Events",
  "Recent Transactions",
  "Current Owners with Token",
  "Locked Tokens",
  "All Tokens",
  "Metadata",
  "Contract Creation Date",
  "Contract's Current Balance",
  "Token Transfer History",
  "Contract's Source Code",
  "Interacting Contracts",
  "Failed Transactions",
  "Contract's Gas Usage",
  "Contract Creators",
  "Contract's Function Calls",
  "Token Holders",
  "Whitelisted Addresses",
  "Contract's External Calls",
  "Tokens Minted/Burned",
  "Contract Updates",
  "Token Sale Data",
  "Gas Price History",
  "Associated IPFS Data",
  "Contract Function Descriptions",
  "ERC-721 Token Transfers",
  "ERC-20 Token Transfers",
  "All Self-Destruct Transactions",
  "All Contract Creations",
  "Gas Used by Transaction",
  "Contract's Ether Balance History",
];

const queryDescriptions: { [key: string]: string } = {
  "Contract Events": "Returns a list of all events triggered by the contract.",
  "Recent Transactions": "Provides a list of the most recent transactions involving the contract.",
  "Current Owners with Token":
    "Shows all current token holders along with their respective balances.",
  "Locked Tokens": "Displays tokens that are currently locked and not transferable.",
  "All Tokens": "Provides a comprehensive list of all tokens related to the contract.",
  Metadata: "Returns metadata associated with the contract, like contract name or token symbol.",
  "Contract Creation Date":
    "Shows the date and time when the contract was created and deployed on the blockchain.",
  "Contract's Current Balance": "Displays the current cryptocurrency balance held by the contract.",
  "Token Transfer History": "Returns a history of all token transfers involving the contract.",
  "Contract's Source Code": "Provides the original source code of the smart contract.",
  "Interacting Contracts": "Lists all other contracts that have interacted with this contract.",
  "Failed Transactions": "Shows a history of transactions involving the contract that failed.",
  "Contract's Gas Usage":
    "Provides information on the amount of gas used by the contract for computations.",
  "Contract Creators":
    "Displays the addresses of the entities that created and deployed the contract.",
  "Contract's Function Calls": "Returns a log of all function calls made to the contract.",
  "Token Holders": "Lists all current holders of the contract's token and their balances.",
  "Whitelisted Addresses":
    "Shows all addresses currently whitelisted for interaction with the contract.",
  "Contract's External Calls":
    "Returns a log of all calls made by the contract to external contracts or addresses.",
  "Tokens Minted/Burned":
    "Shows the total number of tokens that have been minted or burned by the contract.",
  "Contract Updates":
    "Returns a history of all updates made to the contract after its initial deployment.",
  "Token Sale Data":
    "Provides data related to any token sales conducted by the contract, such as total tokens sold and total Ether raised.",
  "Gas Price History":
    "Returns a history of gas prices at the time of each transaction involving the contract.",
  "Associated IPFS Data":
    "Shows any data associated with the contract that's stored on the InterPlanetary File System (IPFS).",
  "Contract Function Descriptions":
    "Provides descriptions of all functions that can be called on the contract.",
  "ERC-721 Token Transfers":
    "Returns a log of all ERC-721 (non-fungible token) transfers involving the contract.",
  "ERC-20 Token Transfers": "Shows a history of all ERC-20 token transfers involving the contract.",
  "All Self-Destruct Transactions":
    "Lists all transactions where the contract's self-destruct function was called.",
  "All Contract Creations":
    "Returns a history of all instances where the contract created another contract.",
  "Gas Used by Transaction":
    "Provides a detailed account of the amount of gas used by each individual transaction involving the contract.",
  "Contract's Ether Balance History":
    "Returns a history of the contract's Ether balance over time.",
};

export function getQueryDescription(query: string): string {
  return queryDescriptions[query];
}

export function getRandomQueries(): string[] {
  const numberOfQueries = Math.floor(Math.random() * 6) + 5; // This will give a random integer between 5 and 10
  const result: string[] = [];
  const tempArray = [...contractQueries]; // Create a copy of contractQueries

  for (let i = 0; i < numberOfQueries; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    result.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1); // This will remove the selected element from tempArray
  }

  return result;
}

const parameters: { [key: string]: string } = {
  amount: "integer",
  address: "address",
  contract_address: "address",
  claim_id: "string",
  session_id: "string",
  name: "string",
  block_number: "integer",
  block_timestamp: "integer",
  transaction_hash: "string",
  label_data: "jsonb",
  event_name: "string",
  event_args: "jsonb",
  token_id: "string",
  current_owner: "address",
  previous_owner: "address",
  previous_owner_balance: "integer",
  current_owner_balance: "integer",
  previous_owner_balance_delta: "integer",
  user_address: "address",
  start_block_number: "integer",
  end_block_number: "integer",
  blocks_back: "integer",
  limit: "integer",
  time_range: "string",
  time_format: "string",
  contract_addresses: "array[address]",
  contracts_list: "array[address]",
  // start_timestamp: "integer",
  // end_timestamp: "integer",
  type: "string",
};

export function getRandomParameters(): string[] {
  const keys = Object.keys(parameters);
  const numberOfParameters = Math.floor(Math.random() * 4); // This will give a random integer between 0 and 3
  const result: string[] = [];
  const tempArray = [...keys]; // Create a copy of keys array

  for (let i = 0; i < numberOfParameters; i++) {
    const randomIndex = Math.floor(Math.random() * tempArray.length);
    result.push(tempArray[randomIndex]);
    tempArray.splice(randomIndex, 1); // This will remove the selected element from tempArray
  }

  return result;
}

export function getParameterType(parameter: string): string {
  return parameters[parameter];
}
