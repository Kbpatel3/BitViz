/**
 * Converts raw data into a format suitable for D3 visualization.
 *
 * @module DataConverter
 * @function
 * @param {Array} data - The raw data to be converted.
 * @returns {Array} rtn - Formatted data suitable for D3 visualization.
 * @author Kellan Anderson
 * @author Aidan Kirk
 * @author Kaushal Patel
 * @author Noah Hassett
 */
export default function convert(data) {
  // Initialize the return array
  const rtn = [];

  // Loop over each element in data
  data.forEach((d) => {
    // Push a formatted object to the return array
    rtn.push({
      timestep: d.timestep,
      groups: [
        {label: "illicit", value: d.illicit.low, group: 1},
        {label: "licit",   value: d.licit.low,   group: 2},
        {label: "unknown", value: d.unknown.low, group: 3},
      ]
    })
  });
  // Return the formatted data
  return rtn;
}