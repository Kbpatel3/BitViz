/**
 * @author Adian Kirk
 * @author Kellan Anderson
 * Funtion to define the colors used in our application
 */

// Colors to use throughout the app 
var illicit = "rgb(184, 67, 4)"
var licit =   "rgb(44, 165, 104)"
var unknown = "rgb(128, 128, 128)"

/**
 * Matchs the group value of a node and returns the corect coloring
 * @param group The group of a node
 * @returns The corresponding color
 */
const getColor = (group) => {
    if (group == "1") return illicit;
    if (group == "2") return licit;
    if (group == "3") return unknown;

    // Default color
    return "rgb(255, 0, 255)";
}

/**
 * Sets the color for the illicit group
 * @param {string} color The RGB color to set
 */
const setIllicit = (color) => {
    illicit = color;
}

/**
 * Sets the color for the licit group
 * @param {string} color The RGB color to set
 */
const setLicit = (color) => {
    licit = color;
}

/**
 * Sets the color for the unknown group
 * @param {string} color The RGB color to set
 */
const setUnknown = (color) => {
    unknown = color;
}

/**
 * Sets the color for a group
 * @param {string} group The group to set the color for
 * @param {string} color The RGB color to set
 */
const setColor = (group, color) => {
    if (group == "1") illicit = color;
    if (group == "2") licit = color;
    if (group == "3") unknown = color;
}



// setColor("1", "rgb(184, 67, 4)")
// setColor("2", "rgb(44, 165, 104)")
// setColor("3", "rgb(128, 128, 128)")

export { getColor, setColor };