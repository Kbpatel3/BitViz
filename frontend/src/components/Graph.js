/**
 * @author Aidan Kirk
 * @author Kellan Anderson
 * @author Noah Hassett
 * @author Kaushal Patel
 * D3 function for displaying a graph
 */

import useD3 from "../hooks/useD3";
import * as d3 from 'd3';
import getColor from "../helper/color";
import { useEffect } from "react";
import "./graph.css";

//! no changes

/**
 * Graph component for our app, takes data and uses a custom hook to render our graph to the screen
 * @param {*} Data The data for our graph to render
 * @param {*} highlight The node to highlight (Will be use in next semester)
 * @param {*} nodeClick The function to call when a node is clicked
 * @returns The graph component
 */
const Graph = ({data, highlight, nodeClick}) => {

  const ref = useD3(
    (svg) => {

      // Get the parent elements dimensions
      const dimensions = d3.select(".graphContainer").node().getBoundingClientRect();
      // Constants used by the SVG
      const height = dimensions.height;
      const width = dimensions.width;

      // Reset our graph in the case of a state change
      svg.selectAll("*").remove();

      // Add required aspects to the svg
      svg
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", `0 0 ${width} ${height}`)
        .attr("height", height)
        .attr("width", width);

      // Define how we would like our simulation to act
      const simulation = d3
          .forceSimulation(data.nodes)
          .force("link", d3.forceLink().id(d => d.id))
          .force("charge", d3.forceManyBody().strength(-1)) // the force that pushes nodes apart
          .force("center", d3.forceCenter(width / 2, height / 2));

        // Functions to define what happens when a user clicks on an app
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;

            // Remove the force you want to disable (e.g., charge)
            simulation.force("charge", null);
        }

        // Function to define what happens when a user drags a node
        function dragged(event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }

        // Function to define what happens when a user stops dragging a node
        function dragended(event) {
          if (!event.active) simulation.alphaTarget(0);
          event.subject.fx = null;
          event.subject.fy = null;

          // Add back the force when dragging ends
          //simulation.force("charge", d3.forceManyBody().strength(-1));
        }

        // Defines our links (edges) on the screen
        const link = svg
          .append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(data.links)
          .enter()
          .append("line")
          .attr("stroke-width", function(d) {
            return Math.sqrt(d.value);
          });

        // Defines our nodes on the screen
        const node = svg
          .append("g")
          .attr("class", "nodes")
          .selectAll("circle")
          .data(data.nodes)
          .enter()
          .append("circle")
          .attr("id", (d) => `node${d.id}`)
          .attr("r", 7)
          .attr("fill", (d) => getColor(d.group)) // Color the nodes based off of their group
          .call(
            d3
              .drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended)
          ).on('click', (d) => {
            nodeClick(parseInt(d.target.id.slice(4))); // update the id of the node clicked
          });

        // Adds titles to nodes
        node.append("title").text((d) => { return d.id; });

      // Defines the action for how nodes act over time
      const limitPosition = (value, direction) => {
        if (value < 0) return 0;
        else if(direction === "x") return value > width ? width : value;
        else if(direction === "y") return value > height ? height : value;
      }

      /**
       * Ticked function, defines what happens to the nodes as the simulation "ticks"
       */
      const ticked = () => {
        link
          .attr("x1", (d) => limitPosition(d.source.x, "x") )
          .attr("y1", (d) => limitPosition(d.source.y, "y") )
          .attr("x2", (d) => limitPosition(d.target.x, "x") )
          .attr("y2", (d) => limitPosition(d.target.y, "y") );

        node
          .attr("cx", (d) => limitPosition(d.x, "x") )
          .attr("cy", (d) => limitPosition(d.y, "y") );
      }

      // Add the ticked method, nodes and links to our simulation
      simulation
        .nodes(data.nodes)
        .on("tick", ticked);

      // Add the links
      simulation
        .force("link")
        .links(data.links);
    },
    [data] // the data to be watched for changes
  );

  // Call the clickNode function when the highlight changes
  useEffect(() => {
    // Call clickNode when highlight changes
    clickNode(highlight);
  }, [highlight]);

  // SVG Containing the graph
  return (
    <div className="graphContainer h-full w-full">
      <svg
      ref={ref}
      className="inline-block absolute">

      </svg>
    </div>
  );
}

export default Graph;

/**
 * Clicked node function, highlights a specific node based off of the id of each node
 * @param {*} id
 */
function clickNode(id) {
    d3.selectAll('circle').attr('fill', (d) => getColor(d.group)).attr('r', 7);
    d3.select(`#node${id}`)
      .transition()
      .duration(500)
      .attr('r', 12);
}
