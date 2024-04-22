/**
 * Pie chart component for the application
 * @author Adian Kirk
 * @author Kellan Anderson
 * @author Noah Hasset
 * @author Kaushal Patel
 */
import useD3 from "../hooks/useD3";
import React from "react";
import * as d3 from 'd3';
import getColor from "../helper/color.js";

/**
 * Pie chart component for the application
 * @param Data The data to render the chart with
 * @returns A JSX component for a pie chart.
 */

// !modified line 29
const Pie = ({data}) => {
    const ref = useD3(
        (svg) => {
            
            // Set dimensions and margins
            const dimensions = d3.select(".pieTin").node().getBoundingClientRect();

            // Sets the height and widths as well as margins
            //const height = dimensions.height;
            const height = 270; // gets the constant height value depend on the window size
            const width = dimensions.width;
            const margin = 40

            // Adjust radius to fit inside react page
            const radius = Math.min(width, height) / 2 - margin

            // Sets the aspect ratio so that it is responsive
            svg
                .attr("preserveAspectRatio", "xMinYMin meet")
                .attr("viewBox", `0 0 ${width} ${height}`);

            // Sets a "skeleton" data object for D3 to render
            const ratioData = [
                {label: "illicit", value: 0, group: 1},
                {label: "licit", value: 0, group: 2},
                {label: "unknown", value: 0, group: 3},
            ]
            
            // Loop over the data passed and update the ratio data
            data.forEach(node => {
                if(node.group === "1") {
                    ratioData[0].value++;
                }
                else if(node.group === "2") {
                    ratioData[1].value++;
                }
                else {
                    ratioData[2].value++;
                }
            });

            // Clears the display
            svg.selectAll("*").remove();

            // Append svg object to the page divider
            svg
                .attr("width", width)
                .attr("height", height)
                .append("g")
                .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

            // Give each part of the pie a value
            var pieGen = d3.pie()
                .value(function(d) {return d.value; })
                .sort(function(a, b) { return d3.ascending(a.key, b.key);} )

            // Give the data a path
            var u = svg
                .selectAll("*")
                .selectAll("path")
                .data(pieGen(ratioData));

            // Create the pie chart
            u
                .enter()
                .append('path')
                .merge(u)
                .transition()
                .duration(1000)
                .attr('d', d3.arc()
                    .innerRadius(0)
                    .outerRadius(radius)
                )
                .attr('fill', (d) => {
                    return getColor(d.data.group);
                })
                .attr("stroke", "white")
                .style("stroke-width", "2px")
                .style("opacity", 1)

            // Remove any irrelevant groups
            u
                .exit()
                .remove()
            
                var arc = d3.arc()
                    .innerRadius(0)
                    .outerRadius(radius)
            const totalValueText = u
            .enter()
            .append('text')
            .text(d => d.value)
            .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")";  })
            .style("text-anchor", "middle")
            .style("font-family", "Roboto, sans-serif")
            .style("font-size", "17px")
            .style("display", "none");

             // Show the total value when hovering over the chart
             svg.on("mouseover", () => totalValueText.style("display", "block"));
             svg.on("mouseout", () => totalValueText.style("display", "none"));

        },
        [data]
    );

    // classname pieTin can be renamed to pie container
    return (
        <div className="pieTin h-full">
            <svg
                ref={ref}
                className="Pie">

            </svg>
        </div>
    );
}

export default Pie