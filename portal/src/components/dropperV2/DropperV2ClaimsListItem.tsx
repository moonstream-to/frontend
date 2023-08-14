import { useEffect, useState } from "react";
import { Flex, Spacer, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/react";

import useLink from "../../hooks/useLink";
import { SmallCloseIcon } from "@chakra-ui/icons";

const DropperV2ClaimsListItem = ({
  claimId,
  selected,
  onChange,
  uri,
  filter,
  statusFilter,
  inQuery,
  dropState,
}: {
  claimId: string;
  address: string;
  selected: boolean;
  onChange: (id: string, metadata: unknown) => void;
  uri: string;
  filter: string;
  statusFilter: string;
  inQuery: boolean;
  dropState: { active: boolean };
}) => {
  const metadata = useLink({ link: uri });

  const handleClick = () => {
    onChange(claimId, metadata.data);
  };

  useEffect(() => {
    if (selected) {
      onChange(claimId, metadata.data);
    }
  }, [selected, metadata.data, claimId, onChange]);

  const [statusShow, setStatusShow] = useState(true);
  useEffect(() => {
    if (!dropState) {
      setStatusShow(true);
      return;
    }
    if (dropState.active) {
      setStatusShow(statusFilter !== "inactive");
    } else {
      setStatusShow(statusFilter !== "active");
    }
  }, [dropState, statusFilter]);

  useEffect(() => {
    if (inQuery) {
      const element = document.getElementById(`claim-${claimId}`);
      element?.scrollIntoView({ block: "center" });
      const claimView = document.getElementById("claimView");
      claimView?.scrollIntoView();
    }
  }, [inQuery, claimId]);

  const [show, setShow] = useState(true);
  useEffect(() => {
    if (filter === "") {
      setShow(true);
      return;
    }
    const lowCaseFilter = filter.toLowerCase();
    if (metadata.data?.name?.toLowerCase().includes(lowCaseFilter)) {
      setShow(true);
      return;
    }
    if (metadata.data?.description?.toLowerCase().includes(lowCaseFilter)) {
      setShow(true);
      return;
    }
    if (claimId.toString().startsWith(lowCaseFilter)) {
      setShow(true);
      return;
    }
    if (lowCaseFilter === "inactive" && dropState?.active === false) {
      setShow(true);
      return;
    }
    if (lowCaseFilter === "active" && dropState?.active === true) {
      setShow(true);
      return;
    }
    setShow(false);
  }, [filter, metadata.data, claimId, dropState]);

  return (
    <>
      {show && statusShow && (
        <Flex
          gap="15px"
          alignItems="center"
          bg={selected ? "#4d4d4d" : "transparent"}
          fontWeight={selected ? "900" : "400"}
          borderRadius="10px"
          onClick={handleClick}
          cursor="pointer"
          p="10px"
          id={`claim-${String(claimId)}`}
        >
          {!metadata.data?.image && (
            <>
              <Flex
                border="1px solid #454545"
                alignItems="center"
                borderRadius="5px"
                w="32px"
                h="32px"
                justifyContent="center"
              >
                <SmallCloseIcon w="32px" color="#454545" />
              </Flex>
            </>
          )}
          {metadata.data && (
            <>
              {metadata.data.image && (
                <Image
                  src={metadata.data.image}
                  width="32px"
                  height="32px"
                  alt={metadata.data.image}
                  borderRadius="5px"
                  border="1px solid #2d2d2d"
                />
              )}
              <Text unselectable="on">{metadata.data.name}</Text>
            </>
          )}
          {!metadata.data?.name && (
            <Text
              borderRadius="5px"
              h="32px"
              flexGrow="1"
              textStyle="italic"
              color="gray"
              textAlign="justify"
              flex="2"
            >
              no name
            </Text>
          )}
          <Spacer /> {/*TODO  Layout without spacer and name-textAlign-justify  */}
          {dropState && (
            <Text fontSize="16px" fontWeight="700" color={dropState.active ? "#46C370" : "#EE8686"}>
              {dropState.active ? "Active" : "Inactive"}
            </Text>
          )}
        </Flex>
      )}
    </>
  );
};

export default DropperV2ClaimsListItem;
