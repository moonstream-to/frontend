import { useToast as useChakraToast } from "@chakra-ui/react";
import { useCallback } from "react";
// import mixpanel from "mixpanel-browser";
// import { MIXPANEL_EVENTS } from "../providers/AnalyticsProvider/constants";

const useToast = () => {
  const chakraToast = useChakraToast();

  const toast = useCallback(
    (message, type, title) => {
      const userTitle = title ?? message?.response?.statusText ?? type;

      const userMessage =
        message?.response?.data?.detail ?? typeof message === "string"
          ? message
          : userTitle === type
          ? ""
          : type;
      const id = `${userTitle}-${userMessage}-${type}`;
      if (!chakraToast.isActive(id)) {
        chakraToast({
          id: id,
          position: "bottom",
          title: userTitle,
          description: userMessage,
          status: type,
          duration: 1500,
        });
      }
    },
    [chakraToast],
  );

  return toast;
};

export default useToast;
