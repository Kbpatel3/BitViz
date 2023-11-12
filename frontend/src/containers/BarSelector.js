/**
 * @author Aidan Kirk
 * @author Kellan Anderson
 * @author Noah Hassett
 * @author Kaushal Patel
 * Container to hold several barcharts, specifically, one per timestep. AKA Army of barcharts
 */

import React from "react";
import Bar from "../components/barchart";
import {useReadCypher} from "use-neo4j";
import convert from "../helper/convert";

/**
 * Barselector componets, defines the logic needed to display a barchart per each timestep
 * @param highlightedAndClickfuntion takes two parameters, highlighted is the barchart to highlight, and the click
 * function, which is run whenever a barchart is clicked on
 * @returns A JSX component showing the army of barcharts
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
    
    //!temp
    //const [filteredData, setFilteredData] = React.useState([]);
    const [newData, setNewData] = React.useState([]);

    // Define the initial result
    let result = <div>Loading</div>;

    // Check to see if the data has been loaded
    if (first === undefined) {
        console.log("Meta data is undefined")
    } else {
        // Data has been loaded, gets the data and passes it to convert() to be properly formatted
        let data = first.get(key);
        data = convert(data);

        //!temp
        //let isFiltered = false;
        //let isSorted = false;

        const sortBarsByIllicit = (data, sortOption, sortOrder) => {
            return data.sort((a, b) => {
                let labelValueA;
                let labelValueB;
                switch (sortOption) {
                    case "Illicit":
                        labelValueA = a.groups[0].value;
                        labelValueB = b.groups[0].value;
                        break;
                    case "Licit":
                        labelValueA = a.groups[1].value;
                        labelValueB = b.groups[1].value;
                        break;
                    case "Unknown":
                        labelValueA = a.groups[2].value;
                        labelValueB = b.groups[2].value;
                        break;
                }

                // Change the order based on sortOrder
                if (sortOrder === 0) {
                    if (labelValueA > labelValueB) {
                        return 1;
                    } else if (labelValueA < labelValueB) {
                        return -1;
                    } else {
                        return 0;
                    }
                } else if (sortOrder === 1) {
                    if (labelValueA > labelValueB) {
                        return -1;
                    } else if (labelValueA < labelValueB) {
                        return 1;
                    } else {
                        return 0;
                    }
                } else {
                    return 0;
                }
            });
        };

        // Define a function to handle the sorting button click
        const handleSortClick = (sortOption, sortOrder) => {
            // Sort the data and update the state
            // data = sortBarsByIllicit(data)
            console.log("sortOption: ", sortOption);
            console.log("sortOrder: ", sortOrder);
            const sortedData = sortBarsByIllicit(data, sortOption, sortOrder);
            // const sortedData = isFiltered ? sortBarsByIllicit(newData, sortOption, sortOrder) : sortBarsByIllicit(data, sortOption, sortOrder);
            setSortedData(sortedData);
            setNewData(sortedData);
        };

        // filters the data based on the filterOption, minRange, and maxRange
        const filterData = (data, filterOption, minRange, maxRange) => {
            return data.filter((a) => {
                let totalValue = a.groups[0].value + a.groups[1].value + a.groups[2].value;
                let labelValue;
                
                // Calculate the percentage of the label
                switch (filterOption) {
                    case "Illicit":
                        labelValue = (a.groups[0].value/totalValue) * 100;
                        break;
                    case "Licit":
                        labelValue = (a.groups[1].value/totalValue) * 100;
                        break;
                    case "Unknown":
                        labelValue = (a.groups[2].value/totalValue) * 100;
                        break;
                }
                // checks if the labelValue is within the range
                if (labelValue >= minRange && labelValue <= maxRange) {
                    return true;
                }
            });
        };

        // Define a function to handle the filtering button click
        const handleFilterClick = (filterOption, minRange, maxMin) => {
            // Filter the data and update the state
            if (filterOption === "Default") {
                sortedData.length > 0 ? setNewData(sortedData) : setNewData(data); //TODO: make it so it'll be sorted after reset it
            } else {
                // if sortedData is not empty, filter the sortedData, otherwise filter the data
                const filteredData = sortedData.length > 0 ? 
                filterData(sortedData, filterOption, minRange, maxMin) : filterData(data, filterOption, minRange, maxMin);

                setNewData(filteredData); // sets the filtered data
            }
        };

        // //!temp
        // const toggleFileter = () => {
        //     var filterPanel = document.getElementById("filterPanel");
        //     filterPanel.classList.toggle("hidden");
        // }

        // data = sortBarsByIllicit(data);


        // Sets/displayed the barcharts
        result = (
            <>
                <div className="flex justify-between items-center">
                    <select
                        className="block mt-1 border-gray-300 rounded-md shadow-sm focus:border-rose-600 focus:ring-rose-600 text-center"
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
                    
                    {/* <button className="block mt-1 border-gray-300 rounded-md shadow-sm focus:border-rose-600 focus:ring-rose-600 text-center" 
                            onClick={(e) => handleFilterClick("Unknown", 70, true)}>
                        Filter Timesteps
                    </button> */}

                    {/* <button className="mr-8" 
                            onClick={(e) => toggleFileter()}>
                        Filter
                    </button> */}

                    <form id="filterForm" class="mr-5">
                        <select id="filterType" name="filterType">
                            <option value="Illicit">Illicit</option>
                            <option value="Licit">Licit</option>
                            <option value="Unknown">Unknown</option>
                        </select>

                        <input type="number" id="minRange" name="minRange" placeholder="Min (%)" min="0" max="100" class="w-24 py-1 px-2 border rounded"></input>
                        <label> ~ </label>
                        <input type="number" id="maxRange" name="maxRange" placeholder="Max (%)" min="0" max="100" class="w-24 py-1 px-2 border rounded"></input>
                        <label> </label>
                        <button type="button" onClick={(e) => {
                                handleFilterClick(document.getElementById("filterType").value,
                                                    document.getElementById("minRange").value === "" ? 0 : document.getElementById("minRange").value,
                                                    document.getElementById("maxRange").value === "" ? 100 : document.getElementById("maxRange").value);
                            }} class="border rounded">Filter</button>
                        
                        {/* ToDo: Discuss the need */}
                        <label> </label>
                        <button type="button" onClick={(e) => {handleFilterClick("Default", 0, 100)}} class="border rounded">Reset</button>
                    </form>

                </div>
                
                {/* Filter Panel when we need more features for filtering */}
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

                <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10">
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
                    {newData.length > 0 ? (
                        newData.map((d) => (
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
                    ) : (
                        data.map((d) => (
                        //filteredData.map((d) => (
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
                    )}
                </div>
            </>
        );
    }

    // Return the army of barcharts
    return result;
}

