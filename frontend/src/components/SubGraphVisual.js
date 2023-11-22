/**
 * SubGraphVisual component, used to generate the subgraph visual using D3
 * @author Kaushal Patel
 * @author Noah Hasset
 */

import useD3 from "../hooks/useD3";
import * as d3 from "d3";
import getColor from "../helper/color";
import "./graph.css";

/**
 * SubGraphVisual component, used to generate the subgraph visual using D3
 * @param data - data to be used to generate the graph
 * @param highlight - node to be highlighted
 * @returns {JSX.Element} - SubGraphVisual component
 * @constructor - SubGraphVisual
 */
const SubGraphVisual = ({ data, highlight}) => {
  // D3 reference
  const ref = useD3(
    (svg) => {
      // If there is no data, return
      if (!data) return;

      // Get the parent elements dimentions
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

      // Functions to define what happens when a user clicks on an app

      /**
       * Drag started function, defines what happens when a user starts to drag a node
       * @param event - event that triggered the function
       */
      function dragstarted(event) {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        event.subject.fx = event.subject.x;
        event.subject.fy = event.subject.y;
      }

      /**
       * Dragged function, defines what happens when a user drags a node
       * @param event - event that triggered the function
       */
      function dragged(event) {
        event.subject.fx = event.x;
        event.subject.fy = event.y;
      }

      /**
       * Drag ended function, defines what happens when a user stops dragging a node
       * @param event - event that triggered the function
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
        //.attr("id", (d) => clickedNode(d.id))
        .attr("id", (d) => `node${d.id}`)
        // .attr("r", 7)
        // //.attr("r", d => (d.id == highlight) ? 12 : 7)
        // .attr("fill", (d) => getColor(d.group))
        .call(
          d3
            .drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended),
        );

      
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
       * Ticked function, defines what happens to the nodes as the simulation "ticks"
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

      //node.each(clickNode);
      //clickNode(highlight);
      
      /**
       * Clicked node function, highlights a specific node based off of the id of each node
       * @param {*} id
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
    [highlight],
  );

  // SVG Containing the graph
  return (
    <div className="graphContainer h-full w-full">
      <svg ref={ref} className="inline-block absolute"></svg>
    </div>
  );
};

export default SubGraphVisual;

/**
 * Clicked node function, highlights a specific node based off of the id of each node
 * @param {*} id
 */
// function clickNode(id) {
//   console.log("Hello6: ", id);
//   //d3.selectAll('circle').attr('fill', (d) => getColor(d.group)).attr('r', 7);
//   d3.select(`#node${id}`)
//     .transition()
//     .duration(500)
//     .attr('r', 12);
// }

// function triggerClick(nodeId) {
//   d3.select(`#node${nodeId}`).dispatch("click");
// }

