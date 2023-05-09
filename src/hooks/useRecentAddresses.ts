import { useEffect, useState } from "react";

type Address = {
  address: string;
  [key: string]: string; // arbitrary set of fields
};

type UseRecentAddressesReturnType = [
  Address[],
  (address: string, fields: Record<string, string>) => void,
];

const useRecentAddresses = (type: string): UseRecentAddressesReturnType => {
  const [recentAddresses, setRecentAddresses] = useState<Address[]>([]);

  useEffect(() => {
    const storedAddresses = localStorage.getItem(`${type}-recentAddresses`);
    // console.log(storedAddresses ? JSON.parse(storedAddresses) : []);
    setRecentAddresses(storedAddresses ? JSON.parse(storedAddresses) : []);
  }, [type]);

  useEffect(() => {
    console.log(recentAddresses);
  }, [recentAddresses]);

  const addRecentAddress = (address: string, fields: Record<string, string>) => {
    const existingAddressIndex = recentAddresses.findIndex((a) => a.address === address);
    console.log(recentAddresses, address, fields);
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

  return [recentAddresses, addRecentAddress];
};

export default useRecentAddresses;
