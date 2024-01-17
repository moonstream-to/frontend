import { Flex, Image, Text } from "@chakra-ui/react";
import styles from "./BlackBlock.module.css";
import commonStyles from "../common.module.css";

const BlackBlock = ({
  title,
  image,
  description,
  buttonText,
  buttonRef,
}: {
  title: string;
  image: string;
  description: string;
  buttonText: string;
  buttonRef: string;
}) => {
  return (
    <Flex className={styles.container}>
      <Text className={styles.title}>{title}</Text>
      <Flex className={styles.content}>
        <Image src={image} alt={""} />
        <Text className={styles.description}>{description}</Text>
      </Flex>
      <button
        className={commonStyles.secondaryButton}
        onClick={() => window.open(buttonRef, "_blank")}
      >
        {buttonText}
      </button>
    </Flex>
  );
};

export default BlackBlock;
