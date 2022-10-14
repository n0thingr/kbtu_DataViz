let dimensions = {
  width: window.innerWidth * 0.6,
  height: 400,
  margin: {
    top: 30,
    left: 30,
    bottom: 30,
    right: 30
  }
}

dimensions.boundedWidth = dimensions.width - dimensions.margin.left - dimensions.margin.right;
dimensions.boundedHeight = dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

let wrapper = d3.select("#wrapper").append("svg");
wrapper.attr("width", dimensions.width);
wrapper.attr("height", dimensions.height);
let container = wrapper.append("g");
container.attr("transform", `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);

function scatterPlot(){
  var data = d3.range(100).map(() => ({"x": Math.random() * 10, "y": Math.random() * 10}));
  var data2 = d3.range(100).map(() => ({"x": Math.random() * 10, "y": Math.random() * 10}));

  const xAcc = d => d.x;
  const yAcc = d => d.y;

  let data3 = d3.merge([data, data2])

  let xScale = d3.scaleLinear()
      .domain(d3.extent(data3, xAcc))
      .range([dimensions.margin.left, dimensions.boundedWidth]);
  let yScale = d3.scaleLinear()
      .domain(d3.extent(data3, yAcc))
      .range([dimensions.margin.top, dimensions.boundedHeight]);

  let viz = container.selectAll("circle")
      .data(data)
      .enter()
      .append("path")
      .attr("class", "circle")
      .attr("cx", d => xScale(xAcc(d)))
      .attr("cy", d => yScale(yAcc(d)))
      .attr("r", "1")
      .attr("stroke", "#32CD32")
      .attr("stroke-width", 1)
      .attr("fill", "#FFFFFF")
      .attr("d", d3.symbol().type(d3.symbolCircle))
      .attr("transform", function (d) {
        return "translate(" + xScale(xAcc(d)) + "," + yScale(yAcc(d)) + ")";
      });

  let viz2 = container.selectAll("rhombus")
      .data(data2)
      .enter()
      .append("path")
      .attr("class", "rhombus")
      .attr("cx", d => xScale(xAcc(d)))
      .attr("cy", d => yScale(yAcc(d)))
      .attr("r", "1")
      .attr("stroke", "#1137AA")
      .attr("stroke-width", 1)
      .attr("fill", "#FFFFFF")
      .attr("d", d3.symbol().type(d3.symbolDiamond))
      .attr("transform", function (d) {
        return "translate(" + xScale(xAcc(d)) + "," + yScale(yAcc(d)) + ")";
      });

  let xAxisGen = d3.axisBottom().scale(xScale);
  let yAxisGen = d3.axisLeft().scale(yScale);

  const axisX = container.append("g").call(xAxisGen).style("transform", `translateY(${dimensions.boundedHeight}px)`)
  const axisy = container.append("g").call(yAxisGen).style("transform", `translateX(${dimensions.margin.left}px)`)

  // Title
  container.append('text')
      .attr('x', dimensions.boundedWidth / 2)
      .attr('y', 0)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Helvetica')
      .style('font-size', 20)
      .text('Scatter Plot');
  // X label
  container.append('text')
      .attr('x', dimensions.boundedWidth + 10)
      .attr('y', dimensions.boundedHeight)
      .attr('text-anchor', 'middle')
      .style('font-family', 'Helvetica')
      .style('font-size', 12)
      .text('X');
  // Y label
  container.append('text')
      .attr('text-anchor', 'middle')
      .attr('transform', 'translate(0, 20)')
      .style('font-family', 'Helvetica')
      .style('font-size', 12)
      .text('Y');
}

d3.select("#GenerateButton").on("click", function(d) {
  scatterPlot()
})

d3.select("#ClearButton").on("click", function(d) {
  wrapper.remove()
  container.remove()

  wrapper = d3.select("#wrapper").append("svg");
  wrapper.attr("width", dimensions.width);
  wrapper.attr("height", dimensions.height);
  container = wrapper.append("g");
  container.attr("transform", `translate(${dimensions.margin.left}, ${dimensions.margin.top})`);
})

scatterPlot()