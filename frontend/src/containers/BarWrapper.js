/**
 * @author Adian Kirk
 * @author Kellan Anderson
 * Defines a container for a single barchart, used to retreive data for a sinlge chart. This component is mainly used to
 * show the barchart next to the force directed graph
 */
import React from "react";
import { useReadCypher } from "use-neo4j";
import Bar from "../components/barchart";

/**
 * Wrapper for the barchart, loads the data for a single barchart
 * @param timestep The timestep to render 
 * @returns A JSX component holding a single barchart
 */
export default function BarWrapper({timestep}) {
  // Defines the key and the query to get data from the database
  const key = '{groups: [{illicit: n.illicit, licit: n.licit, unknown: n.unknown}]}'
  const query = `match (n:meta {timestep: ${timestep}}) return ${key}`;

  // Gets the data and the loading values
  const { loading, first } = useReadCypher(query);

  // Init the result vector
  let result = <div>Loading</div>

  // Check to see if the data has been loaded yet
  if(first === undefined) {
    console.log('Bar wrapper data undefined')
  } else {
    // Get the data
    let data = first.get(key);
    // Wrap the data in an array for D3
    data = 
      [
        {label: 'illicit', value: data.groups[0].illicit.low, group: 1},
        {label: 'licit', value: data.groups[0].licit.low, group: 2},
        {label: 'unknown', value: data.groups[0].unknown.low, group: 3},
      ]

    // Set the result
    result = (
      <Bar data={data} />
    );
  }

  // Return the result
  return result;
}