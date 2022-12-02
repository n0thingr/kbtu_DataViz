async function createForceLayout() {
    const nodes = await d3.csv("nodelist.csv");
    const edges = await d3.csv("edgelist.csv");
    var roleScale = d3.scaleOrdinal()
      .domain(["contractor", "employee", "manager"])
      .range(["#75739F", "#41A368", "#FE9922"]);

     var nodeHash = nodes.reduce((hash, node) => {hash[node.id] = node;
		return hash;
    }, {})

     edges.forEach(edge => {
        edge.weight = parseInt(edge.weight)
        edge.source = nodeHash[edge.source]
        edge.target = nodeHash[edge.target]
      })

    var linkForce = d3.forceLink()

    var simulation = d3.forceSimulation()
     .force("charge", d3.forceManyBody().strength(-40))
     .force("center", d3.forceCenter().x(300).y(300))
     .force("link", linkForce)
     .nodes(nodes)
     .on("tick", forceTick)

   simulation.force("link").links(edges)

   var dimension = {
       width: window.innerWidth*0.8,
       height: window.innerWidth*0.8,
       margin: {
           top: 50,
           right: 10,
           bottom: 10,
           left: 55
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


  wrapper.selectAll("line.link")
      .data(edges, d => `${d.source.id}-${d.target.id}`)
      .enter()
      .append("line")
      .attr("class", "link")
      .style("opacity", .5)
      .style("stroke-width", d => d.weight);

   var nodeEnter = wrapper.selectAll("g.node")
      .data(nodes, d => d.id)
      .enter()
      .append("g")
      .attr("class", "node")
	  .call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));
	  
	  
   nodeEnter.append("circle")
      .attr("r", 5)
      .style("fill", d => roleScale(d.role))
	  
   nodeEnter.append("text")
      .style("text-anchor", "middle")
      .attr("y", 15)
      .text(d => d.id)
	  .on('click', function(d){		
        var result = prompt('Change the name of the node', d.id);
		if(result) {
			d3.select(this).text(result)
        }
    });

   function forceTick() {
     d3.selectAll("line.link")
        .attr("x1", d => d.source.x)
        .attr("x2", d => d.target.x)
        .attr("y1", d => d.source.y)
        .attr("y2", d => d.target.y)
     d3.selectAll("g.node")
        .attr("transform", d => `translate(${d.x},${d.y})`)
   }
   
   function dragstarted(event, d) {
      if (!event.active) simulation.alphaTarget(.03).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event, d) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event, d) {
      if (!event.active) simulation.alphaTarget(.03);
      d.fx = null;
      d.fy = null;
    }
	
	d3.select(window)
    .on("mousedown", addnewnode)
	
	var default_name = "New person"
	
	function addnewnode() {
		pos = d3.pointer(event)
		nodes.push({id: default_name + " " + nodes.length, index: nodes.length, role: 'employee', salary:'200000', vx: 0, vy:0, x: pos[0], y: pos[1]});
		console.log(nodes)
		var nodeEnter = wrapper.selectAll("g.node")
			.data(nodes, d => d.id)
			.enter()
			.append("g")
			.attr("class", "node")
			.call(d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended));
	  
	  
		nodeEnter.append("circle")
			.attr("r", 5)
			.style("fill", d => roleScale(d.role))
	  
		nodeEnter.append("text")
			.style("text-anchor", "middle")
			.attr("y", 15)
			.text(d => d.id)
				.on('click', function(d){		
					var result = prompt('Change the name of the node', d.id);
					if(result) {
						d3.select(this).text(result)
					}
			});
	}
}

createForceLayout()