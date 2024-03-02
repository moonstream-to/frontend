import { Flex, Link, Text, Accordion } from "@chakra-ui/react";
import { DISCORD_LINK } from "../../constants";
import FAQCard from "../FAQCard";
import styles from "./LandingFAQ.module.css";
const LandingFAQ = () => {
  return (
    <Flex className={styles.container}>
      <Text fontSize={{ base: "30px", sm: "40px" }} fontWeight="700">
        FAQ
      </Text>
      <Accordion defaultIndex={[-1]} allowMultiple w="100%">
        <FAQCard
          heading="Can I set it up by myself?"
          panelContent={
            <>
              You can already start using Analytics and Leaderboards after registering an account
              (see{" "}
              <Link
                isExternal
                href={"https://docs.moonstream.to/engine/analytics/"}
                textDecoration="underline"
                _hover={{ color: "accent.500" }}
              >
                documentation
              </Link>
              ). To use some of the features and to get a quote once you’ve used up free options,
              you&apos;ll need to get in contact with us on{" "}
              <Link
                isExternal
                href={DISCORD_LINK}
                textDecoration="underline"
                _hover={{ color: "accent.500" }}
              >
                Discord
              </Link>
              {"."}
              <br />
              <br />
              We are actively working to make all of our products self-serve in the near future.
            </>
          }
        />
        <FAQCard
          heading="What is a leaderboard in a web3 game?"
          panelContent={
            <>
              You gather information about players actions in your game and attach scores to them.
              Moonstream gives you tools to automate that process from the gathering of data to
              displaying scores to dropping the rewards.
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
        <FAQCard
          heading="How secure are operations run with Moonstream?"
          panelContent={
            <>
              We take security very seriously. We have managed smart contracts with hundreds of
              millions of dollars in transactions going through them. If you want to know more about
              how we run our operations, read this article:{" "}
              <Link
                isExternal
                href={"https://medium.com/@moonstream/open-tooling-hidden-operations-c2033f17b33e"}
                textDecoration="underline"
                _hover={{ color: "accent.500" }}
              >
                Open tooling. Hidden operations.
              </Link>
            </>
          }
        />
        <FAQCard
          heading="Can I set up a leaderboard for game server actions that are not on-chain?"
          panelContent={
            <>
              Yes, our leaderboards work for both on-chain and off-chain player actions. You can
              even combine them into one leaderboard!
            </>
          }
        />
      </Accordion>
    </Flex>
  );
};

export default LandingFAQ;
