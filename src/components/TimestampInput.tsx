import { Flex, Input, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

// const dateToTimestamp = (dateString: string) => {};

const getPattern = () => {
  const y = new Date("1999-03-25");
  const localeString = y.toLocaleDateString(undefined, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  // console.log(y, localeString);
  const dayPos = localeString.indexOf("25");
  const monthPos = localeString.indexOf("03");
  // const yearPos = localeString.indexOf("1999");
  const divider = localeString.charAt(Math.min(dayPos, monthPos) + 2);
  return {
    pattern:
      localeString.replace("1999", "YYYY").replace("25", "DD").replace("03", "MM") + "THH:mm:ss",
    divider,
  };
};

const TimestampInput = ({
  timestamp,
  setTimestamp,
}: {
  timestamp: string;
  setTimestamp: (arg0: string) => void;
}) => {
  const [value, setValue] = useState(timestamp);
  // const [dateFromDate, setDateFromDate] = useState(getPattern);
  const [valueOnPattern, setValueOnPattern] = useState("");
  const [dateFromTimestamp, setDateFromTimestamp] = useState("");
  const [fromDateIsBetter, setFromDateIsBest] = useState(false);
  const [fromTSIsBetter, setFromTSIsBest] = useState(false);

  const onChange = (newValue: string) => {
    setValue(newValue);
    const newChar = newValue.slice(-1);
    const pattern = getPattern().pattern;

    const newValueArray = newValue.split("");
    const newValuOnPatternArray: string[] = [];
    const requiredSymbols = ["D", "M", "Y", "H", "m", "s"];
    newValueArray.forEach((c: string) => {
      const pos = newValuOnPatternArray.length;
      if (!pattern.at(pos)) {
        return;
      }
      newValuOnPatternArray.push(c);
      if (!requiredSymbols.includes(pattern.at(pos + 1) ?? "")) {
        if (pattern.at(pos + 1)) {
          newValuOnPatternArray.push(pattern.at(pos + 1) ?? "");
        }
      }
    });
    const newValueOnPattern = newValuOnPatternArray.join("");
    let newDateString = "";
    if (newValueOnPattern.length === pattern.length) {
      const dayPos = pattern.indexOf("D");
      const monthPos = pattern.indexOf("M");
      const yearPos = pattern.indexOf("Y");
      const timePos = pattern.indexOf("T");
      if (dayPos > -1 && monthPos > -1 && yearPos > -1 && timePos > -1) {
        newDateString = `${newValueOnPattern.slice(yearPos, yearPos + 4)}-${newValueOnPattern.slice(
          monthPos,
          monthPos + 2,
        )}-${newValueOnPattern.slice(dayPos, dayPos + 2)}${newValueOnPattern.slice(timePos)}`;
        console.log(newDateString);
        console.log(new Date(newDateString));
      }
    }
    setValueOnPattern(newValueOnPattern);
    setTimestamp(newValue);
    const dateFromTS = new Date(Number(newValue));
    const dateFromDate = new Date(newDateString);
    if (dateFromTS.getTime() > 0) {
      setDateFromTimestamp(dateFromTS.toLocaleString());
      if (dateFromDate.getTime() > 0) {
        const today = Date.now();
        setFromDateIsBest(
          Math.abs(today - Number(newValue)) > Math.abs(today - Date.parse(newDateString)),
        );
        setFromTSIsBest(
          Math.abs(today - Number(newValue)) < Math.abs(today - Date.parse(newDateString)),
        );
      } else {
        setFromTSIsBest(true);
      }
    } else {
      if (dateFromDate.getTime() > 0) {
        setFromDateIsBest(true);
        setFromTSIsBest(false);
      } else {
        setFromDateIsBest(false);
      }
      setDateFromTimestamp("invalid date");
      setFromTSIsBest(false);
    }
  };

  return (
    <Flex gap="10px" alignItems="center" fontSize="14px" w="100%">
      <Input
        w="20ch"
        fontSize="12px"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        border="1px solid #4D4D4D"
      />
      <Flex direction="column" fontWeight={fromDateIsBetter ? "700" : "400"}>
        <Flex>
          <Text>{valueOnPattern}</Text>
          <Text color="#7d7d7d">{getPattern().pattern.slice(valueOnPattern.length)}</Text>
        </Flex>
        <Text>
          {new Date().toLocaleTimeString("en-us", { timeZoneName: "short" }).split(" ")[2]}
        </Text>
      </Flex>
      <Flex
        direction="column"
        fontWeight={fromTSIsBetter ? "700" : "400"}
        onClick={() => {
          setFromTSIsBest(true);
          setFromDateIsBest(false);
        }}
      >
        <Flex>
          <Text>{dateFromTimestamp}</Text>
        </Flex>
        <Text>
          {new Date().toLocaleTimeString("en-us", { timeZoneName: "short" }).split(" ")[2]}
        </Text>
      </Flex>
    </Flex>
  );
};

export default TimestampInput;
