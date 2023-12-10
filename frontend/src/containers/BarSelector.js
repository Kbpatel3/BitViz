/**
 * Container to hold several barcharts, specifically, one per timestep. AKA Army of barcharts
 *
 * @module BarSelector
 * @constant
 * @type {React.Component}
 * @see Bar
 * @see use-neo4j
 * @see convert
 * @author Kellan Anderson
 * @author Aidan Kirk
 * @author Kaushal Patel
 * @author Noah Hassett
 */

// Imports
import React from "react";  // React
import Bar from "../components/barchart";   // Barchart
import {useReadCypher} from "use-neo4j";    // Neo4j
import convert from "../helper/convert";    // Convert

/**
 * BarSelector component, defines the logic needed to display a barchart for each timestep.
 *
 * @function
 * @name BarSelector
 * @param {Object} props - React component properties.
 * @param {number} props.highlighted - The timestep of the highlighted barchart.
 * @param {Function} props.clickFunction - The function to be run whenever a barchart is clicked on.
 * @returns {React.Component} - A JSX component showing the army of barcharts.
 */
export default function BarSelector({highlighted, clickFunction}) {
    // Define our query and our key
    const query = 'match (n:meta) with collect({timestep: n.timestep, illicit:n.illicit, licit:n.licit,' +
        ' unknown:n.unknown}) as meta return meta';
    const key = 'meta';

    // Get the results and the loading value from the database
    const {loading, first} = useReadCypher(query);

    // State for sorted data
    const [sortedData, setSortedData] = React.useState([]);
    
    // State for sorted/filtered data
    const [newData, setNewData] = React.useState([]);

    // Define the initial result
    let result = <div>Loading</div>;

    // State for whether the data is new
    const [isNewData, setIsNewData] = React.useState(false);

    // Check to see if the data has been loaded
    if (first === undefined) {
        console.log("Meta data is undefined")
    } else {
        // Data has been loaded, gets the data and passes it to convert() to be properly formatted

        // Get the data
        let data = first.get(key);

        // Convert the data
        data = convert(data);


        /**
         * Sorts the data based on the sortOption and sortOrder
         * @param data - the data to be sorted
         * @param sortOption - the option to sort by (Illicit, Licit, Unknown)
         * @param sortOrder - the order to sort by (Ascending is 0, Descending is 1)
         * @returns {*} - the sorted data
         */
        const sortBarsByIllicit = (data, sortOption, sortOrder) => {
            // Sort the data based on the sortOption
            return data.sort((a, b) => {
                // Temporary variables to hold the value of the label to be sorted
                let labelValueA;
                let labelValueB;
                // Switch statement to determine which label to sort by
                switch (sortOption) {
                    case "Illicit":
                        // Index 0 is Illicit label and its value
                        labelValueA = a.groups[0].value;
                        labelValueB = b.groups[0].value;
                        break;
                    case "Licit":
                        // Index 1 is Licit label and its value
                        labelValueA = a.groups[1].value;
                        labelValueB = b.groups[1].value;
                        break;
                    case "Unknown":
                        // Index 2 is Unknown label and its value
                        labelValueA = a.groups[2].value;
                        labelValueB = b.groups[2].value;
                        break;
                }

                // Change the order based on sortOrder (Ascending or Descending)
                if (sortOrder === 0) {
                    if (labelValueA > labelValueB) {
                        return 1;
                    } else if (labelValueA < labelValueB) {
                        return -1;
                    } else {
                        return 0;
                    }
                // Descending
                } else if (sortOrder === 1) {
                    if (labelValueA > labelValueB) {
                        return -1;
                    } else if (labelValueA < labelValueB) {
                        return 1;
                    } else {
                        return 0;
                    }
                // Default
                } else {
                    return 0;
                }
            });
        };

        /**
         * Defines a function to handle the sorting button click
         * @param sortOption - the option to sort by (Illicit, Licit, Unknown)
         * @param sortOrder - the order to sort by (Ascending is 0, Descending is 1)
         */
        const handleSortClick = (sortOption, sortOrder) => {
            // Call the sortBarsByIllicit function to sort the data
            const sortedData = sortBarsByIllicit(data, sortOption, sortOrder);

            // Update the state
            setSortedData(sortedData);

            // Set the new data to the sorted data and update the state for isNewData to true
            setNewData(sortedData);
            setIsNewData(true);
        };

        /**
         * Defines a function to filter the data based on the filterOption, minRange, and maxRange
         * @param data - the data to be filtered
         * @param filterOption - the option to filter by (Illicit, Licit, Unknown)
         * @param minRange - the minimum range to filter by
         * @param maxRange - the maximum range to filter by
         * @returns {*} - the filtered data
         */
        const filterData = (data, filterOption, minRange, maxRange) => {
            // Filter the data based on the filterOption
            return data.filter((a) => {
                // Calculate the total value of the label
                let totalValue = a.groups[0].value + a.groups[1].value + a.groups[2].value;
                let labelValue;
                
                // Calculate the percentage of the label based on the total value
                switch (filterOption) {
                    case "Illicit":
                        // Index 0 is Illicit label and its value
                        labelValue = (a.groups[0].value/totalValue) * 100;
                        break;
                    case "Licit":
                        // Index 1 is Licit label and its value
                        labelValue = (a.groups[1].value/totalValue) * 100;
                        break;
                    case "Unknown":
                        // Index 2 is Unknown label and its value
                        labelValue = (a.groups[2].value/totalValue) * 100;
                        break;
                }

                // Check if the labelValue is within the range of minRange and maxRange
                if (labelValue >= minRange && labelValue <= maxRange) {
                    // If it is, return true
                    return true;
                }
            });
        };

        /**
         * Defines a function to handle the filter button click
         * @param filterOption - the option to filter by (Illicit, Licit, Unknown)
         * @param minRange - the minimum range to filter by
         * @param maxRange - the maximum range to filter by
         */
        const handleFilterClick = (filterOption, minRange, maxRange) => {
            // Check if the filterOption is Default
            if (filterOption === "Default") {
                // If the length of sortedData is greater than 0, set the newData to sortedData, otherwise default data
                // This ensures that the data will be sorted after reset it
                sortedData.length > 0 ? setNewData(sortedData) : setNewData(data);
            } else {
                // This means that the user has selected a filter option. If the data was sorted, filter the sorted data, otherwise filter the default data
                const filteredData = sortedData.length > 0 ? 
                filterData(sortedData, filterOption, minRange, maxRange) : filterData(data, filterOption, minRange, maxRange);

                setNewData(filteredData); // sets the filtered data
                setIsNewData(true); // sets the isNewData to true
            }
        };

        // Note: For filter panel
        // const toggleFileter = () => {
        //     var filterPanel = document.getElementById("filterPanel");
        //     filterPanel.classList.toggle("hidden");
        // }

        // data = sortBarsByIllicit(data);

        // Sets/displayed the barcharts
        result = (
            <>
                <div className="flex justify-between items-center m-2">
                    <select
                        className="block mt-1 border-gray-300 rounded-md shadow-sm focus:border-rose-600 focus:ring-rose-600 text-center bg-slate-200 hover:bg-slate-300"
                        onChange={(e) => {
                            const [sortBy, sortOrder] = e.target.value.split(",");
                            handleSortClick(sortBy, parseInt(sortOrder, 10));
                        }}
                    >
                        <option value={"Sort Timesteps, -1"}>Sort Timesteps</option>
                        <option value={"Illicit,0"}>Sort Illicit (Ascending)</option>
                        <option value={"Illicit,1"}>Sort Illicit (Descending)</option>
                        <option value={"Licit,0"}>Sort Licit (Ascending)</option>
                        <option value={"Licit,1"}>Sort Licit (Descending)</option>
                        <option value={"Unknown,0"}>Sort Unknown (Ascending)</option>
                        <option value={"Unknown,1"}>Sort Unknown (Descending)</option>
                    </select>
                    
                    {/* For filter Panel */}
                    {/* <button className="block mt-1 border-gray-300 rounded-md shadow-sm focus:border-rose-600 focus:ring-rose-600 text-center" 
                            onClick={(e) => handleFilterClick("Unknown", 70, true)}>
                        Filter Timesteps
                    </button> */}

                    {/* <button className="mr-8" 
                            onClick={(e) => toggleFileter()}>
                        Filter
                    </button> */}
                    <div className={"rounded-md bg-slate-200 hover:bg-slate-300 p-2"}>
                        <form id="filterForm" className="mr-5">
                            <select id="filterType" name="filterType">
                                <option value="Illicit">Illicit</option>
                                <option value="Licit">Licit</option>
                                <option value="Unknown">Unknown</option>
                            </select>

                            <input type="number" id="minRange" name="minRange" placeholder="Min (%)" min="0" max="100" className="w-24 py-1 px-2 border rounded"></input>
                            <label> ~ </label>
                            <input type="number" id="maxRange" name="maxRange" placeholder="Max (%)" min="0" max="100" className="w-24 py-1 px-2 border rounded"></input>
                            <label> </label>
                            <button type="button" onClick={(e) => {
                                    handleFilterClick(document.getElementById("filterType").value,
                                                        document.getElementById("minRange").value === "" ? 0 : document.getElementById("minRange").value,
                                                        document.getElementById("maxRange").value === "" ? 100 : document.getElementById("maxRange").value);
                                }} className="border rounded">Filter</button>

                            {/* ToDo: Discuss the need */}
                            <label> </label>
                            <button type="button" onClick={(e) => {handleFilterClick("Default", 0, 100)}} className="border rounded">Reset</button>
                        </form>
                    </div>

                </div>
                
                {/* Note: Filter Panel when we need more features for filtering */}
                {/* <div id="filterPanel" class="hidden bg-white p-4 mt-4 border border-gray-300 rounded">
                    <div class="mb-4">
                    <label for="minRange" class="block text-sm font-medium text-gray-600">Min Range:</label>
                    <input type="text" id="minRange" name="minRange" class="mt-1 p-2 border border-gray-300 rounded w-full">
                    </input>
                    </div>

                    <div class="mb-4">
                    <label for="maxRange" class="block text-sm font-medium text-gray-600">Max Range:</label>
                    <input type="text" id="maxRange" name="maxRange" class="mt-1 p-2 border border-gray-300 rounded w-full">
                    </input>
                    </div>
                </div> */}

                    {/* <select
                        className="block mt-1 border-gray-300 rounded-md shadow-sm focus:border-rose-600 focus:ring-rose-600 text-center"
                            onChange={(e) => {
                                const [filterBy, filterRange, isMin] = e.target.value.split(",");
                                handleSortClick(filterBy, parseInt(filterRange, 10), isMin);
                            }}
                    >
                        <button value={"Filter Timesteps, 50, true"}>Filter Timesteps</button>
                    </select>
                {/* </div> */}

                {/* <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10"> */}
                    {/* Whether the user selected the sorted data */}
                    {/* {sortedData.length > 0 ? (
                        sortedData.map((d) => (
                            <div key={d.timestep.low}>
                                <div
                                    className={`m-2 p-1 border-4 ${
                                        Number(d.timestep.low) === highlighted
                                            ? "border-rose-600"
                                            : "border-grey"
                                    } border-dashed self-center h-40`}
                                    onClick={() => clickFunction(d.timestep.low)}
                                >
                                    <Bar data={d.groups}/>
                                </div>
                                <p className="text-center">Timestep {d.timestep.low}</p>
                            </div>
                        ))
                        
                    ) : ( */}

                    {/* Checks whether either sorting or filtering is performed */}
                    {isNewData ? 
                    ( newData.length > 0 ? ( // Checks whether the new data is empty
                        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10">
                            {newData.map((d) => (
                                <div key={d.timestep.low}>
                                    <div
                                        className={`m-2 p-1 border-4 ${
                                            Number(d.timestep.low) === highlighted
                                                ? "border-rose-600"
                                                : "border-grey"
                                        } border-dashed self-center h-40`}
                                        onClick={() => clickFunction(d.timestep.low)}
                                    >
                                        <Bar data={d.groups}/>
                                    </div>
                                    <p className="text-center">Timestep {d.timestep.low}</p>
                                </div>
                            ))}
                        </div>) : ("No Matched Timesteps")
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10">
                            {data.map((d) => (
                                <div key={d.timestep.low}>
                                    <div
                                        className={`m-2 p-1 border-4 ${
                                            Number(d.timestep.low) === highlighted
                                                ? "border-rose-600"
                                                : "border-grey"
                                        } border-dashed self-center h-40`}
                                        onClick={() => clickFunction(d.timestep.low)}
                                    >
                                        <Bar data={d.groups}/>
                                    </div>
                                    <p className="text-center">Timestep {d.timestep.low}</p>
                                </div>
                            ))}
                        </div>
                    )}
            </>
        );
    }

    // Return the army of barcharts
    return result;
}

