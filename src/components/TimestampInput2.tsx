import { Flex, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const TimestampInput2 = ({
  timestamp,
  setTimestamp,
}: {
  timestamp: string;
  setTimestamp: (arg0: string) => void;
}) => {
  const [value, setValue] = useState(0);
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const [hour, setHour] = useState("");
  const [min, setMin] = useState("");
  const [sec, setSec] = useState("");

  const components = [
    { value: year, setValue: setYear, label: "Yr" },
    { value: month, setValue: setMonth, label: "Mon" },
    { value: day, setValue: setDay, label: "Day" },
    { value: hour, setValue: setHour, label: "Hr" },
    { value: min, setValue: setMin, label: "Min" },
    { value: sec, setValue: setSec, label: "Sec" },
  ];

  useEffect(() => {
    let date: Date;
    if (timestamp) {
      date = new Date(Number(timestamp) * 1000);
    } else {
      date = new Date(Date.now());
      date.setMinutes(0);
      date.setSeconds(0);
      date.setMilliseconds(0);
    }
    setYear(String(date.getUTCFullYear()));
    setMonth(String(date.getUTCMonth() + 1));
    setDay(String(date.getUTCDate()));
    setHour(String(date.getUTCHours()));
    setMin(String(date.getUTCMinutes()));
    setSec(String(date.getUTCSeconds()));
  }, [timestamp]);

  useEffect(() => {
    const dateComponents = components.map((component) => Number(component.value));
    setValue(
      Date.UTC(
        dateComponents[0],
        dateComponents[1] - 1,
        dateComponents[2],
        dateComponents[3],
        dateComponents[4],
        dateComponents[5],
      ) / 1000,
    );
  }, [year, month, day, hour, min, sec]);

  return (
    <Flex gap="10px" alignItems="end" fontSize="14px" w="100%">
      <Input
        minW="14ch"
        maxW="14ch"
        fontSize="14px"
        value={value}
        p="10px"
        onChange={(e) => setTimestamp(e.target.value)}
        border="1px solid #4D4D4D"
      />
      {components.map((component) => (
        <Flex
          direction="column"
          key={component.label}
          alignItems="center"
          justifyContent="space-between"
          h="100%"
        >
          <Text p="0px" color="#CCCCCC" fontSize="12px" lineHeight="12px">
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
      <Text fontSize="12px">GMT</Text>
    </Flex>
  );
};

export default TimestampInput2;
