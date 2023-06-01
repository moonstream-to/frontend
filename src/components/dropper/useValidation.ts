// Custom hook for form validation
import { useState } from "react";
import { DropDBData, DropChainData } from "../../types";
import { MoonstreamWeb3ProviderInterface } from "../../types/Moonstream";

const useValidation = (ctx: MoonstreamWeb3ProviderInterface) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateDBData = <T extends keyof DropDBData>(key: T, value: DropDBData[T]) => {
    const valueString = value as unknown as string;
    let errorMessage: string;
    switch (key) {
      case "terminusAddress":
        errorMessage = ctx.web3.utils.isAddress(valueString) ? "" : "Invalid Ethereum address";
        break;
      case "terminusPoolId":
        errorMessage = Number.isInteger(Number(valueString)) ? "" : "Pool ID should be an integer";
        break;
      case "deadline":
        const dateFromTimestamp = new Date(Number(valueString) * 1000);
        const isValidTimestamp = !isNaN(dateFromTimestamp.getTime());
        errorMessage = isValidTimestamp ? "" : "Invalid timestamp";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [key]: errorMessage }));
  };

  const validateChainData = <T extends keyof DropChainData>(key: T, value: DropChainData[T]) => {
    const valueString = value as unknown as string;
    let errorMessage: string;
    switch (key) {
      case "signer":
        errorMessage = ctx.web3.utils.isAddress(valueString) ? "" : "Invalid Ethereum address";
        break;
      case "uri":
        errorMessage = /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm.test(valueString)
          ? ""
          : "Invalid URL";
        break;
      default:
        break;
    }
    setErrors((prevErrors) => ({ ...prevErrors, [key]: errorMessage }));
  };

  const resetErrors = () => setErrors({});

  return { errors, resetErrors, validateChainData, validateDBData };
};

export default useValidation;
