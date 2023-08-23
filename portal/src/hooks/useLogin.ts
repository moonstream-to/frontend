import { useMutation } from "react-query";
import useUser from "../contexts/UserContext";
import { AuthService } from "../services";
import useMoonToast from "./useMoonToast";

const useLogin = () => {
  const { getUser } = useUser();
  const toast = useMoonToast();
  const {
    mutate: login,
    isLoading,
    error,
    data,
  } = useMutation(AuthService.login, {
    onSuccess: (data: any) => {
      if (!data) {
        return;
      }
      localStorage.setItem("MOONSTREAM_ACCESS_TOKEN", data.data.id);
      getUser();
    },
    onError: (error: any) => {
      console.log(error);
      const message = error.response.data?.detail ?? error.message;
      toast(message, "error");
    },
  });

  return {
    login,
    isLoading,
    data,
    error,
  };
};

export default useLogin;
