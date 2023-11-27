/**
 * D3 function for displaying a barchart
 * @author Aidan Kirk
 * @author Kellan Anderson
 * @author Noah Hassett
 * @author Kaushal Patel
 */
import React from "react";
import useD3 from "../hooks/useD3";
import * as d3 from 'd3';
import getColor from "../helper/color";

/**
 * Defines the componet for a barchart. Does not load data and it is required for it to be in a 
 * container to render 
 * accurate data
 * @param data The data to render
 * @returns A barchart JSX component
 */
const Bar = ({ data }) => {
    // Calls the useD3 hook to render the component
    const ref = useD3(
        (svg) => {
            // DEfine our margins
            const margin = {top: 30, right: 30, bottom: 70, left: 60};

            // Get the wrapping containers size
            const dimensions = d3.select(".bar-container").node().getBoundingClientRect();
            // Constants used by the SVG
            const height = dimensions.height;
            const width = dimensions.width;

            // Clear the display
            svg.selectAll("*").remove();

            // Set the barcharts width, height and position
            svg
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", 
                      `translate(${margin.left},${margin.top})`
                );

            // Set the X axis
            const x_axis = d3
                .scaleBand()
                .range([0, width])
                .domain(data.map(d => d.group))
            
            // Apply the x axis to the svg
            svg
                .selectAll("path")
                .append("g")
                .attr("transform", `translate(0, ${height})`)
                .call(d3.axisBottom(x_axis))
                .selectAll("text")
                .attr("transform", "translate(-10,0) rotate(-45)")
                .style("text-anchor", "end");
            
            // Set the Y axis
            const y_axis = d3
                .scaleLinear()
                .domain([0, 50])
                .range([0, height]);
              
            // Apply the y axis to the svg
            svg
                .selectAll("path")
                .append("g")
                .call(d3.axisLeft(y_axis));
               
            // Set the bars and apply it to the svg
            svg
                .selectAll(".barchart")
                .data(data)
                .enter()
                .append("rect")
                .attr("x", d => x_axis(d.group))
                .attr("y", (d) => height - y_axis(d.value))
                .attr("width", x_axis.bandwidth())
                .attr("height", (d) => {
                    console.log(d.value)
                    return y_axis(d.value);
                    // d.value / height = ratio (d.value / ratio)
                })
                // Colors the bars according to the groups
                .attr("fill", (d) => getColor(d.group) );
        },
        // Data to watch for a change
        [data]
    )
    
    return (
        <div className="bar-container">
            {/* SVG to render the chart in */}
            <svg
                ref={ref}
                className="barchart"
            ></svg>
        </div>
    );
}

export default Bar;