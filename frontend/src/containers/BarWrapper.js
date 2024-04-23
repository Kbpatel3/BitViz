/**
 * Defines a container for a single barchart, used to retrieve data for a single chart. This
 * component is mainly used to show the barchart next to the force-directed graph.
 *
 * @module BarWrapper
 * @constant
 * @type {React.Component}
 * @see Bar
 * @see use-neo4j
 * @author Kellan Anderson
 * @author Aidan Kirk
 */

// Imports
import React from "react";  // React
import { useReadCypher } from "use-neo4j";  // Neo4j hook
import Bar from "../components/barchart"; // Barchart

/**
 * Wrapper for the barchart, loads the data for a single barchart.
 *
 * @function
 * @name BarWrapper
 * @param {Object} props - React component properties.
 * @param {number} props.timestep - The timestep to render.
 * @returns {React.Component} - A JSX component holding a single barchart.
 */
export default function BarWrapper({timestep, queryFunction, barMax, setBarMax}) {
  // State for the query results
  const [records, setRecords] = React.useState(undefined);

  // Defines the key and the query to get data from the database
  const key = '{groups: [{illicit: n.illicit, licit: n.licit, unknown: n.unknown}]}'
  const query = `match (n:meta {timestep: ${timestep}}) return ${key}`;

  // // Gets the data and the loading values
  // const { loading, first } = useReadCypher(query);

  // Use effect for the render to query the database
  React.useEffect(() => {
    let isMounted = true;

    queryFunction(query).then((result) => {
      if (isMounted) {
        setRecords(result)
      }
    });

    return () => { isMounted = false };
  }, [queryFunction, query])

  // Initialize the result vector
  let result = <div>Loading</div>

  // Check to see if the data has been loaded yet
  if(records === undefined) {
    console.log('Bar wrapper data undefined')
  } else {
    // Get the data
    let data = records[0].get(key);
    // Wrap the data in an array for D3
    data = 
      [
        {label: 'illicit', value: data.groups[0].illicit.low, group: 1},
        {label: 'licit', value: data.groups[0].licit.low, group: 2},
        {label: 'unknown', value: data.groups[0].unknown.low, group: 3},
      ]
    
    // Set the result
    result = (
      <Bar data={data} barMax={barMax} setBarMax={setBarMax}/>
    );
  }

  // Return the result
  return result;
}