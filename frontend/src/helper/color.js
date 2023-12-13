/**
 * Function to define the colors used in our application
 * @module helper/color
 * @author Kellan Anderson
 * @author Aidan Kirk
 * @author Kaushal Patel
 * @author Noah Hassett
 */

// Colors to use throughout the app 
const ILLICIT = "rgb(255,164,0)"
const LICIT =   "rgb(49,56,178)"
const UNKNOWN = "rgb(128, 128, 128)"

// !changed color
/**
 * Matches the group value of a node and returns the correct coloring.
 *
 * @function
 * @name getColor
 * @param {string} group - The group of a node.
 * @returns {string} - The corresponding color.
 */
const getColor = (group) => {
    if (group == "1") {
        //console.log(ILLICIT);
        return ILLICIT;
    }
    if (group == "2") {
        //console.log(LICIT);
        return LICIT;
    }
    if (group == "3") {
        //console.log(UNKNOWN);
        return UNKNOWN;
    }

    // Default color
    return "rgb(0,0,0)";
}

// Exporting the getColor function as the default export for external use
export default getColor;