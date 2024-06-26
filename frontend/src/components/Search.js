/**
 * Search component for the application
 * @author Aidan Kirk
 * @author Kellan Anderson
 * @author Noah Hassett
 * @author Kaushal Patel
 */
import React, { useEffect, useState, useContext } from "react";
import { useReadCypher } from "use-neo4j";
import ObserverContext from "../context/ObserverContext";
import Dropdown from "./dropdown";

// !changed formats of the search bar
/**
 * Search component of the application
 * @returns A JSX element containing a search bar
 */
export default function Search({ timestep }) {
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
  const { run, records, loading, error } = useReadCypher(
    `MATCH (n {id: "${nodeId}"}), (n)<-[]->(b) WITH n as n, COLLECT(b.id) as edges RETURN ${key}`,
  );

  // Registers the function that should be called when an observer alert is called
  registerSubscriber((alertObject) => {
    // Check to make sure the alert is not coming from this function
    if (alertObject.source !== "search") {
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
    const query = 
    `MATCH (n {id: "${nodeId}"}), (n)-[]->(b) WITH n as n, COLLECT(b.id) as edges RETURN ${key}`;
    run({ query });
  }, [nodeId]);

  // Set the records/node data whenever the records from the database changes
  useEffect(() => {
    // Check to see of the data has been defined yet or not
    if (records !== undefined) {
      let newNode = records.length !== 0 ? records[0].get(key) : undefined;

      // Calls the alert function if the node has changed
      // needs to prevent refreshing the graph when node is clicked
      if (newNode !== undefined && parseInt(newNode.timestep) !== timestep) {
        alertSubscriber({
          id: newNode ? newNode.id : undefined,
          timestep: newNode ? newNode.timestep : undefined,
          source: "search",
        });
      }

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
    
    // prevents the graph from refreshing when node is clicked
    alertSubscriber({
      id: parseInt(formJson.id),
      timestep: formJson.timestep,
      source: "graph",
    });
  };

  /**
   * Defines the search results
   * @param nodeData The data for a searched node
   * @returns A JSX object to display the nodes information
   */
  const NodeMeta = ({ nodeData }) => {
    return (
      <>
        {/* Check to make sure the data has been defined */}
        {nodeData !== undefined ? (
          <ul className="grid grid-cols-4 items-center bg-slate-400 py-2 rounded-md">
            {/* Display the node id */}
            <li className="px-3 flex flex-row justify-center">
              <h2 className="font-semibold pr-1">Node id:</h2>
              {nodeData.id}
            </li>

            {/* Display the node timestep */}
            <li className="px-3 flex flex-row justify-center">
              <h2 className="font-semibold pr-1">Timestep:</h2>
              {nodeData.timestep}
            </li>

            {/* Display the node group */}
            <li className="px-3 flex flex-row justify-center">
              <h2 className="font-semibold pr-1">Group:</h2>
              {nodeData.group}
            </li>

            {/* Display the dropdown showing the edges */}
            <li className="px-3 flex flex-row justify-center">
              <Dropdown title={"Edges"} elements={nodeData.edges} />
            </li>
          </ul>
        ) : (
          <></>
        )}
      </>
    );
  };

  return (
    <>
    {/* Search */}
    <form onSubmit={handleSubmit} className={"mx-auto"}
      class="relative flex"
      data-twe-input-wrapper-init
      data-twe-input-group-ref>
      <input
        name="id"
        type="search"
        class="ml-3 rounded-md border-slate-600 rounded-md px-3 pb-[6px] pt-1 font-medium 
        leading-normal text-primary"
        placeholder="Search"
        aria-label="Search"
        id="exampleFormControlInput"
        aria-describedby="basic-addon1" />
      <button
        class="relative z-[2] -ms-0.5 flex items-center rounded-e bg-primary px-5  text-xs 
        font-medium uppercase leading-normal text-white shadow-primary-3 transition duration-150 
        ease-in-out hover:bg-primary-accent-300 hover:shadow-primary-2 focus:bg-primary-accent-300 
        focus:shadow-primary-2 focus:outline-none focus:ring-0 active:bg-primary-600 
        active:shadow-primary-2 dark:shadow-black/30 dark:hover:shadow-dark-strong 
        dark:focus:shadow-dark-strong dark:active:shadow-dark-strong"
        type="submit"
        id="button-addon1"
        className="btn-primary ml-1 my-auto rounded-full border-2 border-primary inline-block px-3 
        pb-[6px] pt-1 text-sm font-medium uppercase leading-normal text-primary transition 
        duration-150 ease-in-out hover:border-primary-accent-300 hover:bg-primary-50/50 
        hover:text-primary-accent-300 focus:border-primary-600 focus:bg-primary-50/50 
        focus:text-primary-300 focus:outline-none focus:ring-0 active:border-primary-700 
        active:text-primary-700 motion-reduce:transition-none dark:text-primary-500">
        <span class="[&>svg]:h-5 [&>svg]:w-5">
          <svg
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
        </span>
      </button>
    </form>
      {node ? (
        <NodeMeta nodeData={node} />
      ) : (
        <svg className="animate-spin h-5 w-5"></svg>
      )}
    </>
  );
}
