/**
 * Defines a NavBar Component
 * @author Noah Hassett
 * @author Kaushal Patel
 */

import Search from "./Search";
import SettingsButton from "./SettingsButton";
import MachineLearningButton from "./MachineLearningButton";
import ToHistogramButton from "./ToHistogramButton";
import HomeButton from "./HomeButton";
import FilterGraphButton from "./FilterGraphButton";

// !new function
/**
 * NavBar component for the application
 * @fileoverview NavBar component for the application
 * @returns {JSX.Element} A JSX element containing the NavBar
 */
export default function NavBar({ scrollToRef, timestep, handleGraphSwitch, setBarMax, setMl }) {
  return (
    <>
      <div className={"flex justify-between items-center w-full h-full"}>
        {/* Left side of the NavBar for Home, TimeStep, and Analyze buttons */}
        <div className={"flex space-x-4 ml-2"}>
          {/* Home Button */}
          <HomeButton />

          {/* Button to shows the barcharts(histogram) for each timestep */}
          <ToHistogramButton scrollToRef={scrollToRef} />

          {/* Machine Learning Button (Temp)*/}
          <MachineLearningButton handleGraphSwitch={handleGraphSwitch} setBarMax={setBarMax} 
                                setMl={setMl}/>

          {/* Filter Graph Button */}
          <FilterGraphButton handleGraphSwitch={handleGraphSwitch} setBarMax={setBarMax}/>
        </div>

        {/* Search component */}
        <div className={"flex items-center mr-32"}>
          <Search timestep={timestep}/>
        </div>

        {/* Setting Button (Temp) */}
        <div className={"mt-2 mr-2"}>
          <SettingsButton />
        </div>
      </div>
    </>
  );
}
