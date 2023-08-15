import { useEffect } from "react";
import DropperV2View from "../../../src/components/dropperV2/DropperV2View";

import Layout from "../../../src/components/layout";

const DropperV2 = () => {
  useEffect(() => {
    document.title = "Moonstream portal - Dropper V2";
  }, []);

  return (
    <Layout home={false}>
      <DropperV2View />
    </Layout>
  );
};

export default DropperV2;
