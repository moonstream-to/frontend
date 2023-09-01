import React from "react";
import { Flex, Heading, Spacer, Button, Spinner } from "@chakra-ui/react";
import LeaderboardFields from "./LeaderboardFields";
import { UseMutationResult } from "react-query";

const EditLeaderboard = ({
  leaderboard,
  updateLeaderboard,
  onClose,
}: {
  leaderboard: any;
  updateLeaderboard: UseMutationResult<
    any,
    unknown,
    {
      id: string;
      title: string;
      description: string;
    },
    unknown
  >;
  onClose: () => void;
}) => {
  const [title, setTitle] = React.useState<string>(leaderboard.title);
  const [description, setDescription] = React.useState<string>(leaderboard.description);

  return (
    <>
      <Heading fontSize={["lg", "2xl"]}>Edit Leaderboard</Heading>
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
          onClick={async () => {
            updateLeaderboard.mutate({
              id: leaderboard.id,
              title: title,
              description: description,
            });
          }}
          isDisabled={updateLeaderboard.isLoading}
        >
          {updateLeaderboard.isLoading ? <Spinner /> : "Save"}
        </Button>
      </Flex>
    </>
  );
};

export default EditLeaderboard;
