/**
 * Function to define the colors used in our application
 * @author Adian Kirk
 * @author Kellan Anderson
 */

// Colors to use throughout the app 
const ILLICIT = "rgb(255,164,0)"
const LICIT =   "rgb(49,56,178)"
const UNKNOWN = "rgb(128, 128, 128)"

/**
 * Matchs the group value of a node and returns the corect coloring
 * @param group The group of a node
 * @returns The corresponding color
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

/**
 * Sets the color for the illicit group
 * @param {string} color The RGB color to set
 */
// const setIllicit = (color) => {
//     illicit = color;
// }

/**
 * Sets the color for the licit group
 * @param {string} color The RGB color to set
 */
// const setLicit = (color) => {
//     licit = color;
// }

/**
 * Sets the color for the unknown group
 * @param {string} color The RGB color to set
 */
// const setUnknown = (color) => {
//     unknown = color;
// }

/**
 * Sets the color for a group
 * @param {string} group The group to set the color for
 * @param {string} color The RGB color to set
 */
// const setColor = (group, color) => {
//     if (group === "1") illicit = color;
//     if (group === "2") licit = color;
//     if (group === "3") unknown = color;
// }



// setColor("1", "rgb(184, 67, 4)")
// setColor("2", "rgb(44, 165, 104)")
// setColor("3", "rgb(128, 128, 128)")

//export { getColor, setColor };
export default getColor;