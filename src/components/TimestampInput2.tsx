import { useEffect, useState } from "react";

import { Flex, Input, Text, Icon } from "@chakra-ui/react";
import { BsArrowLeftRight } from "react-icons/bs";

const TimestampInput2 = ({
  timestamp,
  setTimestamp,
}: {
  timestamp: string;
  setTimestamp: (arg0: string) => void;
}) => {
  const [borderColor, setBorderColor] = useState("#4D4D4D");

  const initialState = {
    components: [
      { value: "", label: "Yr" },
      { value: "", label: "Mon" },
      { value: "", label: "Day" },
      { value: "", label: "Hr" },
      { value: "", label: "Min" },
      { value: "", label: "Sec" },
    ],
    epoch: "",
  };

  const [date, setDate] = useState({
    components: [...initialState.components],
    epoch: "",
  });

  const getComponents = (timestamp: string) => {
    const date = new Date(Number(timestamp) * 1000);
    const result = [...initialState.components];
    result[0].value = String(date.getUTCFullYear());
    result[1].value = String(date.getUTCMonth() + 1);
    result[2].value = String(date.getUTCDate());
    result[3].value = String(date.getUTCHours());
    result[4].value = String(date.getUTCMinutes());
    result[5].value = String(date.getUTCSeconds());
    return result;
  };

  const getEpoch = ([year, month, day, hour, min, sec]: string[]) => {
    return String(
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
  };

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
    const components = getComponents(String(date.getTime() / 1000));
    setDate({ epoch: String(date.getTime() / 1000), components });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleComponentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const components = [...date.components];
    components[Number(e.target.name)].value = e.target.value;
    console.log(components);
    setDate({
      epoch: getEpoch(components.map((c) => c.value)),
      components,
    });
  };

  useEffect(() => {
    setTimestamp(date.epoch);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate({
      epoch: e.target.value,
      components: getComponents(e.target.value),
    });
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const value = e.clipboardData.getData("text/plain");
    const date = new Date(value);
    if (!isNaN(date.getTime())) {
      e.preventDefault();
      const components = getComponents(String(date.getTime() / 1000));
      setDate({ epoch: String(date.getTime() / 1000), components });
    }
  };

  useEffect(() => {
    setBorderColor(Number(timestamp) || !timestamp || timestamp === "0" ? "#4d4d4d" : "error.500");
  }, [timestamp]);

  return (
    <Flex gap="10px" alignItems="center" fontSize="14px" w="100%">
      <Input
        minW="14ch"
        maxW="14ch"
        fontSize="14px"
        value={date.epoch}
        p="10px"
        type="number"
        onChange={handleTimestampChange}
        border="1px solid #4D4D4D"
        borderColor={borderColor}
        _hover={{ borderColor }}
        _focusVisible={{ borderColor, outline: "none" }}
        onPaste={handlePaste}
        title="you can paste date in ISO 8601, RFC 822, 1036, 1123 or 3339 format"
      />
      <Icon as={BsArrowLeftRight} />
      {date.components.map((component, idx: number) => (
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
            name={String(idx)}
            w={component.label === "Yr" ? "6ch" : "4ch"}
            onChange={handleComponentChange}
            onPaste={handlePaste}
          />
        </Flex>
      ))}
      <Text fontSize="12px" userSelect="none" mt="auto">
        UTC
      </Text>
    </Flex>
  );
};

export default TimestampInput2;
