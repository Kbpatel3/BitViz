/**
 * @author Adian Kirk
 * @author Kellan Anderson
 * Component to show what edges are connected to a specific node
 */
import React, { useState } from "react";

export default function Dropdown({title, elements}) {
  // Tracks if the dropdown has been clicked
  const [dropped, setDropped] = useState(false);

  return (
    <>
    <div className="relative inline-block text-left w-full">
      <div>
        {/* Button to set the dropped state */}
        <button 
          className="inline-flex w-full justify-center gap-x-1.5 rounded-lg bg-white px-3 py-2 text-sm font-semibold 
                   text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
          onClick={(e) => setDropped(!dropped)}
        >
          {/* Title of the dropdown */}
          {title}
          {/* Down arrow */}
          <svg className="-mr-1 h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 
            4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {/* Determine whether the dropdown should be shown or not absed off the dropped state */}
      <div className={`absolute right-0 w-full z-10 mt-2 origin-top-left rounded-md bg-white shadow-lg ring-1 
      ring-black focus:outline-none
        ${!dropped && 'hidden'}
      `}>
        <div className="py-1">
          {/* Maps over the elements passed to the dropdown and displays them */}
          {elements.map((element) => <p key={element} className="text-gray-700 block px-4 py-2 text-center text-sm">
            {element}
          </p>)}
        </div>
      </div>
    </div>
    </>
  );
}