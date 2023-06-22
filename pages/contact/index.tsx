import { Flex } from "@chakra-ui/react";
import ContactForm from "../../src/components/ContactForm";
import LayoutLanding from "../../src/components/layoutLanding";

const Contact = () => {
  return (
    <LayoutLanding home={false}>
      <Flex px="7%" gap="40px" py="40px" direction="column" justifyContent="start" h="100%">
        <ContactForm />
      </Flex>
    </LayoutLanding>
  );
};

export default Contact;
