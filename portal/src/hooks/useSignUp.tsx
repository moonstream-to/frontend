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
      // router.push("/welcome", undefined, { shallow: false });
    },
    onError: (error: Error) => {
      toast(error.message, "error");
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
