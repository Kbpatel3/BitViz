import filter from "../media/filter_icon.png";
import FilterPanel from "./FilterPanel";

export default function FilterGraphButton() {
    return (
      <>
      {/* Filter Graph Button */}
      <input
        className="mx-auto object-scale-down h-7 w-7"
        type="image"
        src={filter}
        title="Filter Graph"
        onClick={() => {
          // Show the Filter Panel
          const filterPanel = document.getElementById("filterPanel");
          filterPanel.style.display = "block";
        }
        }
      />
    </>
    );
  }
  