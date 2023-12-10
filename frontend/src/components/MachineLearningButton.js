/**
 * Defines a Machine Learning Button Component
 * @author Noah Hassett
 * @author Kaushal Patel
 */

import machineLearning from "../media/ML_icon.png";

/**
 * Machine Learning Button Component
 * @fileoverview Machine Learning Button Component
 * @returns {JSX.Element} A JSX element containing the Machine Learning Button
 */
export default function MachineLearningButton() {
  return (
    <>
    {/* Machine Learning Button (Temp)*/}
    <input
      className="mx-auto object-scale-down h-7 w-7"
      type="image"
      src={machineLearning}
      title="Machine Learning Analysis"
    />
  </>
  );
}
