import { Spinner } from "@chakra-ui/react";

import Item from "./AnalyticsAddressesListItem";
import useAnalytics from "../../contexts/AnalyticsContext";
import styles from "./AnalyticsView.module.css";

const AnalyticsAddressesList = () => {
  const { addresses } = useAnalytics();

  if (addresses.isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {addresses.data && (
        <div className={styles.addressesList}>
          {addresses.data.map((address: any, idx: number) => (
            <Item
              key={address.id}
              idx={idx}
              address={address}
              // types={types.data?.subscription_types ?? undefined}
            />
          ))}
        </div>
      )}
    </>
  );
};
export default AnalyticsAddressesList;
