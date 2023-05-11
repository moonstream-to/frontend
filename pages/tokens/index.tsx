import { useEffect } from "react";

import { UserProvider } from "../../src/contexts/UserContext";
import Layout from "../../src/components/layout";
import TokensView from "../../src/components/tokens/TokensView";

const Query = () => {
  useEffect(() => {
    document.title = "Moonstream portal - API Tokens";
  }, []);

  return (
    <UserProvider>
      <Layout home={false}>
        <TokensView />
      </Layout>
    </UserProvider>
  );
};

export default Query;
