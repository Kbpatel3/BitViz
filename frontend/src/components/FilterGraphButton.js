import filter from "../media/filter_icon.png";
import { useState } from "react";

export default function FilterGraphButton({ handleGraphSwitch }) {
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  return (
      <>
      {/* Filter Graph Button */}
      <input
        className="mx-auto object-scale-down h-7 w-7"
        type="image"
        src={filter}
        title="Filter Graph"
        onClick= {
          () => setShowFilterPanel(!showFilterPanel)
        }
      />

      {showFilterPanel && (
        <div className="flex justify-between items-center space-x-1 ml-2">
          <select
              className="h-7 inline-block rounded-full border-2 border-primary px-3 pb-[3px] pt-1 text-xs 
              font-medium uppercase leading-normal text-primary 
              focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 
              motion-reduce:transition-none dark:text-primary-500"
          >
              <option>All Data (Default)</option>
              <option>Illcit Only</option>
              <option>3 Edges Min</option>
              <option>Have Edge</option>
              <option>No Edge</option>
          </select>
          <button
            type="button"
            class="h-7 border-slate-600 inline-block rounded-full border-2 border-primary px-3 pb-[6px] pt-1 text-xs 
            font-medium uppercase leading-normal text-primary transition duration-150 ease-in-out 
            hover:border-primary-accent-300 hover:bg-primary-50/50 hover:text-primary-accent-300 
            focus:border-primary-600 focus:bg-primary-50/50 focus:text-primary-300 
            focus:outline-none focus:ring-0 active:border-primary-700 active:text-primary-700 
            motion-reduce:transition-none dark:text-primary-500">
            Apply
          </button>
        </div>
      )}
      
    </>
    );
  }
  