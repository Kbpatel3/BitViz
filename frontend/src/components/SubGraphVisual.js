/**
 * SubGraphVisual component, used to generate the subgraph visual using D3.
 *
 * @module SubGraphVisual
 * @type {React.Component}
 * @param {Object} props - React component properties.
 * @param {Object} props.data - Data to be used to generate the graph.
 * @param {string} props.highlight - Node to be highlighted.
 * @param {Function} props.nodeClick - Function to be called when a node is clicked.
 * @returns {JSX.Element} - SubGraphVisual component.
 * @constructor - SubGraphVisual
 * @author Kaushal Patel
 * @author Noah Hassett
 */

// Imports
import useD3 from "../hooks/useD3"; // Custom hook to use D3
import * as d3 from "d3";        // D3
import getColor from "../helper/color"; // Helper function to get color based off of group
import "./graph.css";         // CSS for the graph

// !new function
/**
 * SubGraphVisual component, used to generate the subgraph visual using D3.
 *
 * @function
 * @name SubGraphVisual
 * @param {Object} props - React component properties.
 * @param {Object} props.data - Data to be used to generate the graph.
 * @param {string} props.highlight - Node to be highlighted.
 * @param {Function} props.nodeClick - Function to be called when a node is clicked.
 * @returns {JSX.Element} - SubGraphVisual component.
 */
const SubGraphVisual = ({ data, highlight, nodeClick }) => {
  // D3 reference
  const ref = useD3(
    (svg) => {
      // If there is no data, return
      if (!data) return;

      // Get the parent element's dimensions
      const dimensions = d3.select(".subgraph").node().getBoundingClientRect();

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
        .force(
          "link",
          d3.forceLink().id((d) => d.id),
        )
        .force("charge", d3.forceManyBody().strength(-1))
        .force("center", d3.forceCenter(width / 2, height / 2));

      // Functions to define what happens when a user clicks on a node

      /**
       * Drag started function, defines what happens when a user starts to drag a node.
       *
       * @function
       * @name dragstarted
       * @param {Object} event - Event that triggered the function.
       */
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      /**
       * Dragged function, defines what happens when a user drags a node.
       *
       * @function
       * @name dragged
       * @param {Object} event - Event that triggered the function.
       */
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      /**
       * Drag ended function, defines what happens when a user stops dragging a node.
       *
       * @function
       * @name dragended
       * @param {Object} event - Event that triggered the function.
       */
      function dragended(event) {
        if (!event.active) simulation.alphaTarget(0);
        event.subject.fx = null;
        event.subject.fy = null;
      }

      // Defines our links (edges) on the screen
      const link = svg
        .append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(data.links)
        .enter()
        .append("line")
        .attr("stroke-width", function (d) {
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
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended),
        )

      
      // Adds titles to nodes
      node.append("title").text((d) => {
        return d.id;
      });

      // Defines the action for how nodes act over time
      const limitPosition = (value, direction) => {
        if (value < 0) return 0;
        else if (direction === "x") return value > width ? width : value;
        else if (direction === "y") return value > height ? height : value;
      };

      /**
       * Ticked function, defines what happens to the nodes as the simulation "ticks".
       *
       * @function
       * @name ticked
       */
      const ticked = () => {
        link
          .attr("x1", (d) => limitPosition(d.source.x, "x"))
          .attr("y1", (d) => limitPosition(d.source.y, "y"))
          .attr("x2", (d) => limitPosition(d.target.x, "x"))
          .attr("y2", (d) => limitPosition(d.target.y, "y"));

        node
          .attr("cx", (d) => limitPosition(d.x, "x"))
          .attr("cy", (d) => limitPosition(d.y, "y"));
      };

      // Add the ticked method, nodes and links to our simulation
      simulation.nodes(data.nodes).on("tick", ticked);
      simulation.force("link").links(data.links);

      
      /**
       * Clicked node function, highlights a specific node based on the id of each node.
       *
       * @function
       * @name clickNode
       * @param {string} id - Node id.
       */
      function clickNode(id) {
          d3.selectAll('circle').attr('fill', (d) => getColor(d.group)).attr('r', 7);
          svg.select(`#node${id}`) // highlighting the node that was clicked
            .transition()
            .duration(500)
            .attr('r', 12);
      }

      clickNode(highlight);

    },
    // the data to be watched for changes
    [data],
  );

  // SVG Containing the graph
  return (
    <div className="graphContainer h-full w-full">
      <svg ref={ref} className="inline-block absolute"></svg>
    </div>
  );
};

export default SubGraphVisual;

