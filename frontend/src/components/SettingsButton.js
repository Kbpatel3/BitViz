/**
 * Defines a Settings Button Component
 * @author Noah Hassett
 * @author Kaushal Patel
 */

import setting from "../settings_icon.png";

/**
 * SettingsButton component for the application
 * @fileoverview SettingsButton component for the application
 * @returns {JSX.Element} A JSX element containing the SettingsButton
 */
export default function SettingsButton() {
  return (
    <>
      {/* Setting Button (Temp) */}
      <input
        className="mx-auto object-scale-down h-7 w-7"
        type="image"
        src={setting}
        title="Settings"
      />
    </>
  );
}
