// Fetch data from the API
fetch(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((response) => response.json())
  .then((data) => {
    // Set up chart dimensions
    let margin = {
      top: 100,
      right: 20,
      bottom: 30,
      left: 60,
    };
    const width = 920 - margin.left - margin.right;
    const height = 630 - margin.top - margin.bottom;
    const color = d3.scaleOrdinal(d3.schemeCategory10);
    data.forEach((d) => {
      d.Place = +d.Place;
      var parsedTime = d.Time.split(":");
      d.Time = new Date(1970, 0, 1, 0, parsedTime[0], parsedTime[1]);
    });
    // div tooltip
    var div = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .attr("id", "tooltip")
      .style("opacity", 0);
    // Create SVG element
    const svg = d3
      .select("body")
      .append("svg")
      .attr("class", "graph")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Create scales
    const xScale = d3
      .scaleLinear()
      .domain([
        d3.min(data, (d) => d.Year) - 1,
        d3.max(data, (d) => d.Year) + 1,
      ])
      .range([0, width]);

    const timeFormat = d3.timeFormat("%M:%S");
    const yScale = d3
      .scaleTime()
      .domain(
        d3.extent(data, (d) => {
          return d.Time;
        })
      )
      .range([0, height]);

    // Create axes
    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
    const yAxis = d3.axisLeft(yScale).tickFormat(timeFormat);

    // Add axes to the chart
    svg
      .append("g")
      .attr("class", "x axis")
      .attr("id", "x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      .append("text")
      .attr("class", "x-axis-label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Year");

    svg
      .append("g")
      .attr("class", "y axis")
      .attr("id", "y-axis")
      .call(yAxis)
      .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Best Time (minutes)");
    svg
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -160)
      .attr("y", -44)
      .style("font-size", 18)
      .text("Time in Minutes");

    // Create scatter plot points
    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d) => yScale(d.Time))
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => d.Time.toISOString())
      .attr("fill", (d) => color(d.Doping !== ""))

      .on("mouseover", function (event, d) {
        div.style("opacity", 0.9);
        div.attr("data-year", d.Year);
        div
          .html(
            d.Name +
              ": " +
              d.Nationality +
              "<br/>" +
              "Year: " +
              d.Year +
              ", Time: " +
              timeFormat(d.Time) +
              (d.Doping ? "<br/><br/>" + d.Doping : "")
          )
          .style("left", event.pageX + "px")
          .style("top", event.pageY - 28 + "px");
      })
      .on("mouseout", function () {
        div.style("opacity", 0);
      })
      .attr("r", 6);
    // title
    svg
      .append("text")
      .attr("id", "title")
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 2)
      .attr("text-anchor", "middle")
      .style("font-size", "30px")
      .text("Doping in Professional Bicycle Racing");

    // subtitle
    svg
      .append("text")
      .attr("x", width / 2)
      .attr("y", 0 - margin.top / 2 + 25)
      .attr("text-anchor", "middle")
      .style("font-size", "20px")
      .text("35 Fastest times up Alpe d'Huez");
    var legendContainer = svg.append("g").attr("id", "legend");

    var legend = legendContainer
      .selectAll("#legend")
      .data(color.domain())
      .enter()
      .append("g")
      .attr("class", "legend-label")
      .attr("transform", function (d, i) {
        return "translate(0," + (height / 2 - i * 20) + ")";
      });

    legend
      .append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function (d) {
        if (d) {
          return "Riders with doping allegations";
        } else {
          return "No doping allegations";
        }
      });
  })
  .catch((error) => console.error("Error fetching data:", error));
