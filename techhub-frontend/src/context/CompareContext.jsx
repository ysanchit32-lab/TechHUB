import {
  createContext,
  useContext,
  useState,
} from "react";

const CompareContext = createContext();

export const MAX_COMPARE = 3;

export function CompareProvider({ children }) {

  const [compareIds, setCompareIds] = useState([]);

  const isCompared = (productId) =>
    compareIds.includes(productId);

  // Returns "added", "removed" or "full"
  const toggleCompare = (productId) => {

    if (compareIds.includes(productId)) {
      setCompareIds(
        compareIds.filter((id) => id !== productId)
      );
      return "removed";
    }

    if (compareIds.length >= MAX_COMPARE) {
      return "full";
    }

    setCompareIds([...compareIds, productId]);
    return "added";
  };

  const removeFromCompare = (productId) => {
    setCompareIds(
      compareIds.filter((id) => id !== productId)
    );
  };

  const clearCompare = () => setCompareIds([]);

  return (
    <CompareContext.Provider
      value={{
        compareIds,
        isCompared,
        toggleCompare,
        removeFromCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  return useContext(CompareContext);
}
