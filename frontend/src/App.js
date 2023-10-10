import { useEffect, useState, useContext, useRef } from "react";
import Graph from "./components/Graph";
import Pie from "./components/Pie";
import BarSelector from "./containers/BarSelector";
import { useReadCypher } from "use-neo4j";
import Search from "./components/Search";
import ObserverContext from "./context/ObserverContext";
import { Select, MenuItem } from "@mui/material";
import BarWrapper from "./containers/BarWrapper";
import setting from "./settings_icon.png";
//import SubGraph from './components/SubGraph';
import Slider from "./components/Slider";
import Bar from "./components/barchart";
import NavBar from "./components/NavBar";
import SubGraph from "./components/SubGraph";

/**
 * App.js, logic entry point for our data. This function controls the ways things are rendered to the user
 * @author Kellan Anderson
 * @author Aidan Kirk
 * @returns JSX containing the view of our app
 */

function App() {
  // Used to keep track of the timestep
  const [timestep, setTimestep] = useState(1);
  // Used to keep track of what node has been clicked on
  const [clickedNode, setClickedNode] = useState(0);
  // Used to keep track of what meta-data is displayed with the force directed graph
  const [graph, setGraph] = useState("Pie");

  // Gets functions required for the observer design pattern using React's context API
  const { registerSubscriber, alertSubscriber } = useContext(ObserverContext);

  // Uses to specify the specific place in the page
  const ref = useRef(null);

  // Registers a callback function with the observer
  registerSubscriber((alertObject) => {
    alertObject.timestep && setTimestep(alertObject.timestep);
    setClickedNode(alertObject.id);
  });

  // Constants used for talking to the database
  const key = "{nodes: nodes, links: links}";

  // Takes a timestep and builds a query to get the data from the database
  const getQuery = (v) => {
    const query =
      `match (n:Transaction {timestep: "${v}"}), ` +
      `(a:Transaction {timestep: "${v}"})-[]->(b:Transaction {timestep: "${v}"}) ` +
      "WITH COLLECT(DISTINCT {id: n.id, group: n.group}) as nodes, " +
      `COLLECT(DISTINCT {source: a.id, target: b.id}) as links RETURN ${key}`;

    return query;
  };

  // Get the query
  let query = getQuery(timestep);

  // Get the functions and variables we need from the use-neo4j package
  const { records, run } = useReadCypher(query);

  // Requery the database whenever the state changes
  useEffect(() => {
    query = getQuery(timestep);
    run({ query });
  }, [timestep]);

  // Init our data
  let data = undefined;

  // Check to see if the data has been assigned by the database yet
  if (records === undefined) {
    console.log("Records is undefined");
  } else {
    // If the data has finished retreiving from the database, assign it to the data variable
    data = records[0].get(key);
    console.log(data);
  }

  // Runs whenever the slider is moved
  const handleChange = (value) => {
    setTimestep(parseInt(value));
  };

  // Runs when a bar chart has been clicked on
  const handleBarClick = (v) => {
    setTimestep(parseInt(v));
  };

  // Handles the change of the dropdown
  const handleGraph = (event) => {
    setGraph(event.target.value);
  };

  // Handles a click event on a node in the graph
  const handleCircleClick = (id) => {
    // Update the clicked node
    setClickedNode(id);

    // Call all of the callbacks registered in the observer context with the id, timestep and source
    alertSubscriber({
      id: parseInt(id),
      timestep: undefined,
      source: "graph",
    });
  };

  // Parent ref for the army of bar charts
  const scrollToRef = useRef(null);

  return (
    <>
      <div className="grid grid-cols-3 grid-rows-8 gap-2">
        {/* Row 1 which contains the search bar, page buttons, and the settings icon */}
        <div className="col-span-3 row-span-1 bg-slate-200 hover:bg-slate-300 flex justify-center items-center h-full">
          <NavBar scrollToRef={scrollToRef} />
        </div>

        {/* Row 2-7 which contains the main nodal structure */}
        {data ? (
          <div className="h-128 col-span-2 row-span-6 row-start-2 bg-slate-200 hover:bg-slate-300 h-full">
            {/* Graph component, shows the force directed graph */}
            {/*<div className='col-span-2'>*/}
            <Graph
              data={data}
              highlight={clickedNode}
              nodeClick={handleCircleClick}
            />
            {/*</div>*/}
          </div>
        ) : (
          <div>Data not loaded</div>
        )}

        {/* Row 2-4 and column 3 which contains the bar graph/pie chart */}
        {data ? (
          <div className="row-span-3 col-start-3 row-start-2 bg-slate-200 hover:bg-slate-300">
            {/* Select component for choosing the graph type */}
            <Select
              className={"w-full"}
              labelId="graph_type_label"
              id="graph_type"
              value={graph}
              onChange={handleGraph}
            >
              <MenuItem value={"Bar"}>Histogram</MenuItem>
              <MenuItem value={"Pie"}>Pie Chart</MenuItem>
            </Select>

            {/* Conditional rendering of the selected graph */}
            {graph === "Bar" && <BarWrapper timestep={timestep} />}
            {graph === "Pie" && <Pie data={data.nodes} />}
          </div>
        ) : (
          <div>Data not loaded</div>
        )}

        {/* Row 5-7 and column 3 which contains the subgraph */}
        <div className="row-span-3 col-start-3 row-start-5 bg-slate-200 hover:bg-slate-300">
          {/* <SubGraph/> */}
          {clickedNode ? (
            <div>
              <SubGraph clickedNode={clickedNode} />
            </div>
          ) : (
            <div>Click a node to see its subgraph</div>
          )}
        </div>

        {/* Row 8 which contains the slider */}
        <div className="col-span-3 row-start-8 bg-slate-200 hover:bg-slate-300 pt-2.5">
          {/* Slider component */}
          <Slider
            timestep={timestep}
            setTimestep={setTimestep}
            handleChange={handleChange}
          />
        </div>
      </div>
      <div ref={scrollToRef}>
        <BarSelector highlighted={timestep} clickFunction={handleBarClick} />
      </div>
    </>
  );
}

export default App;
