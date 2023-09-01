import { Center } from "@chakra-ui/react";
import { useEffect } from "react";
import Layout from "../../../src/components/layout";

import LeaderboardAdminView from "../../../src/components/leaderboard/LeaderboardAdminView";

const LeaderboardAdmin = () => {
  useEffect(() => {
    document.title = "Leaderboard";
  }, []);

  return (
    <Layout home={false} needAuthorization={true} showBreadcrumb={false}>
      <Center>
        <LeaderboardAdminView />
      </Center>
    </Layout>
  );
};

export default LeaderboardAdmin;
