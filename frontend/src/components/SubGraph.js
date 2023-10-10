import { useReadCypher } from "use-neo4j";
import { useEffect, useState } from "react";
import SubGraphVisual from "./SubGraphVisual";

export default function SubGraph({ clickedNode }) {
  const key = "{nodes: nodes, links: links}";

  const getQuery = (v) => {
    const query = `MATCH path = (n {id: "${v}"})-[*]-(m)
     WHERE id(n) <> id(m)
     WITH nodes(path) AS nodes_in_path
     WITH nodes_in_path[size(nodes_in_path) - 2..] AS last_two_nodes
     WITH COLLECT({source: last_two_nodes[0].id, target: last_two_nodes[1].id}) AS links,
          COLLECT(DISTINCT {id:last_two_nodes[0].id, group:last_two_nodes[0].group}) +
          COLLECT(DISTINCT {id:last_two_nodes[1].id, group:last_two_nodes[1].group}) as nodes
     RETURN {nodes: nodes, links: links}`;
    return query;
  };

  let query = getQuery(clickedNode);

  const { loading, error, records, run } = useReadCypher(query);

  useEffect(() => {
    query = getQuery(clickedNode);
    run({ query });
    if (loading) console.log("Loading");
    if (error) console.log("Error");
  }, [clickedNode]);

  let data = undefined;

  if (records === undefined) {
    console.log("Records is undefined");
  } else {
    data = records[0].get(key);
    console.log(data);
  }

  return (
    <div>
      {data ? (
        <div>
          <h2>Nodes</h2>
          <ul>
            {data.nodes.map((node) => (
              <li key={node.id}>
                ID: {node.id}, Group: {node.group}
              </li>
            ))}
          </ul>

          <h2>Links</h2>
          <ul>
            {data.links.map((link, index) => (
              <li key={index}>
                Source: {link.source}, Target: {link.target}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
}
