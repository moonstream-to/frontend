import { useEffect } from "react";

import Layout from "../../src/components/layout";
import NodeBalancerInfo from "../../src/components/nodebalancer/NodeBalancerInfo";

const Nodebalancer = () => {
  useEffect(() => {
    document.title = "Moonstream portal - Nodebalancer";
  }, []);

  return (
    <Layout home={false}>
      <NodeBalancerInfo />
    </Layout>
  );
};

export default Nodebalancer;
