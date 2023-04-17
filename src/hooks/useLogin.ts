import { useMutation } from "react-query";
import { useToast } from ".";
import useUser from "../contexts/UserContext";
import { AuthService } from "../services";

const useLogin = () => {
  const { getUser } = useUser();
  const toast = useToast();
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
    onError: (error) => {
      toast(error, "error");
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
