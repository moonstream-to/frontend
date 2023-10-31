import React from "react";
import { Flex, Heading, Spacer, Button, Spinner } from "@chakra-ui/react";
import LeaderboardFields from "./LeaderboardFields";
import { UseMutationResult } from "react-query";

const NewLeaderboard = ({
  createLeaderboard,
  onClose,
}: {
  createLeaderboard: UseMutationResult<
    void,
    unknown,
    {
      title: string;
      description: string;
    },
    unknown
  >;
  onClose: () => void;
}) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  return (
    <>
      <Heading fontSize={["lg", "2xl"]}>Create Leaderboard</Heading>
      <LeaderboardFields
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
      />
      <Spacer />
      <Flex alignSelf="flex-end">
        <Button variant="cancelButton" w="135px" mx="10px" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="saveButton"
          w="200px"
          mx="10px"
          onClick={() => {
            createLeaderboard.mutate({ title: title, description: description });
          }}
          isDisabled={createLeaderboard.isLoading}
        >
          {createLeaderboard.isLoading ? <Spinner /> : "Create"}
        </Button>
      </Flex>
    </>
  );
};

export default NewLeaderboard;
