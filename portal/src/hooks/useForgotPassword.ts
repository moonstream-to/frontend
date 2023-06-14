import { useEffect } from "react";
import { useMutation } from "react-query";
import useAuthResultHandler from "./useAuthHandler";
import { useToast } from ".";
import { AuthService } from "../services";

interface ErrorResponse {
  response?: {
    data?: {
      detail?: string;
    };
  };
}

const useForgotPassword = () => {
  const toast = useToast();
  const {
    mutate: forgotPassword,
    isLoading,
    error,
    data,
  } = useMutation(AuthService.forgotPassword);
  useAuthResultHandler(data, error, "Please check your inbox for verification URL.", "Error");

  useEffect(() => {
    if ((error as ErrorResponse)?.response?.data?.detail) {
      toast((error as ErrorResponse)?.response?.data?.detail, "error");
    }
  }, [error, toast, data]);

  return { forgotPassword, isLoading, data };
};

export default useForgotPassword;
