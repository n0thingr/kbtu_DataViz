async function buildPlot() {
    const data = await d3.json("my_weather_data.json");
    // console.table(data);

    var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 30,
            left: 30,
            bottom: 30,
            right: 30
        }
    };

    dimension.boundedWidth = dimension.width - dimension.margin.left - dimension.margin.right;
    dimension.boundedHeight = dimension.height - dimension.margin.top - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper");
    const svg = wrapper.append("svg")
    svg.attr("height",dimension.height);
    svg.attr("width",dimension.width);
    const bounded = svg.append("g");
    bounded.style("transform",`translate(${dimension.margin.left}px, ${dimension.margin.top})`);
    binPadding = 1;

    const xAxisGroup = bounded.append("g")
        .classed('axis', true)
        .style("transform", `translateY(${dimension.boundedHeight}px)`);

    const yAxisGroup = bounded.append("g")
        .classed('axis', true);

    const barsGroup = bounded.append("g").classed("bars", true);

    const meanLine = bounded.append("line");
    const meanLabel = bounded.append("text");

    function hist(option) {
        const xAccessor = (d) => d[option];
        const yAccessor = (d) => d.length;

        const xScaler = d3.scaleLinear()
            .domain(d3.extent(data, xAccessor))
            .range([0, dimension.boundedWidth])
            .nice();

        const bin = d3.bin()
            .domain(xScaler.domain())
            .value(xAccessor)
            .thresholds(10);

        const binnedData = bin(data);

        const yScaler = d3.scaleLinear()
            .domain([0, d3.max(binnedData, yAccessor)])
            .range([dimension.boundedHeight, 0])
            .nice();

        // Draw Bars
        barsGroup
            .selectAll("rect")
            .data(binnedData)
            .join("rect")
            .attr("width", (d) => d3.max([0, xScaler(d.x1) - xScaler(d.x0)]) - binPadding)
            .attr("height", (d) => dimension.boundedHeight - yScaler(yAccessor(d)))
            .attr("x", (d) => xScaler(d.x0) + binPadding/2)
            .attr("y", (d) => yScaler(yAccessor(d)))
            .attr('fill', "rgb(3, 132, 252)");

        const mean = d3.mean(data,xAccessor);

        meanLine
            .attr("x1", xScaler(mean))
            .attr("x2", xScaler(mean))
            .attr("y1", -15)
            .attr("y2", dimension.boundedHeight)
            .attr("stroke","black")
            .attr("stroke-dasharray","2px 4px");

        meanLabel
            .attr("x", xScaler(mean))
            .attr("y", 10)
            .text("Mean")
            .attr("fill","maroon")
            .attr("font-size","12px")
            .attr("text-anchor","middle");

        // Draw Axis
        xAxisGroup.call(d3.axisBottom(xScaler));
        yAxisGroup.call(d3.axisLeft(yScaler));
    }

    hist('temperatureMax')

    d3.selectAll("button").on("click", function(d) {
        hist(this.value)
    })

}

buildPlot();