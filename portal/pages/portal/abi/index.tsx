import { useEffect } from "react";
import ABIView from "../../../src/components/ABIView";

import Layout from "../../../src/components/layout";

const Query = () => {
  useEffect(() => {
    document.title = "Moonstream portal - ABI view";
  }, []);

  return (
    <Layout home={false} needAuthorization={false}>
      <ABIView />
    </Layout>
  );
};

export default Query;
