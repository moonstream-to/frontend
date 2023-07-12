import { Input, Select } from "@chakra-ui/react";
import { QueryInterface } from "./analytics/AnalyticsSmartContractQueries";
import { isValid } from "./analytics/validateParameters";
import TimestampInput from "./TimestampInput";

const ParamInput = ({
  onChange,
  query,
  abi,
  field,
  value,
}: {
  query: QueryInterface;
  abi?: any;
  onChange: (value: string) => void;
  field: string;
  value: string;
}) => {
  const options: string[] = [];
  if (!field) return <></>;

  if (query.title === "contract_events" && abi) {
    JSON.parse(abi).forEach((obj: any) => {
      if (obj.type === "event" && obj[field]) {
        options.push(obj[field]);
      }
    });
  } else {
    if (query.title === "contract_transactions" && abi) {
      JSON.parse(abi).forEach((obj: any) => {
        if (obj.type === "function" && obj.stateMutability !== "view" && obj[field]) {
          options.push(obj[field]);
        }
      });
    }
  }

  if (field.includes("timestamp")) {
    return (
      <TimestampInput
        timestamp={value ?? ""}
        setTimestamp={(newValue: string) => onChange(String(newValue))}
      />
    );
  }

  if (options.length) {
    return (
      <Select placeholder="" value={value} onChange={(e) => onChange(e.target.value)}>
        <option value=""></option>
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
      borderColor={isValid(field, value) || !value ? "#4d4d4d" : "error.500"}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      mr="10px"
    />
  );
};

export default ParamInput;
