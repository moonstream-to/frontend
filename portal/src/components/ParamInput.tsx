import { Input, Select } from "@chakra-ui/react";
import { QueryInterface } from "./analytics/AnalyticsSmartContractQueries";
import { isValid } from "./analytics/validateParameters";
import TimestampInput from "./TimestampInput";

const ParamInput = ({
  param,
  onChange,
  query,
  abi,
}: {
  param: { key: string; value: string };
  query: QueryInterface;
  abi?: any;
  onChange: (value: string) => void;
}) => {
  const options: string[] = [];

  if (query.title === "contract_events" && abi) {
    JSON.parse(abi).forEach((obj: any) => {
      if (obj.type === "event" && obj[param.key]) {
        options.push(obj[param.key]);
      }
    });
  } else {
    if (query.title === "contract_transactions") {
      JSON.parse(abi).forEach((obj: any) => {
        if (obj.outputs?.length === 0 && obj[param.key]) {
          options.push(obj[param.key]);
        }
      });
    }
  }

  if (param.key?.includes("timestamp")) {
    return (
      <TimestampInput
        timestamp={param.value ?? ""}
        setTimestamp={(newValue: string) => onChange(String(newValue))}
      />
    );
  }

  if (options.length) {
    return (
      <Select placeholder="">
        {options.map((option, idx) => (
          <option key={idx} value={option}>
            {option}
          </option>
        ))}
      </Select>
    );
  }

  return (
    <Input
      flex="2"
      h="40px"
      variant="address"
      border="1px solid #4D4D4D"
      borderColor={isValid(param.key, param.value) || !param.value ? "#4d4d4d" : "error.500"}
      value={param.value}
      onChange={(e) => onChange(e.target.value)}
      mr="10px"
    />
  );
};

export default ParamInput;
