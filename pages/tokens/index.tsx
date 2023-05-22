import { useEffect } from "react";

import LayoutLanding from "../../src/components/layoutLanding";
import TokensView from "../../src/components/tokens/TokensView";

const Query = () => {
  useEffect(() => {
    document.title = "Moonstream portal - API Tokens";
  }, []);

  return (
    <LayoutLanding home={false}>
      <TokensView />
    </LayoutLanding>
  );
};

export default Query;
