// /**
//  * @author Noah Hassett
//  * @author Kaushal Patel
//  * Search component for the application
//  */
import { useEffect} from 'react';
import useD3 from "../hooks/useD3";
import * as d3 from 'd3';
import getColor from "../helper/color";
import "./graph.css";
import { useReadCypher } from 'use-neo4j';


/**
 * Graph component for our app, takes data and uses a custom hook to render our graph to the screen
 * @param {*} Data The data for our graph to render
 * @returns The graph component
 */
const SubGraph = ({clickedNode, nodeClick}) => {
  console.log("Hello: " + clickedNode);
  // Constants used for talking to the database
  const key = "{nodes: nodes, links: links}";

  // const getSubQuery = (v) => {
  //   const query = `MATCH path = (n {id: "${v}"})-[*]-(m) ` +
  //                 "WHERE id(n) <> id(m) " +
  //                 "WITH nodes(path) AS nodes_in_path " +
  //                 "WITH nodes_in_path[size(nodes_in_path) - 2..] AS last_two_nodes " +
  //                 "WITH COLLECT({source: last_two_nodes[0].id, target: last_two_nodes[1].id}) AS links, " +
  //                 "RETURN links";
  //                 // `COLLECT(DISTINCT {id:last_two_nodes[0].id, group:last_two_nodes[0].group}) \+ ` +
  //                 // `COLLECT(DISTINCT {id:last_two_nodes[1].id, group:last_two_nodes[1].group}) as nodes ` +
  //                 // `RETURN ${key}`
    
  //   return query;
  // };

  // for testing purposes
  // const getSubQuery = (v) => {
  //   const query = `match (n:Transaction {timestep: "${v}"}), ` +
  //                 `(a:Transaction {timestep: "${v}"})-[]->(b:Transaction {timestep: "${v}"}) ` +
  //                 "WITH COLLECT(DISTINCT {id: n.id, group: n.group}) as nodes, " + 
  //                 `COLLECT(DISTINCT {source: a.id, target: b.id}) as links RETURN ${key}`;
    
  //   return query;
  // };

  let query = getSubQuery(clickedNode);

  const {records, run} = useReadCypher(query);  
  
  useEffect(() => {
    query = getSubQuery(nodeClick);
    run({query});
  }, [clickedNode]);

  let data = undefined;

  if(records === undefined) {
    console.log("Hello1");

    console.log("Records is undefined");
  }
  else {
    // If the data has finished retreiving from the database, assign it to the data variable
    console.log("Hello2");
    data = records[0].get(key);
    console.log("Data: " + data);
    console.log("Hello3");
  }
  const ref = useD3(
    (svg) => {

      // Get the parent elements dimentions
      const dimensions = d3.select(".subgraphContainer").node().getBoundingClientRect();

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
          .force("charge", d3.forceManyBody().strength(-1))
          .force("center", d3.forceCenter(width / 2, height / 2));
        
        // Functions to define what happens when a user clicks on an app
        
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }
      
        function dragged(event) {
          event.subject.fx = event.x;
          event.subject.fy = event.y;
        }
      
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
          .attr("fill", (d) => getColor(d.group))
          .call(
            d3
              .drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended)
          ).on('click', (d) => {
            nodeClick(parseInt(d.target.id.slice(4)));
            d3.selectAll('circle').attr('fill', (d) => getColor(d.group)).attr('r', 7);
            d3.select(`#${d.target.id}`).attr('fill', (d) => getColor(d.group)).attr('r', 12);
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

      simulation
        .force("link")
        .links(data.links);
      
      // Calls the clicked node funciton with the specified highlighted node
      clickNode(clickedNode);
    },
    // the data to be watched for changes
    [data]
  );

  // SVG Containing the graph
  return (
    <div className="subgraphContainer h-full w-full">
      <svg
      ref={ref}
      className="inline-block absolute">

      </svg>
    </div>
  );
}

export default SubGraph;

/**
 * Clicked node function, highlights a specific node based off of the id of each node
 * @param {*} id 
 */
function clickNode(id) {
  // Resets all the nodes in the graph and set them to the correct size and color
  d3.selectAll('circle').attr('fill', (d) => getColor(d.group)).attr('r', 7);
  // Sets the node with a given ID with a bigger radius and colors it magenta so it stands out
  // if(id) {
  //   d3.select(`#node${id}`).attr('fill', 'rgb(0,0,0)').attr('r', 9);
  // }
}