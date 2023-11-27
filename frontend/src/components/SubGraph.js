/**
 * SubGraph component, used to render the subgraph of a specific node
 * @author Kaushal Patel
 * @author Noah Hassett
 */

import { useReadCypher } from "use-neo4j";
import { useEffect, useState } from "react";
import SubGraphVisual from "./SubGraphVisual";

/**
 * SubGraph component, used to render the subgraph of a specific node
 * @param clickedNode - the node that was clicked on
 * @param nodeClick - function to be called when a node is clicked
 * @returns {JSX.Element} - the subgraph of the clicked node
 * @constructor - the subgraph component
 */
export default function SubGraph({ clickedNode, nodeClick }) {
  // Constants used for talking to the database
  const key = "{nodes: nodes, links: links}";

  /**
   * Takes a node and builds a query to get the data from the database
   * @param v - the node that was clicked on
   * @returns {string} - the query to be sent to the database
   */
  const getQuery = (v) => {
    const query = `MATCH path = (n {id: "${v}"})-[*]-(m)
     WHERE id(n) <> id(m)
     WITH nodes(path) AS nodes_in_path
     WITH nodes_in_path[size(nodes_in_path) - 2..] AS last_two_nodes
     WITH COLLECT({source: last_two_nodes[0].id, target: last_two_nodes[1].id}) AS links,
          COLLECT(DISTINCT {id:last_two_nodes[0].id, group:last_two_nodes[0].group}) +
          COLLECT(DISTINCT {id:last_two_nodes[1].id, group:last_two_nodes[1].group}) as nodes
     RETURN ${key}`;
    return query;
  };

  // Get the query
  let query = getQuery(clickedNode);

  // Get the functions and variables we need from the use-neo4j package
  const { loading, error, records, run } = useReadCypher(query);

  // Requery the database whenever the state of the clicked node changes
  useEffect(() => {
    query = getQuery(clickedNode);
    run({ query });
    if (loading) console.log("Loading");
    if (error) console.log("Error");
  }, [clickedNode]);

  // Init our data
  let data = undefined;

  // Check to see if the data has been assigned by the database yet
  if (records === undefined) {
    // Debug to see if the data has been assigned yet
    console.log("Records is undefined");
  } else {
    // If the data has finished retrieving from the database, assign it to the rawResult variable
    const rawResult = records[0].get(key);

    // Remove duplicate nodes by converting them to a Map
    const uniqueNodesMap = new Map(
      rawResult.nodes.map((node) => [node.id, node]),
    );

    // Convert the unique nodes back to an array
    const uniqueNodes = Array.from(uniqueNodesMap.values());

    // Assign the data to the data variable
    data = { ...rawResult, nodes: uniqueNodes };

    // Debug to see the data
    console.log("Data: ", data);
  }

  // Return the SubGraphVisual component if the data has been loaded
  return (
    <div>
      {data ? (
        // <div>
        //   <h2>Nodes</h2>
        //   <ul>
        //     {data.nodes.map((node) => (
        //       <li key={node.id}>
        //         ID: {node.id}, Group: {node.group}
        //       </li>
        //     ))}
        //   </ul>
        //
        //   <h2>Links</h2>
        //   <ul>
        //     {data.links.map((link, index) => (
        //       <li key={index}>
        //         Source: {link.source}, Target: {link.target}
        //       </li>
        //     ))}
        //   </ul>
        // </div>
        // Render the subgraph visual with the data and the clicked node
        <SubGraphVisual data={data} highlight={clickedNode} nodeClick={nodeClick}/>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}
