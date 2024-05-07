/**
 * Defines a FilterGraphButton Component
 * @author Noah Hassett
 * @author Kaushal Patel
 *
 */
import filter from "../media/filter_icon.png";
import { useState } from "react";

//!NEW FUNCTION

/**
 * Filter Graph Button Component
 * @fileoverview Filter Graph Button Component
 * @returns {JSX.Element} A JSX element containing the Filter Graph Button
 */
export default function FilterGraphButton({ handleGraphSwitch, setBarMax }) {
  // Tracks if the filter panel is shown
  const [showFilterPanel, setShowFilterPanel] = useState(false);

  // Tracks the selected filter
  const [selectedFilter, setSelectedFilter] = useState("");

  // Function to handle selection change
  const handleSelectChange = (event) => {
      console.log("SELECTED FILTER " + event.target.value)
      setSelectedFilter(event.target.value); // Set the selected filter
  };

  // Function to apply the filter
  const applyFilter = () => {
      console.log("Filter should load " + {selectedFilter} + " dataset")
      setBarMax(0); // Reset the bar max
      handleGraphSwitch(selectedFilter); // Switch the graph
  };

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
      {/* Filter Panel */}
      {showFilterPanel && (
        <div className="flex justify-between items-center space-x-1 ml-2">
          <select
              className="h-7 inline-block rounded-full border-2 border-primary px-3 pb-[3px] pt-1
              text-xs font-medium uppercase leading-normal text-primary focus:outline-none
              focus:ring-0 active:border-primary-700 active:text-primary-700
              motion-reduce:transition-none dark:text-primary-500"
              onChange={handleSelectChange}
              value={selectedFilter}
          >
              <option value={"data-all-unpredicted"}>All Data Unpredicted</option>
              <option value={"data-all-predicted"}>All Data Predicted</option>
              <option value={"data-illicit"}>Illicit Chains</option>
              <option value={"data-min-3-edge"}>3 Minimum Edges</option>
              <option value={"data-min-3-edge-illicit"}>3 Minimum Edges & Illicit Chains</option>
              <option value={"data-no-edge"}>No Edges</option>
              <option value={"data-range-edge"}>3-5 Edges</option>
          </select>
          <button
            type="button"
            onClick={applyFilter}
            className="h-7 border-slate-600 inline-block rounded-full border-2 border-primary px-3
            pb-[6px] pt-1 text-xs font-medium uppercase leading-normal text-primary transition
            duration-150 ease-in-out hover:border-primary-accent-300 hover:bg-primary-50/50
            hover:text-primary-accent-300 focus:border-primary-600 focus:bg-primary-50/50
            focus:text-primary-300 focus:outline-none focus:ring-0 active:border-primary-700
            active:text-primary-700 motion-reduce:transition-none dark:text-primary-500">
            Apply
          </button>
        </div>
      )}
      
    </>
    );
  }
  