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
      {/* Home Button */}
      <HomeButton />

      {/* Button to shows the barcharts(histogram) for each timestep */}
      <ToHistogramButton scrollToRef={scrollToRef} />

      {/* Machine Learning Button (Temp)*/}
      <MachineLearningButton />

      {/* Search component */}
      <Search />

      {/* Setting Button (Temp) */}
      <SettingsButton />
    </>
  );
}
