/**
 * D3 function for displaying a slider
 * @author Aidan Kirk
 * @author Kellan Anderson
 * @author Kaushal Patel
 * @author Noah Hassett
 */

import React from 'react';


// !made own function for the slide and changed the format
/**
 * A slider component for the application.
 * @param {*} timestep The current timestep
 * @param {*} setTimestep The function to set the timestep
 * @param {*} handleChange The function to handle the change
 * @returns A JSX component for a slider
 */
function Slider({ timestep, setTimestep, handleChange}) {
    return (
        <>
            <div className={"flex items-center justify-center"}>
                <div className="flex justify-center w-screen">
                    {/* Slider */}
                    <button
                        onClick={(e) => {timestep > 1 && setTimestep(parseInt(timestep) - 1)}}
                        className='btn-primary'
                    >
                        Decrease
                    </button>
                    <input
                        type="range"
                        min="1"
                        max="49"
                        onChange={(e) => handleChange(e.target.value)}
                        value={timestep}
                        className='flex-1'
                    />
                    <button
                        onClick={(e) => { timestep < 49 && setTimestep(parseInt(timestep) + 1)}}
                        className="btn-primary"
                    >
                        Increase
                    </button>
                </div>
            </div>
            <div className="text-center">Timestep: {timestep}</div>
        </>
    )
}

export default Slider;