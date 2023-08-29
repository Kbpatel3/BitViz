/**
 * @author Adian Kirk
 * @author Kellan Anderson
 * Funtion to define the colors used in our application
 */

// Colors to use throughout the app 
const ILLICIT = "rgb(184, 67, 4)"
const LICIT =   "rgb(255, 165, 0)"
const UNKNOWN = "rgb(60, 60, 250)"

/**
 * Matchs the group value of a node and returns the corect coloring
 * @param group The group of a node
 * @returns The corresponding color
 */
const getColor = (group) => {
    if (group == "1") return ILLICIT;
    if (group == "2") return LICIT;
    if (group == "3") return UNKNOWN;

    // Default color
    return "rgb(255, 0, 255)";
}

export default getColor;