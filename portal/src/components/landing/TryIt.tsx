import { Flex, Link, useDisclosure } from "@chakra-ui/react";
import styles from "./TryIt.module.css";
import SignUp from "../SignUp";

const TryIt = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Flex className={styles.container} mx={"7%"}>
      <div className={styles.header}>
        <div className={styles.title}>
          Sustainable game economy
          <br /> design made easy
        </div>
        <div className={styles.subtitle}>
          Use our tools to fix inflation, test your theories, direct player engagement, and
          distribute player rewards.
        </div>
      </div>
      <div className={styles.buttons}>
        <Link
          isExternal
          href={"https://calendly.com/d/5dr-xh2-xq6/moonstream-demo "}
          _hover={{ textDecoration: "none" }}
        >
          <button className={styles.button1}>Request a Demo</button>
        </Link>
        <button className={styles.button2} onClick={onOpen}>
          Get Started
        </button>
        <SignUp isOpen={isOpen} onClose={onClose} />
      </div>
      <div className={styles.footer}>
        Try it out for <span className={styles.gradientText}>FREE</span>. Contact us for pricing
        information if you prefer to onboard and get support.
      </div>
    </Flex>
  );
};

export default TryIt;
