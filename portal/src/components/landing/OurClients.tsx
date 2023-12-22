import { Flex, Image, Link, Text } from "@chakra-ui/react";
import styles from "./OurClients.module.css";
import { AWS_STATIC_ASSETS_PATH } from "../../constants";
const logos = {
  cryptoGuilds: `${AWS_STATIC_ASSETS_PATH}/landing/logos/Logo-CG-white.png`,
  cryptoUnicorns: `${AWS_STATIC_ASSETS_PATH}/landing/logos/crypto-unicorns-logo.png`,
};

const OurClients = () => {
  return (
    <Flex className={styles.container}>
      <Text className={styles.title}>What our clients say</Text>
      <Flex className={styles.cards}>
        <Flex className={styles.card1}>
          <Image
            src={logos.cryptoUnicorns}
            alt={""}
            w={{ base: "64px", sm: "92px" }}
            h={{ base: "34px", sm: "49px" }}
          />
          <div>
            <Text fontSize={{ base: "18px", sm: "24px" }} fontWeight={"700"}>
              &quot;We chose Moonstream for security and trust. Moonstream is a huge part of our
              live ops process and has made it a lot more efficient and easy.&quot;
            </Text>
            <Link
              color={"#F88F78"}
              fontSize={"16px"}
              isExternal
              href={"https://blog.moonstream.to/2023/07/20/crypto-unicorns-and-moonstream/"}
            >
              Read more
            </Link>
          </div>
          <div>
            <Text className={styles.name}>Aron Beierschmitt, founder</Text>
            <Link isExternal href={"https://twitter.com/abearschmitt"}>
              <Text className={styles.social}>@abearschmitt</Text>
            </Link>
          </div>
        </Flex>
        <Flex className={styles.card2}>
          <Image
            src={logos.cryptoGuilds}
            alt={""}
            w={{ base: "123px", sm: "179px" }}
            h={{ base: "20px", sm: "28px" }}
          />
          <div>
            <Text fontSize={{ base: "18px", sm: "24px" }} fontWeight={"700"}>
              &quot;Moonstream has been doing exactly what we needed in a very easy way: upgradeable
              NFTs with inventory slots for badges, items, etc. Everything we need was already
              developed by Moonstream and ready to go.&quot;
            </Text>
            <Link
              color={"#F88F78"}
              fontSize={"16px"}
              isExternal
              href={
                "https://blog.moonstream.to/2023/07/12/crypto-guilds-and-moonstream-the-potential-of-gamified-gamer-guilds"
              }
            >
              Read more
            </Link>
          </div>
          <div>
            <Text className={styles.name}>Jeremie Henicz, founder</Text>
            <Link isExternal href={"https://fr.linkedin.com/in/jeremie-henicz/en"}>
              <Text className={styles.social}>@jeremie-henicz</Text>
            </Link>
          </div>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default OurClients;
