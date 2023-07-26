import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Button } from "@chakra-ui/react";
import http from "../../utils/http";
import useMoonToast from "../../hooks/useMoonToast";

interface DropStateType {
  dropId: string;
  active: boolean;
}

interface ActivateDropButtonProps {
  dropState: DropStateType;
  handleError: (error: unknown) => void;
  dropperContract: any;
  account: string;
}

const ActivateDropButton: React.FC<ActivateDropButtonProps> = ({
  dropState,
  handleError,
  dropperContract,
  account,
}) => {
  const [buttonLabel, setButtonLabel] = useState("");
  const queryClient = useQueryClient();
  const API = process.env.NEXT_PUBLIC_ENGINE_API_URL || process.env.NEXT_PUBLIC_PLAY_API_URL;
  const ADMIN_API = `${API}/admin`;

  const toast = useMoonToast();
  const commonMutationOptions = {
    onSuccess: () => {
      toast("Successfully updated drop", "success");
      queryClient.invalidateQueries("dropsList");
      queryClient.invalidateQueries("dropState");
      setTimeout(() => setButtonLabel(""), 5000);
    },
    onError: handleError,
  };

  const setDropStatus = useMutation(
    ({ status }: { status: boolean }) =>
      dropperContract.methods
        .setDropStatus(dropState.dropId, status)
        .send({ from: account })
        .then(() => setButtonLabel(status ? "Activated" : "Deactivated")),
    commonMutationOptions,
  );

  if (!dropState) {
    return null;
  }

  const buttonColor = dropState.active ? "#e85858" : "#f56646";
  const hoverColor = dropState.active ? "#ff6565" : "#f37e5b";
  const mutationAction = !dropState.active;
  const buttonText =
    buttonLabel ||
    (setDropStatus.isLoading
      ? `${mutationAction ? "Activating" : "Deactivating"}...`
      : mutationAction
      ? "Activate"
      : "Deactivate");

  return (
    <Button
      variant="claimButton"
      bg={buttonColor}
      _hover={{ bg: hoverColor }}
      onClick={() => setDropStatus.mutate({ status: mutationAction })}
      isDisabled={Boolean(buttonLabel) || setDropStatus.isLoading}
    >
      {buttonText}
    </Button>
  );
};

export default ActivateDropButton;
