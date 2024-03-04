import styles from "./ThreeSteps.module.css";
import { Flex, Link, Text, Image, useMediaQuery } from "@chakra-ui/react";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";

const ThreeSteps = () => {
  const [is768view] = useMediaQuery(["(min-width: 768px) and (max-width: 1023px)"]);
  return (
    <Flex className={styles.container}>
      <Text className={styles.title}>Manage your game’s economy in 3 simple steps</Text>
      <Flex className={styles.steps}>
        <Flex direction={"column"} gap={"0"} flex={"1"}>
          <Text className={styles.subtitle}>Get started</Text>
          <Text className={styles.text}>
            Create a Moonstream account to access the{" "}
            <Link isExternal href={"/portal"} textDecoration={"underline"}>
              Portal
            </Link>
            , or{" "}
            <Link
              isExternal
              textDecoration={"underline"}
              href={"https://calendly.com/d/5dr-xh2-xq6/moonstream-demo "}
            >
              contact us
            </Link>{" "}
            to request a demo.
          </Text>
        </Flex>
        <Flex direction={"column"} gap={"0"} flex={"1"}>
          <Text className={styles.subtitle}>Set up your LiveOps </Text>
          <Text className={styles.text}>
            Create engaging in-game events with{" "}
            <span style={{ fontWeight: "700" }}>leaderboards</span> and{" "}
            <span style={{ fontWeight: "700" }}>on-chain game mechanics</span> as sinks, distribute
            rewards with <span style={{ fontWeight: "700" }}>drops</span>, and track your successes
            with live <span style={{ fontWeight: "700" }}>analytics</span>.
          </Text>
        </Flex>
        <Flex direction={"column"} gap={"0"} flex={"1"}>
          <Text className={styles.subtitle}>Share LiveOps experiences with your players</Text>
          <Text className={styles.text}>
            Share your LiveOps experience with your players with the Moonstream Portal or on your UI
            through the API.
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
