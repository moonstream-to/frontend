import { Center } from "@chakra-ui/react";
import { useEffect } from "react";
import Layout from "../../src/components/layout";

import LeaderboardView from "../../src/components/leaderboard/LeaderboardView";

const Leaderboard = () => {
  useEffect(() => {
    document.title = "Leaderboard";
  }, []);

  return (
    <Layout home={false} needAuthorization={false} showBreadcrumb={false}>
      <Center>
        <LeaderboardView />
      </Center>
    </Layout>
  );
};

export default Leaderboard;
