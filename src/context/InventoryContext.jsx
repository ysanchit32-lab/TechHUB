import {
  createContext,
  useContext,
  useState,
} from "react";

import products from "../data/products";

const InventoryContext = createContext();

function getSavedInventory() {
  try {
    const savedInventory =
      localStorage.getItem("techhub-inventory");

    if (!savedInventory) {
      return products;
    }

    const parsedInventory = JSON.parse(savedInventory);

    if (!Array.isArray(parsedInventory)) {
      return products;
    }

    return products.map((product) => {
      const savedProduct = parsedInventory.find(
        (item) => item.id === product.id
      );

      return savedProduct
        ? {
            ...product,
            stock:
              typeof savedProduct.stock === "number"
                ? savedProduct.stock
                : product.stock,
          }
        : product;
    });
  } catch {
    return products;
  }
}

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState(
    getSavedInventory
  );

  const saveInventory = (updatedInventory) => {
    setInventory(updatedInventory);

    localStorage.setItem(
      "techhub-inventory",
      JSON.stringify(updatedInventory)
    );
  };

  const increaseStock = (productId) => {
    const updatedInventory = inventory.map((product) =>
      product.id === productId
        ? {
            ...product,
            stock: product.stock + 1,
          }
        : product
    );

    saveInventory(updatedInventory);
  };

  const decreaseStock = (productId) => {
    const updatedInventory = inventory.map((product) =>
      product.id === productId
        ? {
            ...product,
            stock: Math.max(0, product.stock - 1),
          }
        : product
    );

    saveInventory(updatedInventory);
  };

  const reduceStock = (productId, quantity) => {
    const updatedInventory = inventory.map((product) =>
      product.id === productId
        ? {
            ...product,
            stock: Math.max(
              0,
              product.stock - quantity
            ),
          }
        : product
    );

    saveInventory(updatedInventory);
  };

  const getProductStock = (productId) => {
    const product = inventory.find(
      (item) => item.id === productId
    );

    return product ? product.stock : 0;
  };

  const resetInventory = () => {
    saveInventory(products);
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        increaseStock,
        decreaseStock,
        reduceStock,
        getProductStock,
        resetInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}