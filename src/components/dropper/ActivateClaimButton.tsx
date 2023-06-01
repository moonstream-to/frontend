import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Button } from "@chakra-ui/react";
import http from "../../utils/http";

type DropStateType = {
  id: string;
  active: boolean;
};

const ActivateClaimButton = ({ dropState }: { dropState: DropStateType }) => {
  const [tempCaption, setTempCaption] = useState("");
  const queryClient = useQueryClient();
  const API = process.env.NEXT_PUBLIC_ENGINE_API_URL ?? process.env.NEXT_PUBLIC_PLAY_API_URL;
  const ADMIN_API = `${API}/admin`;

  const setActive = useMutation(
    (active: boolean) => {
      if (!dropState) {
        return;
      }
      return http({
        method: "PUT",
        url: `${ADMIN_API}/drops/${dropState.id}/${active ? "" : "de"}activate`,
      }).then(() => setTempCaption(active ? "Activated" : "Deactivated"));
    },
    {
      onSuccess: () => {
        setTimeout(() => setTempCaption(""), 5000);
        queryClient.invalidateQueries("claimAdmin");
      },
    },
  );

  if (!dropState) {
    return <></>;
  }

  return dropState?.active ? (
    <Button
      variant="claimButton"
      bg="#e85858"
      _hover={{ bg: "#ff6565" }}
      onClick={() => setActive.mutate(false)}
      disabled={tempCaption !== "" || setActive.isLoading}
    >
      {tempCaption !== "" ? tempCaption : !setActive.isLoading ? "Deactivate" : "Deactivating..."}
    </Button>
  ) : (
    <Button
      variant="claimButton"
      bg="#f56646"
      _hover={{ bg: "#f37e5b" }}
      onClick={() => setActive.mutate(true)}
      disabled={tempCaption !== "" || setActive.isLoading}
    >
      {tempCaption !== "" ? tempCaption : !setActive.isLoading ? "Activate" : "Activating..."}
    </Button>
  );
};

export default ActivateClaimButton;
