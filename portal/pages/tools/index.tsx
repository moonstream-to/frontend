import { useEffect } from "react";

import Layout from "../../src/components/layoutLanding";
import TokensView from "../../src/components/tokens/TokensView";
import HeatMap from "../../src/components/tools/HeatMapPallett";

const Tools = () => {
  useEffect(() => {
    document.title = "Moonstream portal - tools";
  }, []);

  return (
    <Layout home={false}>
      <HeatMap isPitcher={true} showStrikeZone={false} />
    </Layout>
  );
};

export default Tools;
