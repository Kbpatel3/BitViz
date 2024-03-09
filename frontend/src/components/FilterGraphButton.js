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
            <div id="filterPanel" class="filter-panel hidden bg-white border border-gray-300 shadow-md rounded-md p-4 mt-2">
            <select id="filterDropdown" class="block w-full bg-gray-100 border border-gray-300 py-2 px-4 mb-2 rounded-md">
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
            </select>
            <button id="applyFilterButton" class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                Apply
            </button>
        </div>
        }
        }
      />
      
    </>
    );
  }
  