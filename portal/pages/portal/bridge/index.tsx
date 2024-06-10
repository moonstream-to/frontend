import { useEffect } from "react";

import Layout from "../../../src/components/layout";
import BridgeView from "../../../src/components/bridge/BridgeView";

const BridgePage = () => {
  useEffect(() => {
    document.title = "Sepolia - G7 Testnet bridge";
  }, []);

  return (
    <Layout home={false} needAuthorization={false}>
      <BridgeView />
    </Layout>
  );
};

export default BridgePage;
