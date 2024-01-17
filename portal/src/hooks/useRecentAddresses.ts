import { useEffect, useState } from "react";

export type Address = {
  address: string;
  [key: string]: string; // arbitrary set of fields
};

type UseRecentAddressesReturnType = {
  recentAddresses: Address[];
  addRecentAddress: (address: string, fields: Record<string, string>) => void;
  deleteRecentAddress: (address: string) => void;
};

const useRecentAddresses = (type: string): UseRecentAddressesReturnType => {
  const [recentAddresses, setRecentAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const updateAddresses = () => {
      console.log("qq");
      const storedAddresses = localStorage.getItem(`${type}-recentAddresses`);
      try {
        setRecentAddresses(storedAddresses ? JSON.parse(storedAddresses) : []);
      } catch (e) {
        console.log(e);
      }
    };

    // Listen to the custom event
    window.addEventListener(`${type}-recentAddresses-updated`, updateAddresses);

    updateAddresses();

    // Cleanup
    return () => {
      window.removeEventListener(`${type}-recentAddresses-updated`, updateAddresses);
    };
  }, [type]);

  const dispatchUpdatedEvent = () => {
    const event = new CustomEvent(`${type}-recentAddresses-updated`);
    window.dispatchEvent(event);
  };

  const addRecentAddress = (address: string, fields: Record<string, string>) => {
    setRecentAddresses((prevRecentAddresses) => {
      const existingAddressIndex = prevRecentAddresses.findIndex((a) => a.address === address);

      if (existingAddressIndex >= 0) {
        // Address already exists, merge existing fields with new fields
        const existingAddress = prevRecentAddresses[existingAddressIndex];
        const updatedAddress = { ...existingAddress, ...fields };
        const otherAddresses = prevRecentAddresses.filter((a) => a.address !== address);
        const updatedAddresses = [updatedAddress, ...otherAddresses];

        localStorage.setItem(`${type}-recentAddresses`, JSON.stringify(updatedAddresses));
        dispatchUpdatedEvent();

        return updatedAddresses;
      } else {
        // Address is new, add it to the list
        const newAddress = { address, ...fields };
        const updatedAddresses = [newAddress, ...prevRecentAddresses];

        localStorage.setItem(`${type}-recentAddresses`, JSON.stringify(updatedAddresses));
        dispatchUpdatedEvent();

        return updatedAddresses;
      }
    });
  };

  const deleteRecentAddress = (address: string) => {
    const updatedAddresses = recentAddresses.filter((a) => a.address !== address);
    setRecentAddresses(updatedAddresses);
    localStorage.setItem(`${type}-recentAddresses`, JSON.stringify(updatedAddresses));
    dispatchUpdatedEvent();
  };

  return { recentAddresses, addRecentAddress, deleteRecentAddress };
};

export default useRecentAddresses;
