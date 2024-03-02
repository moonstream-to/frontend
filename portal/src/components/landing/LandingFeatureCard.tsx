import Link from "next/link";

import { Flex, Image, Spacer, Text } from "@chakra-ui/react";
import styles from "./LandingFeatureCard.module.css";

const LandingFeatureCard = ({
  feature,
  disabled,
  isMainCard = false,
  ...props
}: {
  feature: {
    name: string;
    description: string;
    image: string;
    href: string;
  };
  isMainCard?: boolean;
  disabled?: boolean;
  [x: string]: any;
}) => {
  return (
    <Flex className={isMainCard ? styles.gradientContainer : styles.solidContainer} {...props}>
      <Flex className={styles.container}>
        <Image src={feature.image} w="140px" h="140px" alt={feature.name} />
        <Flex className={styles.content}>
          <Text
            className={isMainCard ? styles.gradientText : styles.title}
            fontSize="24px"
            fontWeight="700"
            mb="10px"
          >
            {feature.name}
          </Text>
          <div
            dangerouslySetInnerHTML={{ __html: feature.description }}
            className={styles.description}
          />
          <Link
            href={feature.href}
            style={{ pointerEvents: disabled ? "none" : "all" }}
            className={styles.link}
          >
            Learn more
          </Link>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default LandingFeatureCard;
