import { useEffect, useState } from "react";

import { Flex, Input, Text, Icon, Button } from "@chakra-ui/react";
import { BsArrowLeftRight } from "react-icons/bs";
import useMoonToast from "../hooks/useMoonToast";

const TSInput = ({
  timestamp,
  setTimestamp,
}: {
  timestamp: string;
  setTimestamp: (arg0: string) => void;
}) => {
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");
  const [min, setMin] = useState("");
  const [sec, setSec] = useState("");
  const [borderColor, setBorderColor] = useState("#4D4D4D");

  const components = [
    { value: year, setValue: setYear, label: "Yr" },
    { value: month, setValue: setMonth, label: "Mon" },
    { value: day, setValue: setDay, label: "Day" },
    { value: hour, setValue: setHour, label: "Hr" },
    { value: min, setValue: setMin, label: "Min" },
    { value: sec, setValue: setSec, label: "Sec" },
  ];

  const toast = useMoonToast();

  useEffect(() => {
    let date: Date;
    if (Number(timestamp)) {
      date = new Date(Number(timestamp) * 1000);
    } else {
      date = new Date(Date.now());
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
    }
    setComponents(String(date.getTime() / 1000));
  }, []);

  useEffect(() => {
    const newTimestamp = String(
      Math.round(
        Date.UTC(
          Number(year),
          Number(month) - 1,
          Number(day),
          Number(hour),
          Number(min),
          Number(sec),
        ) / 1000,
      ),
    );
    setTimestamp(newTimestamp);
  }, [year, month, day, hour, min, sec]);

  useEffect(() => {
    setBorderColor(Number(timestamp) || !timestamp || timestamp === "0" ? "#4d4d4d" : "error.500");
  }, [timestamp]);

  const setComponents = (timestamp: string) => {
    const date = new Date(Number(timestamp) * 1000);
    setYear(String(date.getUTCFullYear()));
    setMonth(String(date.getUTCMonth() + 1));
    setDay(String(date.getUTCDate()));
    setHour(String(date.getUTCHours()));
    setMin(String(date.getUTCMinutes()));
    setSec(String(date.getUTCSeconds()));
  };

  return (
    <Flex gap="10px" alignItems="center" fontSize="14px" w="100%">
      <Input
        minW="14ch"
        maxW="14ch"
        fontSize="14px"
        value={timestamp}
        p="10px"
        type="number"
        onChange={(e) => {
          setTimestamp(e.target.value);
          setComponents(e.target.value);
        }}
        border="1px solid #4D4D4D"
        borderColor={borderColor}
        _hover={{ borderColor }}
        _focusVisible={{ borderColor, outline: "none" }}
      />
      <Icon as={BsArrowLeftRight} />
      {components.map((component) => (
        <Flex
          direction="column"
          key={component.label}
          alignItems="center"
          justifyContent="space-between"
        >
          <Text p="0px" color="#CCCCCC" fontSize="12px" lineHeight="12px" userSelect="none">
            {component.label}
          </Text>
          <Input
            fontSize="14px"
            value={component.value}
            type="number"
            textAlign="center"
            px="3px"
            mt="5px"
            h="20px"
            border="1px solid #4D4D4D"
            w={component.label === "Yr" ? "6ch" : "4ch"}
            onChange={(e) => {
              component.setValue(e.target.value);
            }}
          />
        </Flex>
      ))}
      <Text fontSize="12px" userSelect="none" mt="auto">
        UTC
      </Text>
      <Button
        onClick={() => {
          navigator.clipboard.readText().then((text) => {
            const date = new Date(text);
            if (!isNaN(date.getTime())) {
              const newTimestamp = String(Math.round(date.getTime() / 1000));
              setTimestamp(newTimestamp);
              setComponents(newTimestamp);
            } else {
              toast(
                "Can't parse date. I understand ISO 8601, RFC 822, 1036, 1123, 2822 and 3339",
                "error",
              );
            }
          });
        }}
      >
        Paste from clipboard
      </Button>
    </Flex>
  );
};

export default TSInput;
