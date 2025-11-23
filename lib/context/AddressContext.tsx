'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Address {
  id: string;
  title: string;
  fullName: string;
  phone: string;
  province: string;
  city: string;
  address: string;
  postalCode: string;
  isDefault: boolean;
}

interface AddressContextType {
  addresses: Address[];
  addAddress: (address: Omit<Address, 'id'>) => void;
  updateAddress: (id: string, address: Omit<Address, 'id'>) => void;
  deleteAddress: (id: string) => void;
  setDefaultAddress: (id: string) => void;
  getDefaultAddress: () => Address | undefined;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

export function AddressProvider({ children }: { children: ReactNode }) {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
    const saved = localStorage.getItem('maysa-addresses');
    if (saved) {
      try {
        setAddresses(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading addresses:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem('maysa-addresses', JSON.stringify(addresses));
    }
  }, [addresses, isHydrated]);

  const addAddress = (address: Omit<Address, 'id'>) => {
    const newAddress: Address = {
      ...address,
      id: Date.now().toString(),
    };

    setAddresses((prev) => {
      // If this is the first address or marked as default, make it default
      if (prev.length === 0 || address.isDefault) {
        return [
          newAddress,
          ...prev.map((addr) => ({ ...addr, isDefault: false })),
        ];
      }
      return [...prev, newAddress];
    });
  };

  const updateAddress = (id: string, address: Omit<Address, 'id'>) => {
    setAddresses((prev) =>
      prev.map((addr) => {
        if (addr.id === id) {
          return { ...address, id };
        }
        // If updating to default, remove default from others
        if (address.isDefault) {
          return { ...addr, isDefault: false };
        }
        return addr;
      })
    );
  };

  const deleteAddress = (id: string) => {
    setAddresses((prev) => {
      const filtered = prev.filter((addr) => addr.id !== id);
      // If deleted address was default and there are other addresses, make first one default
      const deletedWasDefault = prev.find((addr) => addr.id === id)?.isDefault;
      if (deletedWasDefault && filtered.length > 0) {
        filtered[0].isDefault = true;
      }
      return filtered;
    });
  };

  const setDefaultAddress = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  const getDefaultAddress = () => {
    return addresses.find((addr) => addr.isDefault);
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
        getDefaultAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
}

export function useAddress() {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within AddressProvider');
  }
  return context;
}
