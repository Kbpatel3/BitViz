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
        backgroundColor: "#000000",
	color: "#ffa400",
	paddingTop: "10%",
    }
	return (
		<div style={style}>
 			<div style={{fontSize: "100px", fontFamily: "Roboto, Helvetica, Arial, sans-serif", textAlign: "center", backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                		Node-View
            		</div>
            		{/*Tagline text*/}
            		<div style={{ fontSize: "40px", fontFamily: "Roboto, Helvetica, Arial, sans-serif", textAlign: "center", backgroundColor: "rgba(0, 0, 0, 0.5)"}}>
                		A tool for analyzing bitcoin transactions
            		</div>
			<br/>
			<div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
				<Button component={Link} to="/app" variant="contained" style={{ width: "200px", height: "75px", fontSize:"20px" }}>Go to App</Button>
			</div>
		</div>
	);
}
