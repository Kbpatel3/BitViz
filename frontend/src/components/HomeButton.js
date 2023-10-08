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
      <button className={"mx-auto"} onClick={(e) => refWindow()}>
        Home
      </button>
    </>
  );
}
