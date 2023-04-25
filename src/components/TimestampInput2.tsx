import { Flex, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const TimestampInput2 = ({
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
    setComponents(String(date.getTime() / 1000));
  }, []);

  useEffect(() => {
    const newTimestamp = String(
      Date.UTC(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hour),
        Number(min),
        Number(sec),
      ) / 1000,
    );
    setTimestamp(newTimestamp);
  }, [year, month, day, hour, min, sec]);

  const setComponents = (timestampString: string) => {
    const date = new Date(Number(timestampString) * 1000);
    setYear(String(date.getUTCFullYear()));
    setMonth(String(date.getUTCMonth() + 1));
    setDay(String(date.getUTCDate()));
    setHour(String(date.getUTCHours()));
    setMin(String(date.getUTCMinutes()));
    setSec(String(date.getUTCSeconds()));
  };

  return (
    <Flex gap="10px" alignItems="end" fontSize="14px" w="100%">
      <Input
        minW="14ch"
        maxW="14ch"
        fontSize="14px"
        value={timestamp}
        p="10px"
        onChange={(e) => {
          setTimestamp(e.target.value);
          setComponents(e.target.value);
        }}
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
      <Text fontSize="12px">UTC</Text>
    </Flex>
  );
};

export default TimestampInput2;