/**
 * Button to scroll to the TimeSteps Charts when the button is clicked.
 *
 * @author Kaushal Patel
 * @author Noah Hassett
 */


// Imports
import React, { useRef } from "react";  // React
import timesteps from "../media/timesteps_icon.png";  // Icon for the button

// !new function
/**
 * Component for the TimeSteps Button.
 * 
 * @param {Object} props - React component properties.
 * @param {React.Ref} props.scrollToRef - The reference to the TimeSteps Charts.
 * @fileoverview Button to scroll to the TimeSteps Charts when the button is clicked.
 * @returns {JSX.Element} - A JSX element containing the TimeSteps Button.
 */
export default function ToHistogramButton({ scrollToRef}) {
  /**
   * Scrolls down to the TimeSteps Charts when the button is clicked.
   *
   * @function
   * @name goTimeSteps
   */
  const goTimeSteps = () => {
    scrollToRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
    {/* Button to shows the barcharts(histogram) for each timestep */}
    <input
      className="mx-auto object-scale-down h-7 w-7"
      type="image"
      src={timesteps}
      title="TimeSteps"
      onClick={(e) => goTimeSteps()}
    />
  </>
  );
}