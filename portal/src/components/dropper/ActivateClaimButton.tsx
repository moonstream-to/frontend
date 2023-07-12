import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Button } from "@chakra-ui/react";
import http from "../../utils/http";

interface DropStateType {
  id: string;
  active: boolean;
}

interface ActivateClaimButtonProps {
  dropState: DropStateType;
}

const ActivateClaimButton: React.FC<ActivateClaimButtonProps> = ({ dropState }) => {
  const [buttonLabel, setButtonLabel] = useState("");
  const queryClient = useQueryClient();
  const API = process.env.NEXT_PUBLIC_ENGINE_API_URL || process.env.NEXT_PUBLIC_PLAY_API_URL;
  const ADMIN_API = `${API}/admin`;

  const setActive = useMutation(
    (active: boolean) => {
      if (!dropState) {
        return;
      }
      return http({
        method: "PUT",
        url: `${ADMIN_API}/drops/${dropState.id}/${active ? "" : "de"}activate`,
      }).then(() => setButtonLabel(active ? "Activated" : "Deactivated"));
    },
    {
      onSuccess: () => {
        setTimeout(() => setButtonLabel(""), 5000);
        queryClient.invalidateQueries("claimAdmin");
      },
    },
  );

  if (!dropState) {
    return null;
  }

  const buttonColor = dropState.active ? "#e85858" : "#f56646";
  const hoverColor = dropState.active ? "#ff6565" : "#f37e5b";
  const mutationAction = !dropState.active;
  const buttonText =
    buttonLabel ||
    (setActive.isLoading
      ? `${mutationAction ? "Activating" : "Deactivating"}...`
      : mutationAction
      ? "Activate"
      : "Deactivate");

  return (
    <Button
      variant="claimButton"
      bg={buttonColor}
      _hover={{ bg: hoverColor }}
      onClick={() => setActive.mutate(mutationAction)}
      isDisabled={Boolean(buttonLabel) || setActive.isLoading}
    >
      {buttonText}
    </Button>
  );
};

export default ActivateClaimButton;
