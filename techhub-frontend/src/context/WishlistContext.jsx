import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

const WishlistContext = createContext();

// Every customer gets their own wishlist, saved in this browser.
const getKey = () => {
  const user = JSON.parse(
    localStorage.getItem("techhub-user") || "null"
  );

  return user?.email
    ? `techhub-wishlist-${user.email}`
    : null;
};

const loadIds = () => {
  const key = getKey();

  if (!key) {
    return [];
  }

  try {
    const data = JSON.parse(
      localStorage.getItem(key) || "[]"
    );

    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
};

export function WishlistProvider({ children }) {

  const location = useLocation();

  const [wishlistIds, setWishlistIds] =
    useState(loadIds);

  // Reload when the page changes, so login / logout
  // always shows the correct person's wishlist.
  useEffect(() => {
    setWishlistIds(loadIds());
  }, [location.pathname]);

  const isWished = (productId) =>
    wishlistIds.includes(productId);

  // Returns false when nobody is logged in
  const toggleWishlist = (productId) => {

    const key = getKey();

    if (!key) {
      return false;
    }

    const current = loadIds();

    const next = current.includes(productId)
      ? current.filter((id) => id !== productId)
      : [...current, productId];

    localStorage.setItem(key, JSON.stringify(next));

    setWishlistIds(next);

    return true;
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistIds,
        wishlistCount: wishlistIds.length,
        isWished,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
