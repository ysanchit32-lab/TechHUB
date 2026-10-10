
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { useInventory } from "./InventoryContext";

const CartContext = createContext();

const API_URL = "http://localhost:8080";

export function CartProvider({ children }) {
  const { inventory } = useInventory();

  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

  // =========================
  // GET CURRENT STOCK
  // =========================

  const getStock = (productId) => {
    const product = inventory.find(
      (item) => item.id === productId
    );

    return product ? Number(product.stock) : 0;
  };

  // =========================
  // ADD TO CART
  // =========================

  const addToCart = (product) => {
    const stock = getStock(product.id);

    if (stock <= 0) {
      alert("This product is out of stock!");
      return false;
    }

    setCart((currentCart) => {
      const existing = currentCart.find(
        (item) => item.id === product.id
      );

      if (existing) {
        if (existing.quantity >= stock) {
          alert(`Only ${stock} available.`);
          return currentCart;
        }

        return currentCart.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + 1,
              }
            : item
        );
      }

      return [
        ...currentCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    });

    return true;
  };

  // =========================
  // REMOVE FROM CART
  // =========================

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) => item.id !== productId
      )
    );
  };

  // =========================
  // INCREASE QUANTITY
  // =========================

  const increaseQuantity = (productId) => {
    const stock = getStock(productId);

    setCart((currentCart) =>
      currentCart.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        if (item.quantity >= stock) {
          alert(`Only ${stock} available.`);
          return item;
        }

        return {
          ...item,
          quantity: item.quantity + 1,
        };
      })
    );
  };

  // =========================
  // DECREASE QUANTITY
  // =========================

  const decreaseQuantity = (productId) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) => item.quantity > 0
        )
    );
  };

  // =========================
  // CLEAR CART
  // =========================

  const clearCart = () => {
    setCart([]);
  };

  // =========================
  // FETCH EMPLOYEE ORDERS
  // =========================

  const fetchOrders = async () => {
    const token =
      localStorage.getItem("techhub-token");

    const userData =
      localStorage.getItem("techhub-user");

    // No login
    if (!token || !userData) {
      setOrders([]);
      return;
    }

    try {
      const user = JSON.parse(userData);

      // Only employees can see all orders
      if (user.role !== "EMPLOYEE") {
        setOrders([]);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            `Failed to fetch orders (${response.status})`
        );
      }

      const data =
        await response.json();

      const formattedOrders =
        Array.isArray(data)
          ? data.map((order) => ({
              id: order.id,

              customer: {
                name:
                  order.user?.name ||
                  "Customer",

                email:
                  order.user?.email ||
                  "",
              },

              date: order.orderDate
                ? new Date(
                    order.orderDate
                  ).toLocaleString()
                : "N/A",

              total:
                Number(
                  order.totalAmount
                ) || 0,

              status:
                order.status ||
                "PENDING",

              shippingAddress:
                order.shippingAddress ||
                "",

              paymentMethod:
                order.paymentMethod || "",

              paymentStatus:
                order.paymentStatus || "",

              items:
                Array.isArray(
                  order.items
                )
                  ? order.items
                  : [],
            }))
          : [];

      setOrders(formattedOrders);

      console.log(
        "TechHUB employee orders:",
        formattedOrders
      );

    } catch (error) {
      console.error(
        "Error fetching employee orders:",
        error
      );

      setOrders([]);
    }
  };

  // =========================
  // UPDATE ORDER STATUS
  // =========================

  const updateOrderStatus = async (
    orderId,
    newStatus
  ) => {
    const token =
      localStorage.getItem(
        "techhub-token"
      );

    if (!token) {
      alert("Please login again.");
      return false;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/orders/${orderId}/status?status=${newStatus}`,
        {
          method: "PUT",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            `Failed to update order (${response.status})`
        );
      }

      // Refresh employee orders
      await fetchOrders();

      return true;

    } catch (error) {
      console.error(
        "Error updating order status:",
        error
      );

      alert(
        "Failed to update order status."
      );

      return false;
    }
  };

  // =========================
  // PLACE ORDER
  // =========================

  const placeOrder = async (
    customerDetails
  ) => {
    if (cart.length === 0) {
      alert("Your cart is empty!");
      return null;
    }

    const token =
      localStorage.getItem(
        "techhub-token"
      );

    if (!token) {
      alert(
        "Please login before placing an order."
      );

      return null;
    }

    // Check stock before placing order
    for (const item of cart) {
      const stock =
        getStock(item.id);

      if (stock < item.quantity) {
        alert(
          `${item.name} only has ${stock} available.`
        );

        return null;
      }
    }

    const shippingAddress =
      `${customerDetails.address}, ` +
      `${customerDetails.city}, ` +
      `${customerDetails.state} - ` +
      `${customerDetails.pincode}`;

    const orderData = {
      shippingAddress,

      // Demo payment: only the chosen method is sent (never card details)
      paymentMethod: customerDetails.payment,
      couponCode: customerDetails.couponCode || "",

      items: cart.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            orderData
          ),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        alert(
          data.error ||
            data.message ||
            "Failed to place order."
        );

        return null;
      }

      /*
       * Backend already decreases stock.
       * Therefore we DO NOT call reduceStock().
       */

      setCart([]);

      /*
       * If employee places an order,
       * refresh employee orders.
       */

      await fetchOrders();

      return data;

    } catch (error) {
      console.error(
        "Order error:",
        error
      );

      alert(
        "Could not connect to the TechHUB backend."
      );

      return null;
    }
  };

  // =========================
  // INITIAL LOAD
  // =========================

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================
  // CART COUNT
  // =========================

  const cartCount =
    cart.reduce(
      (total, item) =>
        total +
        Number(item.quantity || 0),
      0
    );

  // =========================
  // CART TOTAL
  // =========================

  const cartTotal =
    cart.reduce(
      (total, item) =>
        total +
        Number(item.price || 0) *
          Number(item.quantity || 0),
      0
    );

  // =========================
  // PROVIDER
  // =========================

  return (
    <CartContext.Provider
      value={{
        cart,
        inventory,

        orders,

        addToCart,
        removeFromCart,

        increaseQuantity,
        decreaseQuantity,

        clearCart,
        placeOrder,

        getStock,

        cartCount,
        cartTotal,

        fetchOrders,
        updateOrderStatus,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

// =========================
// USE CART HOOK
// =========================

export function useCart() {
  return useContext(CartContext);
}
