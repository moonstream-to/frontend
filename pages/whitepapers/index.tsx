import { Flex, Heading } from "@chakra-ui/react";

import WhitepaperCard from "../../src/components/WhitepaperCard";
import { AWS_STATIC_ASSETS_PATH } from "../../src/constants";
import Layout from "../../src/components/layout";

const Whitepapers = () => {
  return (
    <Layout home={false} title="Moonstream: whitepapers">
      <Flex
        direction="column"
        px={{ base: "3%", sm: "7%" }}
        width="100%"
        alignItems="center"
        pb="40px"
      >
        <Heading pb={["40px", "40px", "60px"]} pt="30px">
          Whitepapers
        </Heading>
        <WhitepaperCard
          maxW={["340px", "340px", "890px"]}
          href="https://github.com/bugout-dev/moonstream/blob/main/datasets/nfts/papers/ethereum-nfts.pdf"
          img={`${AWS_STATIC_ASSETS_PATH}/nft_market_analysis_i.png`}
          title="An analysis of 7,020,950 NFT transactions on the Ethereum blockchain"
          date="October 22, 2021"
          text="We present the Ethereum NFTs dataset, a representation of the activity on the Ethereum non-fungible token (NFT) market between April 1, 2021 and September 25, 2021, constructed purely from on-chain data. This dataset consists of all 7 020 950 token mints and transfers across 727 102 accounts between block 12 150 245 and block 13 296 011."
        />
      </Flex>
    </Layout>
  );
};

export default Whitepapers;
