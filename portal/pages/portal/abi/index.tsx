import { useEffect } from "react";
import ABIView from "../../../src/components/ABIView";

import Layout from "../../../src/components/layout";

const Query = () => {
  useEffect(() => {
    document.title = "Moonstrem portal - ABI view";
  }, []);

  return (
    <Layout home={false}>
      <ABIView />
    </Layout>
  );
};

export default Query;
