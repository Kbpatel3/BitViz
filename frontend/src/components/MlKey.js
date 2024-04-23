/**
 * Defines the Machine Learning Key Component
 * @author Noah Hassett
 * @author Kaushal Patel
 */


/**
 * Machine Learning Key Component
 * @fileoverview Machine Learning Key Component
 * @returns {JSX.Element} A JSX element containing the Machine Learning Key 
 */
export default function MlKey({ mlOn }) {
    return (
        <div className="justify-between pt-1 pl-2 font-medium uppercase leading-normal text-primary">
            {mlOn ? (
                <div>
                ML: <span class="text-shadow-lg text-violet-600">On</span>
                </div>
            ) : (
                <div>
                ML: Off
                </div>
            )}
        </div>
    );
}