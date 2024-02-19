import React from "react";
import { Flex, Heading, Spacer, Button, Spinner } from "@chakra-ui/react";
import LeaderboardFields from "./LeaderboardFields";
import { useMutation, useQueryClient } from "react-query";
import http from "../../utils/httpMoonstream";

const NewLeaderboard = ({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: (arg0: string) => void;
}) => {
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");

  const create = async (title: string, description: string) => {
    return http({
      method: "POST",
      url: `https://engineapi.moonstream.to/leaderboard`,
      data: {
        title: title,
        description: description,
      },
    });
  };

  const queryClient = useQueryClient();
  const createLeaderboard = useMutation(
    ({ title, description }: { title: string; description: string }) => create(title, description),
    {
      onSuccess: (res: any) => {
        queryClient.setQueryData(["leaderboards"], (oldData: any) => {
          return [{ ...res.data }, ...oldData];
        });
        onSuccess(res.data.id);
      },
    },
  );

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
        <Button
          variant="cancelButton"
          w="135px"
          mx="10px"
          onClick={onClose}
          isDisabled={createLeaderboard.isLoading}
        >
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
