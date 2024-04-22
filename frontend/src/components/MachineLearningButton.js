/**
 * Defines a Machine Learning Button Component
 * @author Noah Hassett
 * @author Kaushal Patel
 */

import machineLearning from "../media/ML_icon.png";
import { useReadSession } from "use-neo4j";  // Neo4j hook for reading data from the database
import { useState } from "react";  // React hook for managing state

// !new function
/**
 * Machine Learning Button Component
 * @fileoverview Machine Learning Button Component
 * @returns {JSX.Element} A JSX element containing the Machine Learning Button
 */
export default function MachineLearningButton({ handleGraphSwitch, setBarMax }) {

  const [switchedGraph, setSwitchedGraph] = useState(false);  // State for switching the graph

  //? Temporary
  // const session = useReadSession();

  // const query_data = `CALL apoc.load.json("https://raw.githubusercontent.com/Kbpatel3/BitViz/main/data/
  //   modified/data/data_all_predicted.json")
  //   YIELD value
  //   UNWIND value.data as data
  //   MERGE (s:Transaction {id: data.id, timestep: data.timestep, group: data.group})
  //   WITH s, data
  //   UNWIND data.edges as edge
  //   MERGE (t:Transaction {id: edge.id, timestep: edge.timestep, group: edge.group})
  //   MERGE (s)-[:CONNECTED]->(t)`

  // const query_meta = `CALL apoc.load.json("https://raw.githubusercontent.com/Kbpatel3/BitViz/main/data/
  //   modified/metadata/data_all_predicted_meta.json")
  //   YIELD value
  //   UNWIND value.data as data
  //   MERGE (n:meta {timestep: data.timestep, illicit: data.illicit, licit: data.licit, 
  //   unknown: data.unknown})`
  
  return (
    <>
    {/* Machine Learning Button */}
    <input
      className="mx-auto object-scale-down h-7 w-7"
      type="image"
      src={machineLearning}
      title="Machine Learning Analysis"
      onClick={() => {
        console.log('Machine Learning Button Clicked');
        console.log('Switched Graph: ' + switchedGraph);
        switchedGraph ? handleGraphSwitch('neo4j') : handleGraphSwitch('data-all-subset');
        setBarMax(0); // Reset the bar max
        setSwitchedGraph(!switchedGraph);
        // switchedGraph ? switchGraph('neo4j') : switchGraph('test');
      }
      }
    />
  </>
  );
}
