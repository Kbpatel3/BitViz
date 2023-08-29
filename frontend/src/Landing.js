import React from 'react';
import nodes from "./nodes.jpg"
import {Button} from "@mui/material";
import {Link} from "react-router-dom";

export default function Landing() {
	const style = {
        /*This gets the image from the assets folder*/
        "background-image": `url(${nodes})`,
        "background-repeat": "no-repeat",
        "background-size": "cover",
        position: "absolute",
        height: "100%",
        width: "100%",
        backgroundColor: "#121212",
	color: "#FFFFFF",
	paddingTop: "10%",	
    }
	return (
		<div style={style}>
 			<div style={{fontSize: "100px", fontFamily: "Roboto, Helvetica, Arial, sans-serif", textAlign: "center"}}>
                		Node-View
            		</div>
            		{/*Tagline text*/}
            		<div style={{ fontSize: "40px", fontFamily: "Roboto, Helvetica, Arial, sans-serif", textAlign: "center"}}>
                		A tool for analyzing bitcoin transactions
            		</div>
			<br/>
			<div style={{marginLeft: "625px"}}>
				<Button component={Link} to="/app" variant="contained">Go to App</Button>
			</div>
		</div>
	);
}
