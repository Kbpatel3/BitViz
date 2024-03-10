import { useState } from "react";

export default function FilterPanel() {
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    return (
        <>
        {showFilterPanel && (
            <div className="filter-panel">
              hello
              {/* Your filter panel content goes here */}
              {/* For example:
              <input type="text" placeholder="Filter by..." />
              <button>Apply</button>
              */}
            </div>
          )}
        </>
    );
    }
