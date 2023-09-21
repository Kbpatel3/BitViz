import { useEffect, useState, useContext } from 'react';
import Graph from './components/Graph';
import Pie from './components/Pie';
import BarSelector from './containers/BarSelector';
import { useReadCypher } from 'use-neo4j';
import Search from './components/Search';
import ObserverContext from './context/ObserverContext';
import { Select, MenuItem } from '@mui/material';
import BarWrapper from './containers/BarWrapper';

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
  const [graph, setGraph] = useState('Pie');

  // Gets functions required for the observer design pattern using React's context API
  const { registerSubscriber, alertSubscriber } = useContext(ObserverContext);

  // Registers a callback function with the observer
  registerSubscriber((alertObject) => {
    alertObject.timestep && setTimestep(alertObject.timestep);
    setClickedNode(alertObject.id);
  })

  // Constants used for talking to the database
  const key = "{nodes: nodes, links: links}";
  
  // Takes a timestep and builds a query to get the data from the database
  const getQuery = (v) => {
    const query = `match (n:Transaction {timestep: "${v}"}), ` +
                  `(a:Transaction {timestep: "${v}"})-[]->(b:Transaction {timestep: "${v}"}) ` +
                  "WITH COLLECT(DISTINCT {id: n.id, group: n.group}) as nodes, " + 
                  `COLLECT(DISTINCT {source: a.id, target: b.id}) as links RETURN ${key}`;
    
    return query;
  };

  // Get the query
  let query = getQuery(timestep);
  
  // Get the functions and variables we need from the use-neo4j package
  const {records, run} = useReadCypher(query);

  // Requery the database whenever the state changes
  useEffect(() => {
    query = getQuery(timestep);
    run({query});
  }, [timestep]);

  // Init our data
  let data = undefined;

  // Check to see if the data has been assigned by the database yet
  if(records === undefined) {
    console.log("Records is undefined");
  }
  else {
    // If the data has finished retreiving from the database, assign it to the data variable
    data = records[0].get(key);
  }
  
  // Runs whenever the slider is moved
  const handleChange = (value) => {
    setTimestep(parseInt(value));
  }

  // Runs when a bar chart has been clicked on
  const handleBarClick = (v) => {
    setTimestep(parseInt(v));
  }

  // Handles the change of the dropdown
  const handleGraph = (event) => {
	  setGraph(event.target.value);
  }

  // Handles a click event on a node in the graph
  const handleCircleClick = (id) => {
    // Update the clicked node
    setClickedNode(id);

    // Call all of the callbacks registered in the observer context with the id, timestep and source
    alertSubscriber({
      id: parseInt(id),
      timestep: undefined,
      source: "graph"
    })
  }

  // return (
  //   <>
  //     <div className='grid grid-rows-5 h-screen'>
  //       <div className='row-span-4'>
  //         {
  //         /*
  //         Check to make sure the data has loaded
  //         If the data has loaded render the result
  //         Else, tells the user that the data has not loaded yet
  //         */
  //         }
  //         {data ?
  //           <div className='grid grid-cols-3 w-full h-full'>
  //
  //             {/* Graph component, shows the force directed graph */}
  //             <div className='col-span-2'>
  //               <Graph data={data} highlight={clickedNode} nodeClick={handleCircleClick}/>
  //             </div>
  //
  //
  //           </div>
  //         : <div>Data not loaded</div>
  //         }
  //       </div>
  //
  //     </div>
  //     {/* Bar selector, shows the barcharts for each timestep */}
  //     <BarSelector highlighted={timestep} clickFunction={handleBarClick} />
  //   </>
  // );
  return (
    <>
      <div className="grid grid-cols-3 grid-rows-8 gap-2">
        {/* Row 1 which contains the search bar, page buttons, and the settings icon */}
        <div className="col-span-3 row-span-1 bg-slate-200 hover:bg-slate-300 flex flex-row items-center">
          {/* Search component */}
          <Search/>
        </div>

        {/* Row 2 which contains the main nodal structure */}
        {data ?
          <div className="h-128 col-span-3 row-span-4 row-start-2 bg-slate-200 hover:bg-slate-300">
            {/* Graph component, shows the force directed graph */}
            {/*<div className='col-span-2'>*/}
              <Graph data={data} highlight={clickedNode} nodeClick={handleCircleClick}/>
            {/*</div>*/}
          </div>
        : <div>Data not loaded</div>
        }

        {/* Row 3 which contains the slider */}
        <div className="col-span-3 row-span-1 row-start-6 bg-slate-200 hover:bg-slate-300">
            <div className='flex flex-col items-center'>
              {/* Slider */}
              <div className='flex flex-row h-fit w-full mt-2 pt-2 border-t-2 border-black'>
                <button
                  onClick={(e) => {timestep > 1 && setTimestep(parseInt(timestep) - 1)}}
                  className='btn-primary'
                >
                  Decrease
                </button>
                <input
                  type="range"
                  min="1"
                  max="49"
                  onChange={(e) => handleChange(e.target.value)}
                  value={timestep}
                  className='flex-1'/>
                <button
                  onClick={(e) => {
                    timestep < 49 && setTimestep(parseInt(timestep) + 1)
                  }}
                  className="btn-primary"
                >
                  Increase
                </button>
              </div>
              <p>Timestep: {timestep}</p>
            </div>
        </div>

        {/* Dropdown */}
        {data ?
          <div className="row-span-2 row-start-7 bg-slate-200 hover:bg-slate-300">
            {/*<div className='flex flex-col mr-2 pl-2 border-l-2 border-dashed border-l-black'>*/}
              {/*<div className='grow py-2'>*/}
                {graph === 'Bar' && <BarWrapper timestep={timestep} />}
                {graph === 'Pie' && <Pie data={data.nodes} />}
              {/*</div>*/}
              <Select labelId="graph_type_label"
                id="graph_type"
                value={graph}
                onChange={handleGraph}
              >
                <MenuItem value={"Bar"}>Bar Graph</MenuItem>
                <MenuItem value={"Pie"}>Pie Chart</MenuItem>
              </Select>
            {/*</div>*/}
          </div>
        : <div>Data not loaded</div>
        }
        <div className="row-span-2 row-start-7 bg-slate-200 hover:bg-slate-300">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus orci ac auctor augue mauris. Nunc mattis enim ut tellus elementum sagittis vitae. Eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada. Quis ipsum suspendisse ultrices gravida. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Lacus suspendisse faucibus interdum posuere lorem. Vivamus at augue eget arcu dictum varius duis at consectetur. Luctus accumsan tortor posuere ac ut consequat semper viverra. Egestas quis ipsum suspendisse ultrices gravida dictum fusce ut. Arcu vitae elementum curabitur vitae. Elit eget gravida cum sociis natoque penatibus et magnis dis.

            Elit at imperdiet dui accumsan sit amet nulla facilisi morbi. Risus pretium quam vulputate dignissim. In eu mi bibendum neque egestas. Lectus nulla at volutpat diam ut venenatis tellus. In arcu cursus euismod quis viverra nibh cras. Pellentesque habitant morbi tristique senectus et netus et. Morbi tristique senectus et netus et malesuada. In hac habitasse platea dictumst quisque sagittis purus sit. Vel pretium lectus quam id leo in. Orci sagittis eu volutpat odio. Pretium vulputate</div>
        <div className="row-span-2 row-start-7 bg-slate-200 hover:bg-slate-300">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus orci ac auctor augue mauris. Nunc mattis enim ut tellus elementum sagittis vitae. Eleifend donec pretium vulputate sapien nec sagittis aliquam malesuada. Quis ipsum suspendisse ultrices gravida. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue. Lacus suspendisse faucibus interdum posuere lorem. Vivamus at augue eget arcu dictum varius duis at consectetur. Luctus accumsan tortor posuere ac ut consequat semper viverra. Egestas quis ipsum suspendisse ultrices gravida dictum fusce ut. Arcu vitae elementum curabitur vitae. Elit eget gravida cum sociis natoque penatibus et magnis dis.

            Elit at imperdiet dui accumsan sit amet nulla facilisi morbi. Risus pretium quam vulputate dignissim. In eu mi bibendum neque egestas. Lectus nulla at volutpat diam ut venenatis tellus. In arcu cursus euismod quis viverra nibh cras. Pellentesque habitant morbi tristique senectus et netus et. Morbi tristique senectus et netus et malesuada. In hac habitasse platea dictumst quisque sagittis purus sit. Vel pretium lectus quam id leo in. Orci sagittis eu volutpat odio. Pretium vulputate</div>
      </div>
    </>
  );
}

export default App;