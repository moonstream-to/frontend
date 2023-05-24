import { useEffect, useState } from "react";

type Address = {
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
    const storedAddresses = localStorage.getItem(`${type}-recentAddresses`);
    try {
      setRecentAddresses(storedAddresses ? JSON.parse(storedAddresses) : []);
    } catch (e) {
      console.log(e);
    }
  }, [type]);

  const addRecentAddress = (address: string, fields: Record<string, string>) => {
    const existingAddressIndex = recentAddresses.findIndex((a) => a.address === address);
    if (existingAddressIndex >= 0) {
      // Address already exists, merge existing fields with new fields
      const existingAddress = recentAddresses[existingAddressIndex];
      const updatedAddress = { ...existingAddress, ...fields };
      const otherAddresses = recentAddresses.filter((a) => a.address !== address);
      const updatedAddresses = [updatedAddress, ...otherAddresses];
      setRecentAddresses(updatedAddresses);
      localStorage.setItem(`${type}-recentAddresses`, JSON.stringify(updatedAddresses));
    } else {
      // Address is new, add as a new item to the beginning of the list
      const newAddress = { address, ...fields };
      const updatedAddresses = [
        newAddress,
        ...recentAddresses.filter((a) => a.address !== address),
      ];
      setRecentAddresses(updatedAddresses);
      localStorage.setItem(`${type}-recentAddresses`, JSON.stringify(updatedAddresses));
    }
  };

  const deleteRecentAddress = (address: string) => {
    const updatedAddresses = recentAddresses.filter((a) => a.address !== address);
    setRecentAddresses(updatedAddresses);
    localStorage.setItem(`${type}-recentAddresses`, JSON.stringify(updatedAddresses));
  };

  return { recentAddresses, addRecentAddress, deleteRecentAddress };
};

export default useRecentAddresses;
