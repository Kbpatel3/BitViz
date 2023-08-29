const filterData = (data) => {
  // Build the node list
  var node_list = [];
  var link_list = [];
  data.forEach(node => {
    // Add to the node list
    if(!node_list.includes(node.source)) {
      node_list.push(node.source);
    }
    if(!node_list.includes(node.target)) {
      node_list.push(node.target);
    }

    // Add to the link list
    link_list.push({source: node.source.id, target: node.target.id});
  });

  // Return the nodes in the right format
  return {nodes: node_list, links: link_list}
}

export default filterData