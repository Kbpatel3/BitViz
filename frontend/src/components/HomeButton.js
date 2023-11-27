/**
 * Defines a Home Button Component
 * @author Noah Hassett
 * @author Kaushal Patel
 */

import home from "../home_icon.png";
/**
 * Home Button Component
 * @fileoverview Home Button Component
 * @returns {JSX.Element} A JSX element containing the Home Button
 */
export default function HomeButton() {
  // Refreshed the Window
  const refWindow = () => {
    window.location.reload();
  };

  return (
    <>
    {/* Home Button */}
    <input
      className="mx-auto object-scale-down h-7 w-7"
      type="image"
      src={home}
      title="Home (Refresh)"
      onClick={(e) => refWindow()}
    />
  </>
  );
}
