/**
 * Observer context for the application, managing subscribers and notifications.
 *
 * @module ObserverContext
 * @constant
 * @type {React.Context}
 * @see {@link https://reactjs.org/docs/context.html} for more on React Context
 * @author Kellan Anderson
 * @author Aidan Kirk
 * @author Kaushal Patel
 * @author Noah Hassett
 */

// Import the context API and useRef hook
import React, { createContext, useRef } from "react";

// Create and export our context
const ObserverContext = createContext();
export default ObserverContext;

/**
 * Provider for the context API, holding the array of callback functions and necessary functions required to register
 * and notify a subscriber.
 *
 * @function
 * @name ObserverProvider
 * @param {Object} props - React component properties.
 * @param {React.ReactNode} props.children - The children to render inside of the context.
 * @returns {React.Component} - A context API provider component.
 */
export function ObserverProvider({children}) {  
  
  // Initialize the callbacks array. Uses React's useRef hook since when we change data it does not cause a re-render
  const observerCallbacks = useRef([]);

  /**
   * Adds a callback function to the list of subscribers to notify.
   * @function
   * @name registerSubscriber
   * @param {Function} callback - The function to be run when the subscriber is notified.
   */
  const registerSubscriber = (callback) => {
    // Adds the callback function to the list of subscribers
    observerCallbacks.current = [...observerCallbacks.current, callback];
  }

  /**
   * Calls each callback function registered in the subscriber list.
   * @function
   * @name alertSubscriber
   * @param {Object} alertObject - Object to call the callback functions with.
   */
  const alertSubscriber = (alertObject) => {
    // Loop over the functions that have been subscribed with
    observerCallbacks.current.forEach((callback) => {
      // Call the callback
      callback(alertObject);
    });
  }

  // Assign the functions to an object to be destructured
  const contextFunctions = {
    registerSubscriber,
    alertSubscriber,
  }

  // Return the provider for the observer context
  return (
    <ObserverContext.Provider value={contextFunctions} >
      {children}
    </ObserverContext.Provider>
  );
}

/*
Context uses a useRef hook to store an array of callbacks that is consistent between re-renders.

Graph:
  Register:
    The graph register callback should traverse to a new timestep, clear any highlighted nodes and highlight a new node.
    Register can expect to take a node object with the nodes id and timestep.
  Alert:
    Alert should be called when a user clicks on a node on the graph. The alert function should be passed a nodes id

Search:
  Register:
    The search component should take a single number representing an ID and call a search function. After the search 
    function returns we should display the data and call the alert function. ISSUE: calling the alert function inside of
    the registered callback means that the callback will become recursive. FIX: Pass an optional value that declares
    where the value comes from (i.e. {source:"search"}) and check for that in the registered callback; 
  Alert:
    Pass the found nodes timestep and node id

The register function should take an object as an argument in the following type:
{
  id: number,
  timestep: number,
  source?: string
}
*/