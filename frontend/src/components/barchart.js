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
 * Defines the component for a barchart. Does not load data and it is required for it to be in a
 * container to render 
 * accurate data
 * @param data The data to render
 * @returns A barchart JSX component
 */
const Bar = ({ data, barMax, setBarMax }) => {
    console.log("Data: ", data)
    // Calls the useD3 hook to render the component
    const ref = useD3(
        (svg) => {
            // Define our margins
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

            const max = d3.max(data, d => d.value);
            if (max > barMax) {
                setBarMax(max);
            }
            
            // Set the Y axis
            const y_axis = d3
                .scaleLinear()
                .domain([0, barMax]) // changed the height to be adjust to
                // max bar height
                .range([height, 0]);
              
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
                .attr("y", (d) => y_axis(d.value))
                .attr("width", x_axis.bandwidth())
                .attr("height", d => height - y_axis(d.value))
                // Colors the bars according to the groups
                .attr("fill", (d) => getColor(d.group) );

            // Add the labels to the bars
            const totalValueText = svg
                .selectAll(".barchart")
                .data(data)
                .enter()
                .append("text")
                .attr("x", d => x_axis(d.group) + x_axis.bandwidth() / 2)
                .attr("y", d => height - 5)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .style("font-family", "Roboto, sans-serif")
                .style("font-size", "17px")
                .text(d => d.value)
                .style("display", "none");

            // Show the total value when hovering over the chart
            svg.on("mouseover", () => totalValueText.style("display", "block"));
            svg.on("mouseout", () => totalValueText.style("display", "none"));
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