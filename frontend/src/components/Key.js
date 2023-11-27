/**
 * Defines a Graph Key Component
 * @author Noah Hassett
 * @author Kaushal Patel
 */

/**
 * Graph Key Component
 * @fileoverview Graph Key Component
 * @returns {JSX.Element} A JSX element containing the Graph Key
 */
export default function Key() {
  return (
  <div className="text-right">
    {/* Key */}
    <div className="flex items-center">
      <div className="w-4 h-4 rounded-full bg-illicit-yellow mr-2"></div>
      <p>Illicit</p>
    </div>
    <div className="flex items-center">
      <div className="w-4 h-4 rounded-full bg-licit-blue mr-2"></div>
      <p>Licit</p>
    </div>
    <div className="flex items-center">
      <div className="w-4 h-4 rounded-full bg-unknown-grey mr-2"></div>
      <p>Unknown</p>
    </div>
  </div>
);

}
