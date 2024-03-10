/**
 * App.js
 *
 * The main component of our application. This component is responsible for rendering all the other 
 * components in our application. It also contains the logic for the observer design pattern. This 
 * pattern is used to communicate between the slider, the bar charts, and the force-directed graph.
 * Whenever the slider is moved, the App component is notified, and it updates the timestep. 
 * Whenever a bar chart is clicked, the App component is notified and it updates the timestep. 
 * Whenever a node is clicked on the force-directed graph, the App component is notified and it 
 * updates the clicked node. The App component then notifies all of the other components of the 
 * change in state. This allows us to have a single source of truth for the state of the 
 * application. This component also contains the logic for querying the database. Whenever the 
 * timestep is changed, the App component queries the database for the data at that timestep.
 *
 * @module App
 * @author Kellan Anderson
 * @author Aidan Kirk
 * @author Kaushal Patel
 * @author Noah Hassett
 * @returns {JSX.Element} - JSX containing the view of our app
 */

// Import statements
import {useEffect, useState, useContext, useRef} from "react";  // React hooks
import Graph from "./components/Graph"; // Force directed graph
import Pie from "./components/Pie"; // Pie chart
import BarSelector from "./containers/BarSelector"; // Bar chart selector
import {useReadCypher} from "use-neo4j";    // Neo4j hook
import ObserverContext from "./context/ObserverContext";    // Observer context
import {Select, MenuItem} from "@mui/material"; // Select component
import BarWrapper from "./containers/BarWrapper";   // Bar chart wrapper
import Slider from "./components/Slider";   // Slider component
import Bar from "./components/barchart";    // Bar chart
import NavBar from "./components/NavBar";   // Navigation bar
import SubGraph from "./components/SubGraph";   // Subgraph
import Key from "./components/Key";  // Key


// !mainly modified html code to change the tool's layout
/**
 * Main application component responsible for rendering the entire application.
 * Implements the observer design pattern to manage state across components.
 *
 * @returns {JSX.Element} - JSX containing the view of the app
 */
function App() {
    // Used to keep track of the timestep
    const [timestep, setTimestep] = useState(1);
    // Used to keep track of what node has been clicked on
    const [clickedNode, setClickedNode] = useState(0);
    // Used to keep track of what meta-data is displayed with the force directed graph
    const [graph, setGraph] = useState("Pie");

    // Gets functions required for the observer design pattern using React's context API
    const {registerSubscriber, alertSubscriber} = useContext(ObserverContext);

    // Parent ref for the army of bar charts
    const scrollToRef = useRef(null);

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
    //const {records, run} = useReadCypher(query);

    let database = 'neo4j';

    // use useReadCypher to query the database named 'illicitchain'
    const {records, run} = useReadCypher(query, {database: database});

    // Requery the database whenever the state changes
    useEffect(() => {
        query = getQuery(timestep);
        run({query});
    }, [timestep]);
    // alert(JSON.stringify(records));

    // Init our data
    let data = undefined;

    // Check to see if the data has been assigned by the database yet
    if (records === undefined) {
        console.log("Records is undefined");
    } else {
        // If the data has finished retrieving from the database, assign it to the data variable
        data = records[0].get(key);
        //console.log(data);
    }

    // Runs whenever the slider is moved
    const handleChange = (value) => {
        setTimestep(parseInt(value));
    };

    // Runs when a bar chart has been clicked on
    const handleBarClick = (v) => {
        if (v !== timestep) { // only update if the bar clicked is not the current timestep
            setTimestep(parseInt(v));
            setClickedNode(0); // reset the clicked node
        }
    };

    // Handles the change of the dropdown
    const handleGraph = (event) => {
        setGraph(event.target.value);
    };

    // Handles a click event on a node in the graph
    const handleCircleClick = (id) => {
        // Update the clicked node
        setClickedNode(id);

        // Call all the callbacks registered in the observer context with the id, timestep and src
        alertSubscriber({
            id: parseInt(id),
            timestep: undefined,
            source: "graph",
        });
    };

    return (
        <>
            <div className="grid grid-cols-3 grid-rows-8 gap-2">
                {/* Row 1 which contains the search bar, page buttons, and the settings icon */}
                <div
                    className="col-span-3 row-span-1 bg-slate-200 hover:bg-slate-300 flex 
                        justify-center items-center h-full">
                    <NavBar scrollToRef={scrollToRef} timestep={timestep}/>
                </div>

                {/* Row 2-7 which contains the main nodal structure */}
                {data ? (
                    <div 
                    className="h-128 col-span-2 row-span-6 row-start-2 bg-slate-200 
                        hover:bg-slate-300">
                        {/* Render the color key */}
                        <Key className={"m-auto"}/>

                        {/* Render the force directed graph */}
                        <Graph
                            data={data}
                            highlight={clickedNode}
                            nodeClick={handleCircleClick}
                        />
                        {/*</div>*/}
                    </div>
                ) : (
                    <div 
                    className="h-128 col-span-2 row-span-6 row-start-2 bg-slate-200 
                        hover:bg-slate-300">
                        Data not loaded
                    </div>
                )}

                {/* Row 2-4 and column 3 which contains the bar graph/pie chart */}
                {data ? (
                    // Shift this down to anchor bottom of container
                    <div
                        className="row-span-3 col-start-3 row-start-2 bg-slate-200 
                            hover:bg-slate-300 max-h-[320px]">
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
                        {graph === "Bar" && (
                            <div className="relative -bottom-16">
                                <BarWrapper timestep={timestep}/>
                            </div>
                        )}
                        {graph === "Pie" && <Pie data={data.nodes}/>}
                    </div>
                ) : (
                    <div 
                    className="h-80 row-span-3 col-start-3 row-start-2 bg-slate-200 
                        hover:bg-slate-300">
                        Data not loaded
                    </div>
                )}

                {/* Row 5-7 and column 3 which contains the subgraph */}
                <div
                    className="subgraph row-span-3 col-start-3 row-start-5 bg-slate-200 
                        hover:bg-slate-300 min-h-[320px] min-w-[500px]"
                >
                    {/* <SubGraph/> */}
                    {clickedNode ? (
                        <div>
                            <SubGraph clickedNode={clickedNode} nodeClick={handleCircleClick}/>
                        </div>
                    ) : (
                        <div>Click a node to see its subgraph</div>
                    )}
                </div>

                {/* Row 8 which contains the slider */}
                <div ref={scrollToRef} 
                className="col-span-3 row-start-8 bg-slate-200 hover:bg-slate-300 pt-2.5">
                    {/* Slider component */}
                    <Slider
                        timestep={timestep}
                        setTimestep={setTimestep}
                        handleChange={handleChange}
                    />
                </div>
            </div>
            <div>
                <BarSelector highlighted={timestep} clickFunction={handleBarClick}/>
            </div>
        </>
    );
}

export default App;
