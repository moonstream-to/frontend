import Web3 from "web3";

const web3 = new Web3();

const parameterTypes: { [key: string]: string } = {
  amount: "integer",
  address: "address",
  contract_address: "address",
  claim_id: "string",
  session_id: "string",
  name: "string",
  block_number: "integer",
  block_timestamp: "integer",
  transaction_hash: "string",
  label_data: "jsonb",
  event_name: "string",
  event_args: "jsonb",
  token_id: "string",
  current_owner: "address",
  previous_owner: "address",
  previous_owner_balance: "integer",
  current_owner_balance: "integer",
  previous_owner_balance_delta: "integer",
  user_address: "address",
  start_block_number: "integer",
  end_block_number: "integer",
  blocks_back: "integer",
  limit: "integer",
  time_range: "string",
  time_format: "string",
  contract_addresses: "array[address]",
  contracts_list: "array[address]",
  start_timestamp: "integer",
  end_timestamp: "integer",
  type: "string",
};

const isValidAddress = (address: string): boolean => {
  try {
    return web3.utils.isAddress(address);
  } catch {
    return false;
  }
};

const isValidJson = (json: string): boolean => {
  try {
    JSON.parse(json);
    return true;
  } catch {
    return false;
  }
};

const isValidArrayAddress = (addresses: string[]): boolean => {
  return addresses.every((address) => isValidAddress(address));
};

export const isValid = (name: string, value: string): boolean => {
  const type = parameterTypes[name];

  if (!type) {
    return true;
  }

  switch (type) {
    case "integer":
      return /^\d+$/.test(value);
    case "string":
      return typeof value === "string";
    case "address":
      return isValidAddress(value);
    case "jsonb":
      return isValidJson(value);
    case "array[address]":
      let addresses: string[];
      try {
        addresses = JSON.parse(value);
      } catch {
        return false;
      }
      return isValidArrayAddress(addresses);
    default:
      return false;
  }
};

export const isValidArray = (fields: string[], values: string[]): boolean => {
  return fields.every((field, idx) => values[idx] !== "" && isValid(field, values[idx]));
};
