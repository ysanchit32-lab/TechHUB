import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { CartProvider } from "./context/CartContext";
import { InventoryProvider } from "./context/InventoryContext";
import { WishlistProvider } from "./context/WishlistContext";
import { CompareProvider } from "./context/CompareContext";
import { ToastProvider } from "./context/ToastContext";

import "./index.css";

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <BrowserRouter>

      <ToastProvider>
        <InventoryProvider>
          <CartProvider>
            <WishlistProvider>
              <CompareProvider>
                <App />
              </CompareProvider>
            </WishlistProvider>
          </CartProvider>
        </InventoryProvider>
      </ToastProvider>

    </BrowserRouter>
  </React.StrictMode>
);
