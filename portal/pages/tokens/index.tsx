import { useEffect } from "react";

import Layout from "../../src/components/layout";
import TokensView from "../../src/components/tokens/TokensView";

const Query = () => {
  useEffect(() => {
    document.title = "Moonstream portal - API Tokens";
  }, []);

  return (
    <Layout home={false}>
      <TokensView />
    </Layout>
  );
};

export default Query;
