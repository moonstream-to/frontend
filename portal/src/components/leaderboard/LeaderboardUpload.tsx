/* eslint-disable react/no-children-prop */
import { useContext, useState } from "react";

import { useQueryClient } from "react-query";
import Papa from "papaparse";
import { SmallCloseIcon } from "@chakra-ui/icons";
import {
  Flex,
  Box,
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionButton,
  AccordionIcon,
} from "@chakra-ui/react";

import Web3Context from "../../contexts/Web3Context/context";
import useMoonToast from "../../hooks/useMoonToast";
import FileUpload from "./FileUpload";
import useDrop from "../../hooks/useDrop";
import { Score } from "./types";

const LeaderboardUpload = ({
  handleScores,
}: {
  handleScores: (scores: Score[]) => Promise<any>;
}) => {
  const toast = useMoonToast();

  const queryClient = useQueryClient();
  const web3ctx = useContext(Web3Context);

  const [isUploading, setIsUploading] = useState(false);

  const handleParsingError = function (error: string): void {
    setIsUploading(false);
    toast(error, "error", 7000);
    throw error;
  };

  const validateHeader = function (headerValue: string, column: number): string {
    const header = headerValue.trim().toLowerCase();
    if (column == 0 && header != "address") {
      handleParsingError("First column header must be 'address'");
    }
    if (column == 1 && header != "score") {
      handleParsingError("Second column header must be 'amount'");
    }
    return header;
  };
  let parserLineNumber = 0;

  const validateCellValue = function (cellValue: string, column: string): string {
    const value = cellValue.trim();
    if (column == "score") {
      const numVal = parseInt(value);
      if (isNaN(numVal) || numVal < 0) {
        handleParsingError(
          `Error parsing value: '${value}' on line ${parserLineNumber}. Value in 'score' column must be an integer.`,
        );
      }
    }
    return value;
  };

  const parseCSV = (file: any) => {
    console.log("Parsing CSV file.");
    parserLineNumber = 0;
    setIsUploading(true);
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      fastMode: true,
      transform: validateCellValue,
      transformHeader: validateHeader,
      complete: async (result: any) => {
        const scores = result.data.map((obj: any) => {
          const { address, score, ...points_data } = obj;
          return {
            address: address,
            score: score,
            points_data: points_data,
          };
        });
        try {
          const response = await handleScores(scores);
          if (response.status === 200) {
            toast(`Successfully updated scores.`, "success");
          }
        } catch (e: any) {
          toast(`Upload failed - ${e.message ?? "Error uploading leaderboard scores."}`, "error");
        }
        setIsUploading(false);
      },
      error: (err: Error) => handleParsingError(err.message),
    });
  };

  const parseJSON = (file: any) => {
    console.log("Parsing JSON file.");
    const fileReader = new FileReader();
    setIsUploading(true);
    try {
      fileReader.readAsText(file);
      fileReader.onloadend = async (readerEvent: ProgressEvent<FileReader>) => {
        if (readerEvent?.target?.result) {
          try {
            const scores = JSON.parse(String(readerEvent?.target?.result));
            const response = await handleScores(scores);
            if (response.status === 200) {
              toast(`Successfully updated scores.`, "success");
            }
          } catch (e: any) {
            toast(`Upload failed - ${e.message ?? "Error uploading leaderboard scores."}`, "error");
          }
          setIsUploading(false);
        }
      };
    } catch (e) {
      console.log(e);
    }
    setIsUploading(false);
  };

  const onDrop = (uploads: any) => {
    if (!uploads.length) {
      return;
    }
    const file = uploads[0];
    console.log(file);
    if (file.type == "application/json") {
      parseJSON(file);
    } else if (file.type == "text/csv") {
      parseCSV(file);
    }
  };

  return (
    <Accordion bgColor="#232323" rounded="lg" allowToggle>
      <AccordionItem borderWidth={0} borderBottomWidth="0!important">
        <h2>
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              Upload Leaderboard Scores
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <Flex>
            <FileUpload minW="100%" isUploading={isUploading} onDrop={onDrop} />
          </Flex>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  );
};

export default LeaderboardUpload;
