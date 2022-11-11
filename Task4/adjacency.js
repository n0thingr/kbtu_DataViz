async function build() {
    const nodes = await d3.csv("nodelist.csv");
	const nodes2 = await d3.csv("nodelist2.csv");
    const edges = await d3.csv("edgelist.csv");

    function adjacencyMatrix(nodes, nodes2, edges) {
        var matrix = [];
        var edgeHash = {};
        edges.forEach(edge => {
            var id = edge.source+"-"+edge.target;
            edgeHash[id] = edge;
        })
        for(let i=0; i<nodes2.length; i++) {
            for(let j=0; j<nodes.length; j++) {
                var uel = nodes2[i];
                var bel = nodes[j];
                var grid = {
                    id: uel.id+"-"+bel.id,
                    x:j,
                    y:i,
                    weight:0
                }
                if(edgeHash[grid.id]) {
                    grid.weight = edgeHash[grid.id].weight;
                }
                matrix.push(grid);

            }
        }
        return matrix;
    }

    var dimension = {
        width: window.innerWidth*0.8,
        height: window.innerWidth*0.8,
        margin: {
            top: 400,
            right: 10,
            bottom: 10,
            left: 450
        }
    }

    dimension.boundedWidth = dimension.width
        - dimension.margin.right
        - dimension.margin.left;

    dimension.boundedHeight = dimension.height
        - dimension.margin.top
        - dimension.margin.bottom;

    const wrapper = d3.select("#wrapper")
        .append("svg")
        .attr("width", dimension.width)
        .attr("height", dimension.height)

    const bounds = wrapper.append("g")
        .style("transform",`translate(${dimension.margin.left}px,${dimension.margin.top}px)`);
    var data = adjacencyMatrix(nodes, nodes2, edges);
	
    const pole = bounds
        .selectAll("rect")
        .data(data)
        .enter()
        .append("rect")
        .attr("class","grid")
        .attr("width",25)
        .attr("height",25)
        .attr("x", d=>d.x*25)
        .attr("y", d=>d.y*25)
        .style("fill-opacity", d=>d.weight*0.2)

    const namesX = wrapper
        .append("g")
        .attr("transform",`translate(${dimension.margin.left},${dimension.margin.top - 5})`)
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("y",(d,i)=> i*25+12.5)
        .text(d=>d.id)
        .style("text-anchor","start")
        .attr("transform", "rotate(270)");
        
    const namesX2 = wrapper    
        .append("g")
        .attr("transform",`translate(${dimension.margin.left},${dimension.margin.top - 200})`)
        .selectAll("text")
        .data(nodes)
        .enter()
        .append("text")
        .attr("y",(d,i)=> i*25+12.5)
        .text(d=>d.role)
        .style("text-anchor","start")
        .attr("transform", "rotate(270)");

    const namesY = wrapper
        .append("g")
        .attr("transform",`translate(${dimension.margin.left - 400},${dimension.margin.top})`)
        .selectAll("text")
        .data(nodes2)
        .enter()
        .append("text")
        .attr("y",(d,i)=> i*25+12.5)
        .text(d=>d.role)
        .style("text-anchor","end");

    const namesY2 = wrapper
        .append("g")
        .attr("transform",`translate(${dimension.margin.left - 10},${dimension.margin.top})`)
        .selectAll("text")
        .data(nodes2)
        .enter()
        .append("text")
        .attr("y",(d,i)=> i*25+12.5)
        .text(d=>d.id)
        .style("text-anchor","end");

}

build();