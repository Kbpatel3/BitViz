/**
 * @author Adian Kirk
 * @author Kellan Anderson
 * Container to hold several barcharts, specifically, one per timestep. AKA Army of barcharts
 */

import React from "react";
import Bar from "../components/barchart";
import { useReadCypher } from "use-neo4j";
import convert from "../helper/convert";

/**
 * Barselector componets, defines the logic needed to display a barchart per each timestep
 * @param highlightedAndClickfuntion takes two parameters, highlighted is the barchart to highlight, and the click
 * function, which is run whenever a barchart is clicked on
 * @returns A JSX component showing the army of barcharts
 */
export default function BarSelector({ highlighted, clickFunction }) {
    // Define our query and our key
    const query = 'match (n:meta) with collect({timestep: n.timestep, illicit:n.illicit, licit:n.licit,' +
                  ' unknown:n.unknown}) as meta return meta';
    const key = 'meta';

    // Get the results and the loading value from the database
    const { loading, first } = useReadCypher(query);

    // Define the initial result
    let result = <div>Loading</div>;

    // Check to see if the data has been loaded
    if(first === undefined) {
      console.log("Meta data is undefined")
    } else {
      // Data has been loaded, gets the data and passes it to convert() to be properly formatted
      let data = first.get(key);
      data = convert(data);

      data.map((d) => {
        console.log(d);
      });

    const sortBarsByIllicit = (data) => {
      return data.sort((a, b) => {
        const illicitValueA = a.groups[0].value;
        const illicitValueB = b.groups[0].value;

        if (illicitValueA > illicitValueB) {
          return -1;
        } else if (illicitValueA < illicitValueB) {
          return 1;
        } else {
          return 0;
        }
      });
    };

    // Define a function to handle the sorting button click
    const handleSortClick = () => {
      // Sort the data and update the state
      data = sortBarsByIllicit(data)
    };

    // data = sortBarsByIllicit(data);


    // Sets/displayed the barcharts
    result = (
        <>
        <div><button onClick={handleSortClick}>Sort Bars by Illicit</button></div>
      <div className="grid grid-cols-2 md:grid-cols-5 lg:grid-cols-10">
        {/* Map over the data that has been retreived from the database */}
        {data.map((d) =>
          {
            // set the border color depending on if it has been highlighted
            const borderColor = Number(d.timestep.low) === highlighted ? "border-rose-600" : "border-white";
            
            return (
              <div >
                {/* sets a single barchart and calls the click funciton with the datas timestep on a click event */}
                <div
                  className={`m-2 p-1 border-4 ${borderColor} border-dashed self-center h-40`}
                  key={d.timestep.low}
                  onClick={() => clickFunction(d.timestep.low)}
                  >
                    {/* Renders a single bar chart */}
                    <Bar data={d.groups} />
                </div>
                {/* Show the timestep of the barchart */}
                <p className="text-center">Timestep {d.timestep.low}</p>
              </div>
            );
          }
        )}
      </div>
    );
          </>)
  }

  // Return the army of barcharts
  return result;
}

