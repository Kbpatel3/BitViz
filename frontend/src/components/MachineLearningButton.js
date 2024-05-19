/**
 * Defines a Machine Learning Button Component
 * @author Noah Hassett
 * @author Kaushal Patel
 */

import machineLearning from "../media/ML_icon.png";
import { useReadSession } from "use-neo4j";  // Neo4j hook for reading data from the database
import { useState } from "react";  // React hook for managing state

// !added more features when clicked
/**
 * Machine Learning Button Component
 * @fileoverview Machine Learning Button Component
 * @returns {JSX.Element} A JSX element containing the Machine Learning Button
 */
export default function MachineLearningButton({ handleGraphSwitch, setBarMax, setMl }) {

  // Tracks if the graph has been switched
  const [switchedGraph, setSwitchedGraph] = useState(false);
  
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
        switchedGraph ? handleGraphSwitch('data-all-subset-no-ml') : handleGraphSwitch('data-all-subset');
        setBarMax(0); // Reset the bar max
        setSwitchedGraph(!switchedGraph); // Switch the graph
        setMl(); // Set the machine learning on/off
      }
      }
    />
  </>
  );
}
