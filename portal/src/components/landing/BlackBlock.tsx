import { Button, Flex, Image, Link, Text } from "@chakra-ui/react";
import styles from "./BlackBlock.module.css";

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

      <Flex direction={{ base: "column", sm: "row" }} gap="20px">
        <Link href={buttonRef} isExternal>
          <Button variant="whiteOutline">{buttonText}</Button>
        </Link>
      </Flex>
    </Flex>
  );
};

export default BlackBlock;
