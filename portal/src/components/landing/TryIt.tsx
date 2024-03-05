import { Flex, useDisclosure } from "@chakra-ui/react";
import styles from "./TryIt.module.css";
import SignUp from "../SignUp";

const TryIt = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Flex className={styles.container} mx={"7%"}>
      <div className={styles.header}>
        <div className={styles.title}>Build sustainable game economies</div>
        <div className={styles.subtitle}>
          Improve player retention and player engagement; support your blockchain integration.
        </div>
      </div>
      <div className={styles.buttons}>
        <button
          className={styles.secondaryButton}
          onClick={() =>
            window.open("https://calendly.com/d/5dr-xh2-xq6/moonstream-demo ", "_blank")
          }
        >
          Request a Demo
        </button>

        <SignUp isOpen={isOpen} onClose={onClose} />
        <button className={styles.ctaButton} onClick={onOpen}>
          Get Started
        </button>
      </div>
      <div className={styles.footer}>
        Try it out for <span className={styles.gradientText}>FREE</span>. Contact us for pricing
        information if you prefer to onboard and get support.
      </div>
    </Flex>
  );
};

export default TryIt;
