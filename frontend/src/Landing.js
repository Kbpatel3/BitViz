/**
 * Landing.js
 *
 * This module defines the `Landing` component, which represents the landing page of
 * a React application. The landing page includes an image background, a title, a tagline,
 * and a button to navigate to another part of the application.
 *
 * @module Landing
 * @author Kellan Anderson
 * @author Aidan Kirk
 */

import React from 'react';
import nodes from "./media/nodes.jpg"	// Importing the background image for the landing page
import {Button} from "@mui/material";
import {Link} from "react-router-dom";

// !no changes but maybe good to remove this
/**
 * The 'Landing' component is a functional React component that renders the landing page of the 
 * application. It includes a background image, a title, a tagline, and a button to navigate to 
 * another part of the application.
 * @returns {JSX.Element} - The JSX element corresponding to the landing page of the application.
 * @constructor
 */
export default function Landing() {
	// Inline styling for the landing page elements
	const style = {
        /*This gets the image from the assets folder*/
        "background-image": `url(${nodes})`,
        "background-repeat": "no-repeat",
        "background-size": "cover",
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundColor: "#000000",
		color: "#ffa400",
		paddingTop: "10%",
    }
	return (
		<div style={style}>
			{/* Title */}
 			<div style={{fontSize: "100px", fontFamily: "Roboto, Helvetica, Arial, sans-serif", 
				textAlign: "center", backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                		Node-View
            		</div>
            		{/*Tagline text*/}
            		<div style={{ fontSize: "40px", 
						fontFamily: "Roboto, Helvetica, Arial, sans-serif", textAlign: "center", 
						backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                		A tool for analyzing bitcoin transactions
            		</div>
			<br/>
			{/* Button to navigate to the application */}
			<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
				<Button component={Link} to="/app" variant="contained" 
					style={{ width: "200px", height: "75px", fontSize:"20px" }}>Go to App</Button>
			</div>
		</div>
	);
}
