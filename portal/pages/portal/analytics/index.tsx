import { useEffect } from "react";
import AnalyticsView from "../../../src/components/analytics/AnalyticsView";

import Layout from "../../../src/components/layout";

import { AnalyticsProvider } from "../../../src/contexts/AnalyticsContext";

const Query = () => {
  useEffect(() => {
    document.title = "Moonstrem portal - Analytics";
  }, []);

  return (
    <AnalyticsProvider>
      <Layout home={false}>
        <AnalyticsView />
      </Layout>
    </AnalyticsProvider>
  );
};

export default Query;
