import Landing from "../../src/components/Landing";
import Layout from "../../src/components/layout";

const LandingPage = () => {
  return (
    <Layout home={true} title="Moonstream">
      <Landing />
    </Layout>
  );
};

export default LandingPage;
