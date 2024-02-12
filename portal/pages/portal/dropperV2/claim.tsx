import { useEffect } from "react";
import DropperV2View from "../../../src/components/dropperV2/DropperV2View";

import Layout from "../../../src/components/layout";
import exp from "node:constants";
import ClaimView from "../../../src/components/dropperV2/ClaimView";

const Claim = () => {
  useEffect(() => {
    document.title = "Moonstream portal - Dropper V2 claim";
  }, []);

  return (
    <Layout home={false}>
      <ClaimView />
    </Layout>
  );
};

export default Claim;
