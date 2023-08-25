import React from "react";
import { Flex, Heading, Spacer, Button } from "@chakra-ui/react";
import LeaderboardFields from "./LeaderboardFields";

const EditLeaderboard = ({ leaderboard, handleEdit, onClose }) => {
  const [title, setTitle] = React.useState(leaderboard.title);
  const [description, setDescription] = React.useState(leaderboard.description);

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
        <Button w="135px" bgColor="#4D4D4D" color="inherit" mx="10px" onClick={onClose}>
          Cancel
        </Button>
        <Button
          w="200px"
          bgColor="#F56646"
          color="inherit"
          mx="10px"
          onClick={async () => {
            await handleEdit(leaderboard.id, title, description);
            onClose();
          }}
        >
          Save
        </Button>
      </Flex>
    </>
  );
};

export default EditLeaderboard;
