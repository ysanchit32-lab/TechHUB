
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const InventoryContext = createContext();

const API_URL = "http://localhost:8080/api/products";

export function InventoryProvider({ children }) {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get JWT token
  const getToken = () => {
    return localStorage.getItem("techhub-token");
  };

  // Get headers for authenticated requests
  const getHeaders = () => {
    const token = getToken();

    const headers = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = "Bearer " + token;
    }

    return headers;
  };

  // Get products from Spring Boot
  const fetchInventory = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: getHeaders(),
      });

      if (!response.ok) {
        throw new Error(
          "Failed to fetch products (" + response.status + ")"
        );
      }

      const data = await response.json();

      setInventory(data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load inventory when application starts
  useEffect(() => {
    fetchInventory();
  }, []);

  // Increase stock by 1
  const increaseStock = async (productId) => {
    try {
      const response = await fetch(
        API_URL + "/" + productId + "/stock-in",
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({
            quantity: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to increase stock (" + response.status + ")"
        );
      }

      const updatedProduct = await response.json();

      setInventory((currentInventory) =>
        currentInventory.map((product) =>
          product.id === productId
            ? updatedProduct
            : product
        )
      );
    } catch (error) {
      console.error("Error increasing stock:", error);
    }
  };

  // Decrease stock by 1
  const decreaseStock = async (productId) => {
    try {
      const response = await fetch(
        API_URL + "/" + productId + "/stock-out",
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({
            quantity: 1,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to decrease stock (" + response.status + ")"
        );
      }

      const updatedProduct = await response.json();

      setInventory((currentInventory) =>
        currentInventory.map((product) =>
          product.id === productId
            ? updatedProduct
            : product
        )
      );
    } catch (error) {
      console.error("Error decreasing stock:", error);
    }
  };

  // Reduce stock by a specific quantity
  const reduceStock = async (productId, quantity) => {
    try {
      const response = await fetch(
        API_URL + "/" + productId + "/stock-out",
        {
          method: "PUT",
          headers: getHeaders(),
          body: JSON.stringify({
            quantity: quantity,
          }),
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to reduce stock (" + response.status + ")"
        );
      }

      const updatedProduct = await response.json();

      setInventory((currentInventory) =>
        currentInventory.map((product) =>
          product.id === productId
            ? updatedProduct
            : product
        )
      );
    } catch (error) {
      console.error("Error reducing stock:", error);
    }
  };

  // Get stock of a product
  const getProductStock = (productId) => {
    const product = inventory.find(
      (item) => item.id === productId
    );

    return product ? product.stock : 0;
  };

  // Refresh inventory
  const refreshInventory = () => {
    fetchInventory();
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        loading,
        increaseStock,
        decreaseStock,
        reduceStock,
        getProductStock,
        refreshInventory,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}

