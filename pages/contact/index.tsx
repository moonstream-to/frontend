import { Flex } from "@chakra-ui/react";
import ContactForm from "../../src/components/ContactForm";
import Layout from "../../src/components/layout";

const Contact = () => {
  return (
    <Layout home={false}>
      <Flex px="7%" gap="40px" py="40px" direction="column" justifyContent="start" h="100%">
        <ContactForm />
      </Flex>
    </Layout>
  );
};

export default Contact;
