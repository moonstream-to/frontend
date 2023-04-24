import { useMutation, useQueryClient } from "react-query";
import useUser from "../contexts/UserContext";
import { AuthService } from "../services";

const useLogout = () => {
  // const router = useRouter()
  const cache = useQueryClient();
  const { mutate: logout, isLoading } = useMutation(AuthService.revoke, {
    onSuccess: () => {
      // router.push("/")
      setUser(null);
      localStorage.removeItem("MOONSTREAM_ACCESS_TOKEN");
      cache.clear();
    },
  });
  const { setUser } = useUser();

  return {
    logout,
    isLoading,
  };
};

export default useLogout;
