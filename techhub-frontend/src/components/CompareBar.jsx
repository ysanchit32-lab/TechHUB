import { Link, useLocation } from "react-router-dom";

import { useCompare, MAX_COMPARE } from "../context/CompareContext";
import { useInventory } from "../context/InventoryContext";

// Floating bar at the bottom while products are selected
function CompareBar() {

  const { compareIds, removeFromCompare, clearCompare } =
    useCompare();

  const { inventory } = useInventory();

  const location = useLocation();

  if (compareIds.length === 0 || location.pathname === "/compare") {
    return null;
  }

  const selected = compareIds
    .map((id) => inventory.find((product) => product.id === id))
    .filter(Boolean);

  return (
    <div className="compare-bar" role="region" aria-label="Compare products">

      <div className="compare-bar-items">

        <strong>
          Compare ({compareIds.length}/{MAX_COMPARE})
        </strong>

        {selected.map((product) => (
          <span className="compare-chip" key={product.id}>

            {product.name}

            <button
              type="button"
              aria-label={`Remove ${product.name} from compare`}
              onClick={() => removeFromCompare(product.id)}
            >
              ✕
            </button>

          </span>
        ))}

      </div>

      <div className="compare-bar-actions">

        <button
          type="button"
          className="compare-clear"
          onClick={clearCompare}
        >
          Clear
        </button>

        {compareIds.length >= 2 ? (
          <Link to="/compare" className="compare-go">
            Compare now →
          </Link>
        ) : (
          <span className="compare-hint">
            Select at least 2 products
          </span>
        )}

      </div>

    </div>
  );
}

export default CompareBar;
