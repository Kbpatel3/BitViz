import React, { useRef } from "react";
import timesteps from "../timesteps_icon.png";

/**
 * Button to scroll to the TimeSteps Charts when the button is clicked
 * @author Noah Hassett
 * @author Kaushal Patel
 * @param {*} scrollToRef The reference to the TimeSteps Charts
 * @fileoverview Button to scroll to the TimeSteps Charts when the button is clicked
 * @returns {JSX.Element} A JSX element containing the TimeSteps Button
 */
export default function ToHistogramButton({ scrollToRef}) {
  // Scrolls down to the TimeSteps Charts when the button is clicked
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