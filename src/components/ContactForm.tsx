import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Spacer,
  Spinner,
  Text,
  Textarea,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { useMutation } from "react-query";

import useMoonToast from "../hooks/useMoonToast";

const API = "http://auth.bugout.dev";

const ContactForm = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [about, setAbout] = useState("");
  const [link, setLink] = useState("");
  const toast = useMoonToast();

  const [isValidated, setIsValidated] = useState(false);

  const isEmailError = email === "" && isValidated;
  const isNameError = name === "" && isValidated;

  const sendFormFn = ({
    name,
    email,
    website,
    about,
    link,
  }: {
    name: string;
    email: string;
    website: string;
    about: string;
    link: string;
  }) => {
    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    if (website) {
      data.append("website", website);
    }
    if (about) {
      data.append("project_about", about);
    }
    if (link) {
      data.append("paper_link", link);
    }

    return axios({
      method: "POST",
      url: `${API}/contact`,
      data,
      headers: { "Content-Type": "multipart/form-data" },
    });
  };

  const sendForm = useMutation(sendFormFn, {
    onSuccess: () => {
      toast("Form sent", "success");
    },
    onError: (e: any) => {
      const msg = e.response?.data?.detail ?? e.message;
      toast(msg, "error", 7000, "Sending failed");
    },
  });

  const handleSave = () => {
    if (email === "" || name === "") {
      setIsValidated(true);
      let errorMessage = "";
      if (!email) {
        errorMessage = `Email ${!name ? "and name are" : "is"} required`;
      } else {
        errorMessage = `Name is required`;
      }
      toast(errorMessage, "error");
      return;
    }
    sendForm.mutate({ name, email, website, about, link });
  };

  return (
    <Flex borderRadius="20px" p="30px" direction="column" gap="20px" bg="#2d2d2d">
      <Text fontSize="18px" fontWeight="700">
        Thanks for your interest in Moonstream. Our tools are fully customized to your project.
      </Text>
      <Text fontSize="18px">Please answer these questions to get started:</Text>
      <FormControl isInvalid={isNameError}>
        <FormLabel>
          Name<sup>*</sup>
        </FormLabel>
        <Input type="name" value={name} onChange={(e) => setName(e.target.value)} />
      </FormControl>
      <FormControl isInvalid={isEmailError}>
        <FormLabel>
          Email<sup>*</sup>
        </FormLabel>
        <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>Website</FormLabel>
        <Input type="text" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>
          Tell us more about your project (release date, blockchain, genre, etc.):
        </FormLabel>
        <Textarea value={about} onChange={(e) => setAbout(e.target.value)} />
      </FormControl>
      <FormControl>
        <FormLabel>
          Link us to your project’s whitepaper or any other sources to explain your game’s economy:
        </FormLabel>
        <Textarea value={link} onChange={(e) => setLink(e.target.value)} />
      </FormControl>
      <Flex gap="15px">
        <Spacer />
        <Button variant="cancelButton">Cancel</Button>
        {sendForm.isLoading ? (
          <Spinner />
        ) : (
          <Button variant="saveButton" onClick={handleSave}>
            Grow a helthy economy
          </Button>
        )}
      </Flex>
    </Flex>
  );
};

export default ContactForm;
