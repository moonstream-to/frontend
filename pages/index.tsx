import Landing from "../src/components/Landing";
import LayoutLanding from "../src/components/layoutLanding";

const LandingPage = () => {
  return (
    <LayoutLanding home={true} title="Moonstream">
      <Landing />
    </LayoutLanding>
  );
};

export default LandingPage;
