import styles from "./ThreeSteps.module.css";
import { Flex, Link, Text, Image, useMediaQuery } from "@chakra-ui/react";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";

const ThreeSteps = () => {
  const [is768view] = useMediaQuery(["(min-width: 768px) and (max-width: 1023px)"]);
  return (
    <Flex className={styles.container}>
      <Text className={styles.title}>Manage your economy in 3 simple steps</Text>
      <Flex className={styles.steps}>
        <Flex direction={"column"} gap={"0"} flex={"1"}>
          <Text className={styles.subtitle}>Step 1</Text>
          <Text className={styles.text}>
            Sign up to create a Moonstream account to access the{" "}
            <Link isExternal href={"/portal"} textDecoration={"underline"}>
              Portal
            </Link>
            . Or request a demo.
          </Text>
        </Flex>
        <Flex direction={"column"} gap={"0"} flex={"1"}>
          <Text className={styles.subtitle}>Step 2</Text>
          <Text className={styles.text}>
            Set up analytics to watch your economy, create events with leaderboards as sinks, and
            reward your players with drops.
          </Text>
        </Flex>
        <Flex direction={"column"} gap={"0"} flex={"1"}>
          <Text className={styles.subtitle}>Step 3</Text>
          <Text className={styles.text}>
            Have beautiful leaderboards integrated into your game. You can use Moonstream
            leaderboard UI or create your own. Manage your economy.
          </Text>
        </Flex>
      </Flex>
      <Flex gap={"10px"} alignItems={"center"} ml={{ lg: "0px", md: "-34" }}>
        <Image
          h={"24px"}
          w={"24px"}
          src={`${AWS_STATIC_ASSETS_PATH}/landing/icons/message-square.svg`}
          alt={""}
        />
        {is768view ? (
          <Text className={styles.footer}>
            Have something to discuss before signing up? <br />
            <Link isExternal href="https://discord.gg/K56VNUQGvA" textDecoration={"underline"}>
              Join our Discord
            </Link>{" "}
            to get in touch with the team.
          </Text>
        ) : (
          <Text className={styles.footer}>
            Have something to discuss before signing up?{" "}
            <Link isExternal href="https://discord.gg/K56VNUQGvA" textDecoration={"underline"}>
              Join our Discord
            </Link>{" "}
            to get in touch with the team.
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default ThreeSteps;
