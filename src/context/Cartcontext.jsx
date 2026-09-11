import {
  createContext,
  useContext,
  useState,
} from "react";

import { useInventory } from "./InventoryContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const {
    inventory,
    reduceStock,
  } = useInventory();

  const [cart, setCart] = useState([]);

  const [orders, setOrders] = useState(() => {
    try {
      const saved =
        localStorage.getItem("techhub-orders");

      return saved
        ? JSON.parse(saved)
        : [];
    } catch {
      return [];
    }
  });

  /* =========================
     GET CURRENT STOCK
  ========================= */

  const getStock = (productId) => {
    const product = inventory.find(
      (item) => item.id === productId
    );

    return product
      ? product.stock
      : 0;
  };

  /* =========================
     ADD TO CART
  ========================= */

  const addToCart = (product) => {
    const stock = getStock(product.id);

    if (stock <= 0) {
      alert(
        "This product is out of stock!"
      );

      return false;
    }

    setCart((currentCart) => {
      const existing =
        currentCart.find(
          (item) =>
            item.id === product.id
        );

      if (existing) {
        if (
          existing.quantity >= stock
        ) {
          alert(
            `Only ${stock} available.`
          );

          return currentCart;
        }

        return currentCart.map(
          (item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
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

  /* =========================
     REMOVE FROM CART
  ========================= */

  const removeFromCart = (productId) => {
    setCart((currentCart) =>
      currentCart.filter(
        (item) =>
          item.id !== productId
      )
    );
  };

  /* =========================
     INCREASE QUANTITY
  ========================= */

  const increaseQuantity = (
    productId
  ) => {
    const stock =
      getStock(productId);

    setCart((currentCart) =>
      currentCart.map((item) => {
        if (
          item.id !== productId
        ) {
          return item;
        }

        if (
          item.quantity >= stock
        ) {
          alert(
            `Only ${stock} available.`
          );

          return item;
        }

        return {
          ...item,
          quantity:
            item.quantity + 1,
        };
      })
    );
  };

  /* =========================
     DECREASE QUANTITY
  ========================= */

  const decreaseQuantity = (
    productId
  ) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  };

  /* =========================
     CLEAR CART
  ========================= */

  const clearCart = () => {
    setCart([]);
  };

  /* =========================
     PLACE ORDER
  ========================= */

  const placeOrder = (
    customerDetails
  ) => {
    if (cart.length === 0) {
      alert(
        "Your cart is empty!"
      );

      return null;
    }

    /* Check stock before placing order */

    for (const item of cart) {
      const stock =
        getStock(item.id);

      if (
        stock < item.quantity
      ) {
        alert(
          `${item.name} only has ${stock} available.`
        );

        return null;
      }
    }

    /* Reduce inventory stock */

    cart.forEach((item) => {
      reduceStock(
        item.id,
        item.quantity
      );
    });

    /* Create order */

    const newOrder = {
      id: `TH${Date.now()}`,

      date:
        new Date().toLocaleDateString(
          "en-IN"
        ),

      items: [...cart],

      total: cart.reduce(
        (total, item) =>
          total +
          item.price *
            item.quantity,
        0
      ),

      status: "Processing",

      customer:
        customerDetails,
    };

    /* Save order */

    setOrders((currentOrders) => {
      const updatedOrders = [
        newOrder,
        ...currentOrders,
      ];

      localStorage.setItem(
        "techhub-orders",
        JSON.stringify(
          updatedOrders
        )
      );

      return updatedOrders;
    });

    /* Empty cart */

    setCart([]);

    return newOrder;
  };

  /* =========================
     UPDATE ORDER STATUS
  ========================= */

  const updateOrderStatus = (
    orderId,
    newStatus
  ) => {
    setOrders((currentOrders) => {
      const updatedOrders =
        currentOrders.map(
          (order) => {
            if (
              order.id === orderId
            ) {
              return {
                ...order,
                status: newStatus,
              };
            }

            return order;
          }
        );

      localStorage.setItem(
        "techhub-orders",
        JSON.stringify(
          updatedOrders
        )
      );

      return updatedOrders;
    });
  };

  /* =========================
     CART COUNT
  ========================= */

  const cartCount =
    cart.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );

  /* =========================
     CART TOTAL
  ========================= */

  const cartTotal =
    cart.reduce(
      (total, item) =>
        total +
        item.price *
          item.quantity,
      0
    );

  /* =========================
     PROVIDER
  ========================= */

  return (
    <CartContext.Provider
      value={{
        cart,
        orders,
        inventory,

        addToCart,
        removeFromCart,

        increaseQuantity,
        decreaseQuantity,

        clearCart,

        placeOrder,

        updateOrderStatus,

        getStock,

        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* =========================
   USE CART
========================= */

export function useCart() {
  return useContext(
    CartContext
  );
}