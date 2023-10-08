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
        className="absolute right-7 object-scale-down h-7 w-7"
        type="image"
        src={setting}
      />
    </>
  );
}
