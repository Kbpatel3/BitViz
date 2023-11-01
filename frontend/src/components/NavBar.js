import Search from "./Search";
import SettingsButton from "./SettingsButton";
import MachineLearningButton from "./MachineLearningButton";
import ToHistogramButton from "./ToHistogramButton";
import HomeButton from "./HomeButton";

/**
 * NavBar component for the application
 * @fileoverview NavBar component for the application
 * @returns {JSX.Element} A JSX element containing the NavBar
 */
export default function NavBar({ scrollToRef }) {
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
          <MachineLearningButton />
        </div>

        {/* Search component */}
        <div className={"flex items-center mr-32"}>
          <Search />
        </div>

        {/* Setting Button (Temp) */}
        <div className={"mt-2 mr-2"}>
          <SettingsButton />
        </div>
      </div>
    </>
  );
}
