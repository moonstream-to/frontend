import { Flex } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
import ABIViwLeftPanel from "./abiView/ABIViewLeftPanel";
import ABIViewRightPanel from "./abiView/ABIViewRightPanel";

const ABIView = () => {
  const [abi, setAbi] = useState("");
  const [abiObject, setAbiObject] = useState([]);

  const [src, setSrc] = useState("");

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollRef?.current?.scrollIntoView();
  }, []);

  useEffect(() => {
    try {
      const newAbiObject = JSON.parse(abi).map((item: { type: string }) =>
        item.type === "constructor" ? { ...item, name: "constructor" } : { ...item },
      );
      setAbiObject(newAbiObject.filter((item: { name: string; type: string }) => item.name));
    } catch {
      setAbiObject([]);
    }
  }, [abi]);

  useEffect(() => {
    setAbi("");
  }, [src]);

  return (
    <Flex
      gap="0px"
      mt="30px"
      px="0"
      minH="calc(100vh - 20px)"
      maxH="calc(100vh - 20px)"
      minW="100vw"
      position="relative"
      alignSelf="stretch"
      ref={scrollRef}
    >
      <ABIViwLeftPanel abi={abi} setAbi={setAbi} src={src} setSrc={setSrc} />
      <ABIViewRightPanel src={src} setSrc={setSrc} abiObject={abiObject} />
    </Flex>
  );
};

export default ABIView;
