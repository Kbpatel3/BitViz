/**
 * @author Adian Kirk
 * @author Kellan Anderson
 * Search component for the application
 */
import React, { useEffect, useState, useContext } from 'react';
import { useReadCypher } from "use-neo4j"
import ObserverContext from '../context/ObserverContext';
import Dropdown from './dropdown';

/**
 * Search component of the application
 * @returns A JSX element containing a search bar
 */
export default function Search() {
  // Node and node id that is being searched for 
  const [nodeId, setNodeId] = useState(0);
  const [node, setNode] = useState(undefined);

  // Data defined by the use-neo4j hook
  const [nodeLoading, setNodeLoading] = useState(true);
  const [queryError, setQueryError] = useState(false);
  const [dbRecords, setDbRecords] = useState(undefined);

  // Gets the register and notify functions from the observer context
  const { registerSubscriber, alertSubscriber } = useContext(ObserverContext);

  
  // Sets the key
  const key = "{id: n.id, timestep: n.timestep, group: n.group, edges: edges}";
  
  // Requests data from the database with the specified query
  const {run, records, loading, error} = useReadCypher(
    `MATCH (n {id: "${nodeId}"}), (n)<-[]->(b) WITH n as n, COLLECT(b.id) as edges RETURN ${key}`
  );
    
  // Registers the function that should be called when an observer alert is called
  registerSubscriber((alertObject) => {
    // Check to make sure the alert is not coming from this function
    if(alertObject.source !== "search") {
      // Get the id and set the ID state
      const id = alertObject.id;
      setNodeId(id);
    }
  });

  // Set the loading icon
  useEffect(() => {
    setNodeLoading(loading);
  }, [loading]);

  // Set the error status
  useEffect(() => {
    setQueryError(error);
  }, [error]);

  
  // Re-run the query with the specified query whenever the nodeID changes
  useEffect(() => {
    const query = `MATCH (n {id: "${nodeId}"}), (n)-[]->(b) WITH n as n, COLLECT(b.id) as edges RETURN ${key}`;
    run({query});

  }, [nodeId]);
  
  // Set the records/node data whenever the records from the database changes
  useEffect(() => {
    // Check to see of the data has been defined yet or not
    if(records !== undefined) {      
      let newNode = records.length !== 0 ? records[0].get(key) : undefined;

      // Calls the alert function 
      alertSubscriber({
        id: newNode ? newNode.id : undefined,
        timestep: newNode ? newNode.timestep : undefined,
        source: "search"
      });

      // Sets the node state
      setNode(newNode);
    }
  }, [records]);

  /**
   * Function to run whenever the an item has been clicked
   * @param e The form submit event object
   */
  const handleSubmit = (e) => {
    // Prevent the page from being reloaded
    e.preventDefault();
    // Get the event target
    const form = e.target;
    // Get the formdata and converts it to a JSON object
    const formData = new FormData(form);
    const formJson = Object.fromEntries(formData.entries());

    // Sets the node it from the form
    setNodeId(formJson.id);
  }

  /**
   * Defines the search results
   * @param nodeData The data for a searched node
   * @returns A JSX object to display the nodes information
   */
  const NodeMeta = ({nodeData}) => {
    return (
      <>
        {/* Check to make sure the data has been defined */}
        {nodeData !== undefined ? 
          (<ul className='grid grid-cols-4 items-center bg-slate-400 py-2 rounded-md'>
            {/* Display the node id */}
            <li className='px-3 flex flex-row justify-center'>
              <h2 className='font-semibold pr-1'>
                Node id:
              </h2>
              {nodeData.id}
            </li>
            
            {/* Display the node timestep */}
            <li className='px-3 flex flex-row justify-center'>
              <h2 className='font-semibold pr-1'>
                Timestep:
              </h2>
               {nodeData.timestep}
            </li>
            
            {/* Display the node group */}
            <li className='px-3 flex flex-row justify-center'>
              <h2 className='font-semibold pr-1'>
                Group:
              </h2>
              {nodeData.group}
            </li>

            {/* Display the dropdown showing the edges */}
            <li className='px-3 flex flex-row justify-center'>
               <Dropdown title={'Edges'} elements={nodeData.edges} />
            </li>
          </ul>
          ) : <></>
        }
      </>
    );
  }

  return (
    <>
      <div className='grid grid-rows-2'>
        <form onSubmit={handleSubmit} className='flex justify-center mb-2'>
          <input name="id" type="text" className='border-2 border-slate-600 rounded-md pl-1 h-fit'/>
          <button type='submit' className='btn-primary ml-1'>Search</button>
        </form>
        {node ? <NodeMeta nodeData={node} /> : <svg className='animate-spin h-5 w-5'></svg> }
      </div>
    </>
  );
}