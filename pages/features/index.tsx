import { Button, Container, Link, useMediaQuery } from "@chakra-ui/react";

import FeatureCard from "../../src/components/FeatureCardLarge";
import { AWS_STATIC_ASSETS_PATH } from "../../src/constants";
import LayoutLanding from "../../src/components/layoutLanding";

const assets = {
  airdrop: `${AWS_STATIC_ASSETS_PATH}/airdrop.png`,
  openLootbox: `${AWS_STATIC_ASSETS_PATH}/open-lootbox.png`,
  craftingRecipe: `${AWS_STATIC_ASSETS_PATH}/crafting-recipe.png`,
  minigame: `${AWS_STATIC_ASSETS_PATH}/minigame.png`,
};

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
          id="airdrops"
          headingText="Airdrops"
          image={assets["airdrop"]}
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
            with our APIs for full control over the claim experience. Use Moonstream-backed
            leaderboards to automatically reward players for their on-chain activity.
            <br />
            <br />
            Gaming projects have used Moonstream to drop over $80,000,000 worth of tokens and items
            to date.
          </>
        </FeatureCard>
        <FeatureCard
          id="minigames"
          headingText="Minigames"
          image={assets["minigame"]}
          cardOrder={-1}
          isMobile={isBaseView}
        >
          <>
            Use Moonstream to deploy on-chain minigames into your project. Our growing minigame
            library contains games of various genres. Use these minigames as faucets to tokens into
            your economy, and as sinks to take tokens out of your economy.
            <br />
            <br />
            Our minigame smart contracts process over $700,000,000 per month in transaction volume.
          </>
        </FeatureCard>
        <FeatureCard
          id="lootboxes"
          headingText="Lootboxes"
          image={assets["openLootbox"]}
          cardOrder={1}
          isMobile={isBaseView}
        >
          <>
            Use Moonstream Lootboxes to reward your players on-chain for completing quests,
            defeating bosses, or improving your community. Lootboxes can hold ERC20 tokens, items,
            consumables, or NFTs. Moonstream Lootboxes can be randomized using Chainlink VRF and you
            have full control over drop rates.
            <br />
            <br />
            There are currently over 14,000 Moonstream Lootboxes in circulation.
          </>
        </FeatureCard>
        <FeatureCard
          id="crafting"
          headingText="Crafting"
          image={assets["craftingRecipe"]}
          cardOrder={-1}
          isMobile={isBaseView}
          pb="40px"
        >
          <>
            Use Moonstream to set up a fully on-chain crafting system and give your players the
            power to create new items in your game economy. Productive players are the key to
            sustainable blockchain games, and Moonstream Crafting allows your players to act as
            producers.
            <br />
            <br />
            Upload your crafting recipes as spreadsheets and watch as players craft items that
            breathe life into your economy. Moonstream Crafting is an alpha feature of our engine.
            Reach out to us on Discord for early access.
          </>
        </FeatureCard>
      </Container>
    </LayoutLanding>
  );
};

export default Features;
