import React, { KeyboardEvent, useEffect, useRef, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { Spinner } from "@chakra-ui/react";

import { AuthService } from "../../services";
import useMoonToast from "../../hooks/useMoonToast";
import useUser from "../../contexts/UserContext";
import styles from "./NewTokenForm.module.css";
import { MoonstreamAPIToken } from "./TokensList";

interface NewTokenFormProps {
  isOpen: boolean;
  onClose: () => void;
}
const NewTokenForm: React.FC<NewTokenFormProps> = ({ isOpen, onClose }) => {
  const { user } = useUser();
  const [label, setLabel] = useState("");
  const [password, setPassword] = useState("");
  const [isLabelReady, setIsLabelReady] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  const toast = useMoonToast();
  const queryClient = useQueryClient();
  const createToken = useMutation(AuthService.login, {
    onSuccess: (res) => {
      onClose();
      toast("New token created", "success");
      queryClient.invalidateQueries("tokens");
      queryClient.setQueryData(
        ["tokens", user],
        (oldData: { token: MoonstreamAPIToken[] } | undefined) => {
          if (!oldData) return { token: [...res.data] };
          return { ...oldData, token: [...(oldData.token || []), { ...res.data }] };
        },
      );
    },
    onError: (error: any) => {
      console.log(error);
      const detail = error.response?.data?.detail;
      const message = detail ? `${error.message}\n${detail}` : error.message;
      toast(message, "error", 5000);
    },
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    createToken.mutate({ username: user.username, password, token_note: label });
  };

  const handleLabelKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (!isLabelReady) {
        setIsLabelReady(true);
      } else {
        if (passwordInputRef.current) {
          passwordInputRef.current.focus();
        }
      }
    }
  };

  useEffect(() => {
    setIsLabelReady(false);
    setLabel("");
    setPassword("");
  }, [isOpen]);

  useEffect(() => {
    if (isLabelReady && passwordInputRef.current) {
      passwordInputRef.current.focus();
    }
  }, [isLabelReady]);

  if (!isOpen) return null;

  return (
    <form onSubmit={handleSubmit}>
      <div className={styles.container}>
        <div className={styles.title}>New API access token</div>
        <div className={styles.inputs}>
          <label className={styles.label} htmlFor={"tokenLabelInput"}>
            API token label
          </label>
          <input
            className={styles.input}
            id={"tokenLabelInput"}
            type={"text"}
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            autoComplete="off"
            autoFocus={true}
            onKeyDown={handleLabelKeyDown}
            placeholder={"Enter token label"}
          />
          {isLabelReady && (
            <>
              <div className={styles.divider} />
              <label className={styles.label} htmlFor={"passwordInput"}>
                Password*
              </label>
              <input
                className={styles.input}
                id={"passwordInput"}
                type={"password"}
                value={password}
                autoComplete={"current-password"}
                ref={passwordInputRef}
                placeholder={"Enter your password"}
                onChange={(e) => setPassword(e.target.value)}
              />
            </>
          )}
        </div>
        <div className={styles.buttons}>
          <button type={"button"} className={styles.cancelButton} onClick={onClose}>
            Cancel
          </button>
          {isLabelReady && (
            <button
              type={"submit"}
              className={styles.okButton}
              disabled={!password || createToken.isLoading}
            >
              {createToken.isLoading ? <Spinner w={4} h={4} /> : "Create"}
            </button>
          )}
          {!isLabelReady && (
            <button
              type={"button"}
              className={styles.okButton}
              onClick={() => {
                setIsLabelReady(true);
              }}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </form>
  );
};

export default NewTokenForm;
