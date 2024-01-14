import { Flex, useDisclosure } from "@chakra-ui/react";
import styles from "./TryIt.module.css";
import commonStyles from "../common.module.css";
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
        <button
          className={commonStyles.secondaryButton}
          onClick={() =>
            window.open("https://calendly.com/d/5dr-xh2-xq6/moonstream-demo ", "_blank")
          }
        >
          Request a Demo
        </button>

        <SignUp isOpen={isOpen} onClose={onClose} />
        <button className={commonStyles.ctaButton} onClick={onOpen}>
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
