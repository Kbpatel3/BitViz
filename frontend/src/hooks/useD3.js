/**
 * useD3.js
 *
 * File used to create a custom hook to render our graph
 *
 * @author Kellan Anderson
 * @author Aidan Kirk
 * @author Kaushal Patel
 * @author Noah Hassett
 */

// Imports
import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

// !added comments
/**
 * Custom hook for integrating D3.js to render graphs in a React component.
 *
 * @module useD3
 * @param {Function} renderGraph - Callback function responsible for rendering the graph using D3.
 * @param {Array} dependencies - Dependencies that trigger graph rendering when changed.
 * @returns {Object} Reference object pointing to the DOM element where the graph is rendered.
 */
const useD3 = (renderGraph, dependencies) => {
    // Create a reference to the DOM element where the graph is rendered
    const ref = useRef();

    /**
     * Effect hook to render or update the graph using D3 when dependencies change.
     * Invokes the provided `renderGraph` callback with a D3 selection of the DOM element.
    */
    useEffect(() => {
        renderGraph(d3.select(ref.current));

        // Cleanup function to remove the graph when the component unmounts
        return () => {};
    }, dependencies);

    // Return the reference to the DOM element where the graph is rendered
    return ref;
}

export default useD3;