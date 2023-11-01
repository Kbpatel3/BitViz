import React, { useRef } from "react";

/**
 * Button to scroll to the TimeSteps Charts when the button is clicked
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
      <button className={"mx-auto"} onClick={(e) => goTimeSteps()}>
        TimeSteps
      </button>
    </>
  );
}