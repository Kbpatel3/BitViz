/**
 * @author Adian Kirk
 * @author Kellan Anderson
 * Converts the data in a way that D3 can display it
 * 
 * @param data The data to convert
 * @returns Formatted data
 */
export default function convert(data) {
  // Init the return array
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