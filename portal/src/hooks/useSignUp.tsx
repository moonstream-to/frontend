import { useMutation } from "react-query";
import { AuthService } from "../services";
import useMoonToast from "./useMoonToast";
import useUser from "../contexts/UserContext";

const useSignUp = () => {
  const { getUser } = useUser();
  const toast = useMoonToast();

  const {
    mutate: signUp,
    isLoading,
    error,
    data,
    isSuccess,
  } = useMutation(AuthService.register(), {
    onSuccess: (response) => {
      localStorage.setItem("MOONSTREAM_ACCESS_TOKEN", response.data.id);
      getUser();
    },
    onError: (error: any) => {
      console.log(error);
      let message = error.response.data?.detail ?? error.message;
      if (error.response?.status === 409) {
        message = "username or email already exists";
      }
      toast(message, "error", 5000);
    },
  });

  return {
    signUp,
    isLoading,
    data,
    error,
    isSuccess,
  };
};

export default useSignUp;
