/**
 * Filters and formats data for visualization, extracting nodes and links from the input data.
 *
 * @module DataFilter
 * @param {Array} data - The raw data to be filtered and formatted.
 * @returns {Object} - Formatted data containing nodes and links suitable for visualization.
 */
const filterData = (data) => {

  // Initialize the node and link lists
  const node_list = [];
  const link_list = [];

  // Loop over each element in the data
  data.forEach(node => {
    // Add the source and target nodes to the node list
    if(!node_list.includes(node.source)) {
      node_list.push(node.source);
    }
    if(!node_list.includes(node.target)) {
      node_list.push(node.target);
    }

    // Add the source and target nodes to the link list
    link_list.push({source: node.source.id, target: node.target.id});
  });

  // Return the nodes in the right format
  return {nodes: node_list, links: link_list}
}

export default filterData