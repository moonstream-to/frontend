import { HTMLAttributes, useEffect, useState } from "react";
import { Flex, Link, Text } from "@chakra-ui/layout";

import { MAX_INT } from "../constants";
import { CopyIcon } from "@chakra-ui/icons";
import { useClipboard } from "@chakra-ui/react";

interface DetailsProps extends HTMLAttributes<HTMLElement> {
  type?: string;
  value: string;
  href?: string;
  displayFull?: boolean;
  canBeCopied?: boolean;
  range?: { atStart: number; atEnd: number };
  [x: string]: any;
}

const PoolDetailsRow = ({
  type,
  value,
  displayFull,
  href,
  canBeCopied = false,
  range,
  ...props
}: DetailsProps) => {
  const [valueString, setValueString] = useState("");

  const valueComponent = () => {
    if (!value) {
      return <Text fontStyle="italic">{String(value)}</Text>;
    }
    if (value == MAX_INT) {
      return <Text fontStyle="italic">MAX_INT</Text>;
    }
    if (value.slice(0, 4) === "http" && !href) {
      return (
        <Link
          href={value}
          target="_blank"
          color="orange.1000"
          _hover={{ color: "orange.400", textDecoration: "none" }}
        >
          <Text
            title={value.length > valueString.length ? value : ""}
            fontFamily="Jet Brains Mono, monospace"
            fontWeight="400"
            fontSize="18px"
          >
            {valueString}
          </Text>
        </Link>
      );
    } else {
      return (
        <Text
          title={value.length > valueString.length ? value : ""}
          fontFamily="Jet Brains Mono, monospace"
          fontWeight="400"
          fontSize="18px"
          {...props}
        >
          {valueString}
        </Text>
      );
    }
  };

  useEffect(() => {
    if (!value) {
      return;
    }
    if (displayFull) {
      setValueString(value);
      return;
    }
    const shortString = (fullString: string, atStart: number, atEnd: number) => {
      if (!fullString) {
        return fullString;
      }
      if (fullString.length <= atStart + atEnd) {
        return fullString;
      }
      return fullString.slice(0, atStart) + "..." + fullString.slice(-atEnd);
    };

    if (range) {
      setValueString(shortString(String(value), range.atStart, range.atEnd));
      return;
    }

    if (String(value).slice(0, 4) === "http") {
      setValueString(shortString(String(value), 20, 10));
      return;
    }
    if (String(value).slice(0, 2) === "0x") {
      setValueString(shortString(String(value), 6, 4));
      return;
    }
    if (String(value).length > 30) {
      setValueString(shortString(String(value), 27, 3));
      return;
    }
    setValueString(value);
  }, [value, displayFull]);

  const { onCopy, hasCopied } = useClipboard(value);

  return (
    <Flex justifyContent="space-between" gap="10px" {...props}>
      {type && (
        <Text fontWeight="400" fontSize="18px" {...props}>
          {type}
        </Text>
      )}
      <Flex gap="10px" position="relative" alignItems="center">
        {href ? (
          <Link
            href={href}
            color="orange.1000"
            _hover={{ color: "orange.400", textDecoration: "none" }}
            target="_blank"
          >
            {valueComponent()}
          </Link>
        ) : (
          valueComponent()
        )}
        {canBeCopied && <CopyIcon onClick={onCopy} cursor="pointer" />}
        {hasCopied && (
          <Text
            fontWeight="700"
            position="absolute"
            top="-40px"
            left="69%"
            transform="translate(-50%, 0)"
            bg="#2d2d2d"
            borderRadius="8px"
            p="5px 10px"
            border="2px solid #BBBBBB"
            zIndex="100"
          >
            copied
          </Text>
        )}
      </Flex>
    </Flex>
  );
};

export default PoolDetailsRow;
