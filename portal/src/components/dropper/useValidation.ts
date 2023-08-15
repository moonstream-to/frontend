// Custom hook for form validation
import { useState } from "react";
import Web3 from "web3";
import useMoonToast from "../../hooks/useMoonToast";
import { DropDBData, DropChainData } from "../../types";
import { DropV2ChainData } from "../dropperV2/DropperV2ChainDataEdit";

const useValidation = () => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const web3 = new Web3();
  const toast = useMoonToast();

  const isValid = (keys: string[]) => {
    let inputsAreValid = true;
    keys.forEach((k) => {
      if (errors[k]) {
        toast(errors[k], "error");
        inputsAreValid = false;
      }
    });
    return inputsAreValid;
  };

  const validateDBData = <T extends keyof DropDBData>(key: T, value: DropDBData[T]) => {
    const valueString = value as unknown as string;
    let errorMessage: string;
    switch (key) {
      case "terminusAddress":
        errorMessage = web3.utils.isAddress(valueString) ? "" : "Invalid Ethereum address";
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

  const validateChainDataV2 = <T extends keyof DropV2ChainData>(
    key: T,
    value: DropV2ChainData[T],
  ) => {
    const valueString = value as unknown as string;
    let errorMessage: string;
    switch (key) {
      case "signer":
        errorMessage = web3.utils.isAddress(valueString) ? "" : "Invalid Ethereum address";
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

  const validateChainData = <T extends keyof DropChainData>(key: T, value: DropChainData[T]) => {
    const valueString = value as unknown as string;
    let errorMessage: string;
    switch (key) {
      case "signer":
        errorMessage = web3.utils.isAddress(valueString) ? "" : "Invalid Ethereum address";
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

  return { errors, isValid, resetErrors, validateChainData, validateDBData, validateChainDataV2 };
};

export default useValidation;
