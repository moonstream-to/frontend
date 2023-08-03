import RouterLink from "next/link";

import { Flex, chakra, Link, Center, Text, Icon, Accordion } from "@chakra-ui/react";
import { DISCORD_LINK } from "../../constants";
import FAQCard from "../FAQCard";

const LandingFAQ = () => {
  return (
    <Flex
      py={{ base: "40px", sm: "80px" }}
      px="0"
      gap={{ base: "40px", sm: "60px" }}
      direction="column"
      alignItems="center"
    >
      <Text fontSize={{ base: "30px", sm: "40px" }} fontWeight="700">
        FAQ
      </Text>
      <Accordion defaultIndex={[-1]} allowMultiple w="100%">
        <FAQCard
          heading="Can I set it up by myself?"
          panelContent={
            <>
              Yes and no. We are actively working to make all of our products self-serve in the near
              future. For now, you&apos;ll need to get in{" "}
              <Link
                isExternal
                href={DISCORD_LINK}
                textDecoration="underline"
                _hover={{ color: "accent.500" }}
              >
                contact
              </Link>{" "}
              with us to start using Moonstream.
              <br />
              <br />
              However, you can already use our{" "}
              <RouterLink href="/portal/analytics">
                <chakra.span
                  style={{ textDecoration: "underline" }}
                  _hover={{ color: "accent.500", textDecoration: "underline" }}
                >
                  web3 Analytics
                </chakra.span>
              </RouterLink>{" "}
              after registering an account.
            </>
          }
        />
        <FAQCard
          heading="Can I use just one or two of Moonstream’s features?"
          panelContent={<>Yes, you can.</>}
        />
        <FAQCard
          heading="Can I create on-chain loyalty programs with Moonstream tools? "
          panelContent={
            <>
              Yes, you definitely can. <br />
              <br />
              Get player activity data with Analytics, assign scores to that activity. Display those
              scores with Leaderboards. Minimize manual work by dropping rewards automatically with
              Drops.
            </>
          }
        />
        <FAQCard
          heading="I’m a data scientist. Can I use Moonstream for research?"
          panelContent={
            <>
              You can use{" "}
              <Link
                _hover={{ color: "accent.500" }}
                href="https://github.com/bugout-dev/moonworm"
                isExternal
              >
                <u>Moonworm</u>
              </Link>
              , our free open source tool, to build datasets of on-chain data related to market
              activity.
              <br />
              <br />
              We also have a dataset with on-chain activity from the Ethereum NFT market (April 1 to
              September 25, 2021){" "}
              <Link
                _hover={{ color: "accent.500" }}
                href="https://www.kaggle.com/datasets/simiotic/ethereum-nfts"
                isExternal
              >
                <u>here</u>
              </Link>
              . And{" "}
              <Link
                _hover={{ color: "accent.500" }}
                href="https://github.com/bugout-dev/moonstream/blob/main/datasets/nfts/papers/ethereum-nfts.pdf"
                isExternal
              >
                <u>here</u>
              </Link>{" "}
              is our full report on it.
            </>
          }
        />
        <FAQCard
          heading="I don’t see the blockchain I need in the supported blockchains, can you add it?"
          panelContent={
            <>
              If it’s an EVM compatible blockchain we can add it in a couple of days.{" "}
              <Link
                isExternal
                href={DISCORD_LINK}
                textDecoration="underline"
                _hover={{ color: "accent.500" }}
              >
                Contact us
              </Link>{" "}
              to make it happen!
            </>
          }
        />
        <FAQCard
          heading="Is it free? Where can I see the pricing?"
          panelContent={
            <>
              The tools are{" "}
              <Link
                isExternal
                href="https://github.com/moonstream-to"
                _hover={{ color: "accent.500" }}
                textDecoration="underline"
              >
                {" "}
                open source
              </Link>
              . If you prefer to onboard and get support, please{" "}
              <Link
                isExternal
                href={DISCORD_LINK}
                textDecoration="underline"
                _hover={{ color: "accent.500" }}
              >
                contact us
              </Link>{" "}
              to get the pricing information.
            </>
          }
        />
      </Accordion>
    </Flex>
  );
};

export default LandingFAQ;
