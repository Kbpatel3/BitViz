import { useEffect, useRef } from 'react';
import * as d3 from 'd3';


/**
 * Custom hook used to render our graph
 * @param {*} renderGraph Callback function to render the graph
 * @param {*} dependancies Any dependancys the graph relies on
 * @returns 
 */
const useD3 = (renderGraph, dependancies) => {
    const ref = useRef();

    useEffect(() => {
        renderGraph(d3.select(ref.current));
        return () => {};
    }, dependancies);

    return ref;
}

export default useD3;