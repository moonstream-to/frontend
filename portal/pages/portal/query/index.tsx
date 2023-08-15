import { useEffect } from "react";

import { QueryAPIProvider } from "../../../src/contexts/QueryAPIContext";
import Layout from "../../../src/components/layout";

import QueryAPIView from "../../../src/components/queryAPI/QueryAPIView";

const Query = () => {
  useEffect(() => {
    document.title = "Moonstream portal - Query API";
  }, []);

  return (
    <QueryAPIProvider>
      <Layout home={false}>
        <QueryAPIView />
      </Layout>
    </QueryAPIProvider>
  );
};

export default Query;
