import { useEffect } from "react";

import Layout from "../../src/components/layout";
import SigningServersInfo from "../../src/components/signingServers/SigningServersInfo";

const Nodebalancer = () => {
  useEffect(() => {
    document.title = "Moonstream portal - Signing Servers";
  }, []);

  return (
    <Layout home={false}>
      <SigningServersInfo />
    </Layout>
  );
};

export default Nodebalancer;
