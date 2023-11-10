/**
 * @author Adian Kirk
 * @author Kellan Anderson
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

    // Define the initial result
    let result = <div>Loading</div>;

    // Check to see if the data has been loaded
    if (first === undefined) {
        console.log("Meta data is undefined")
    } else {
        // Data has been loaded, gets the data and passes it to convert() to be properly formatted
        let data = first.get(key);
        data = convert(data);

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
            setSortedData(sortedData);
        };

        // data = sortBarsByIllicit(data);


        // Sets/displayed the barcharts
        result = (
            <>
                <div>
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
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10">
                    {sortedData.length > 0 ? (
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
                    ) : (
                        data.map((d) => (
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

