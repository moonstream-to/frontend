import { Button, Container, Link, OrderedList, useMediaQuery } from "@chakra-ui/react";

import FeatureCard from "../../src/components/FeatureCardLarge";
import { AWS_STATIC_ASSETS_PATH } from "../../src/constants";
import LayoutLanding from "../../src/components/layoutLanding";

export const MoonstreamFeatures = [
  {
    name: "Analytics",
    description: "Monitor on- and off-chain player activity",
    image: `${AWS_STATIC_ASSETS_PATH}/analytics-card.png`,
    href: "portal/analytics",
  },
  {
    name: "Leaderboards",
    description: "Assign scores to player activity",
    image: `${AWS_STATIC_ASSETS_PATH}/Terminus.png`,
    // href: "portal/dropper",
  },
  {
    name: "Drops",
    description: "Automate on-chain rewards for leaderboard positions",
    image: `${AWS_STATIC_ASSETS_PATH}/airdrop.png`,
    href: "portal/dropper",
  },
];

const Features = () => {
  const [isBaseView] = useMediaQuery("(max-width: 768px)");

  return (
    <LayoutLanding title="Moonstream: features" home={false}>
      <Container
        id="container"
        maxW="1238"
        px={{ base: "3%", sm: "7%" }}
        py="30px"
        position="relative"
      >
        {!isBaseView && (
          <Link href="https://discord.gg/K56VNUQGvA">
            <Button
              variant="plainOrange"
              minW={["150", "150", "150", "200px", "300px", "300px"]}
              fontSize={["md", "lg", "xl", "2xl", "3xl", "3xl"]}
              position="absolute"
              bottom="10px"
              right="10px"
            >
              Learn More
            </Button>
          </Link>
        )}
        <FeatureCard
          pt="0px"
          id="analytics"
          headingText={MoonstreamFeatures[0].name}
          image={MoonstreamFeatures[0].image}
          cardOrder={1}
          isMobile={isBaseView}
        >
          <>
            Get live actionable data about player activity in your game. Moonstream Analytics
            combines both on-chain data and off-chain data from your game server.
            <br />
            <br />
            Transparency is key in web3 space. That’s where Moonstream’s web3 game analytics come
            in. Watch a smart contract or a wallet activity in real-time. Create public data streams
            to help players build strategies.
            <br />
            <br />
            Influence your game’s economy based on data:
            <OrderedList>
              <li>Create loyalty programs and reputation systems.</li>
              <li>Predict the changes in supply and price of different tokens.</li>
              <li>
                Study competitors and capture the most valuable users from competing economies.
              </li>
              <li>Secure your smart contracts.</li>
            </OrderedList>
          </>
        </FeatureCard>
        <FeatureCard
          id="leaderboards"
          headingText={MoonstreamFeatures[1].name}
          image={MoonstreamFeatures[1].image}
          cardOrder={-1}
          isMobile={isBaseView}
        >
          <>
            Use Moonstream-backed Leaderboards to automate web3 game rewards.
            <br />
            <br />
            Display the gaming data you crawled with Moonstream Analytics. Instead of a boring list
            of wallets and their scores, you can have leaderboards for NFTs, or even just game
            accounts (usernames, emails, etc.). Show players their scores and rewards on your
            website or game client.
            <br />
            <br />
            Use Leaderboards as a game design tool. Add a competitive element to your game
            mechanics: create engagement for specific gameplay elements by attaching Leaderboards to
            them.
            <br />
            <br />
            Leaderboards have been extensively used by Crypto Unicorns for launching popular gaming
            events since 2022 and are being implemented by projects like Crypto-Guilds and MetaBoy.
            <br />
            <br />
          </>
        </FeatureCard>
        <FeatureCard
          id="drops"
          headingText={MoonstreamFeatures[2].name}
          image={MoonstreamFeatures[2].image}
          cardOrder={1}
          isMobile={isBaseView}
        >
          <>
            Use Moonstream to distribute ERC20 tokens, NFTs, items, or achievements to your
            community. All you have to do is upload a spreadsheet listing the amount that each
            community member should receive.
            <br />
            <br />
            Our smart contracts and APIs handle the rest. Integrate your frontends or game clients
            with our APIs for full control over the claim experience.
            <br />
            <br />
            Gaming projects have used Moonstream to drop over $80,000,000 worth of tokens and items
            to date.
            <br />
            <br />
          </>
        </FeatureCard>
      </Container>
    </LayoutLanding>
  );
};

export default Features;
