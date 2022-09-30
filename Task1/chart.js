async function buildPlot() {
    console.log("Hello world");
    const data = await d3.json("my_weather_data.json");
    //console.table(data);
    const dateParser = d3.timeParse("%Y-%m-%d");
    const yAccessor = (d) => d.temperatureMin;
    const yAccessor2 = (d) => d.temperatureMax;
    const xAccessor = (d) => dateParser(d.date);
    // Функции для инкапсуляции доступа к колонкам набора данных

    var dimension = {
        width: window.innerWidth*0.9,
        height: 400,
        margin: {
            top: 15,
            left: 15,
            bottom: 15,
            right: 15
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

    const yScaler = d3.scaleLinear()
        .domain(d3.extent(data,yAccessor))
        .range([dimension.boundedHeight,0]);

    const yScaler2 = d3.scaleLinear()
        .domain(d3.extent(data,yAccessor2))
        .range([dimension.boundedHeight,0]);

    const xScaler = d3.scaleTime()
        .domain(d3.extent(data,xAccessor))
        .range([0,dimension.boundedWidth]);

    var lineGenerator = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler(yAccessor(d)));

    var lineGenerator2 = d3.line()
        .x(d => xScaler(xAccessor(d)))
        .y(d => yScaler2(yAccessor2(d)));

    bounded.append("path")
        .attr("d",lineGenerator(data))
        .attr("fill","none")
        .attr("stroke","red")
        .attr("stroke-width", 2);

    bounded.append("path")
        .attr("d",lineGenerator2(data))
        .attr("fill","none")
        .attr("stroke","green")
        .attr("stroke-width", 2);

    const yAxisGenerator = d3.axisLeft().scale(yScaler);
    const yAxis = bounded.append("g").call(yAxisGenerator);

    const xAxisGenerator = d3.axisBottom().scale(xScaler);
    const xAxis = bounded
        .append("g")
        .call(xAxisGenerator.tickFormat(d3.timeFormat("%Y-%m-%d")))
        .style("transform", `translateY(${dimension.boundedHeight}px)`);
}

buildPlot();