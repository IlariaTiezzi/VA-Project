
// Global variable of dataset
//var dataset;

var margin = 80;
var w = 700;
var h = 700;
var margin_min = 10;
var w_min = 230;
var h_min = 400;

d3.json("assets/data/we-groups.json", 

	function(error, data) {
		if (error) {console.log(error);} 

		// Once loaded, copy to dataset
		//dataset = data;

		/*d3.select(".row").selectAll("p")
			.data(data)
			.enter()
			.append("p")
			.text(function(d){return d.x + ", " + d.y + ". Members: " + d.members;})*/

		// Create a SVG element inside the DIV with ID #viz
		var svg = d3.select("#viz")
			.append("svg")
			.attr("width", w + margin)
			.attr("height", h + margin)
			.attr("style", "padding: 40px");

		// Define and places the park map as background of the SVG
		svg.append('defs')
			.append('pattern')
		    .attr('id', 'parkmap')
		    .attr('patternUnits', 'userSpaceOnUse')
		    .attr('width', w)
		    .attr('height', h)
		  	.append('svg:image')
		    .attr('xlink:href', 'assets/data/parkmap.jpg')
		    .attr("width", w)
		    .attr("height", h)
		    .attr("x", 0)
		    .attr("y", 5)
		    .attr("opacity", "0.5");

		// Create a rectangle with fill the park map
		svg.append("rect")
			.attr("width", w)
			.attr("height", h)
			.attr("fill", "url(#parkmap)");

		// Create the scales considering the range of the data
		var Xscale = d3.scale.linear()
			.domain ([0,100])
			.range([0, w]);

		var Yscale = d3.scale.linear()
			.domain ([0,100])
			.range([h, 0]);

		var scaleCount = d3.scale.linear()
			.domain ([0,150000])
			.range([0, 15]);
		
		// Define the axis considering the scale
		var xAxis = d3.svg.axis()
			.scale(Xscale)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(Yscale)
			.orient("left");

		// Create the group for the axis x
		svg.append("g") 
			.attr("class", "axis")
			.attr("transform", "translate(0, " + h + ")")
	    	.call(xAxis)
	    	.style("font-size" , 11);

	    // Create the group for the axis y
	    svg.append("g") 
			.attr("class", "axis")				
	    	.call(yAxis)
	    	.style("font-size" , 11);
	  	    		    
	    // Create a circle for each data entry
		var mapCircle = svg.selectAll("circle")
			.data(data)
			.enter()
			.append("circle")
			.attr("id", function(d,i){return "group" + i;})
			.attr("cx", function(d){return Xscale(d.x);})
			.attr("cy", function(d){return Yscale(d.y);})
			.attr("r", function(d){return scaleCount(d.members);})			
			.attr("fill", "#0192b5")
			.attr("opacity", "0.8")
			.on("mouseover", function(d){
				d3.select(this).style("stroke", "#0192b5").style("stroke-width", 3)
				circleMouseOver(d);
			})
			.on("mouseout", function(d){ 
				d3.select(this).style("stroke", "none");
				circleMouseOut();				
			});	
		
		// Define the group to content the box and related text
	    var gMapRect = svg.append('g');
		
		// Create a rect for each data entry
		var mapRect = gMapRect.selectAll("rect")
			.data(data)
			.enter()
			.append("rect")
			.attr("id", function(d,i){return "mapRect" + i;})
			.attr("class", "mapRect")
			.attr("x", function(d){return Xscale(d.x);})
			.attr("y", function(d){return Yscale(d.y);})
			.attr("dx", "20")
			.attr("width", "110")
			.attr("height", "80")
			.style("fill", "#FFF")
			.attr("stroke", "#666")
			.attr("stroke-width", "1")
			.style("display", "none");
		
		// Create a text for each data entry inside the rectangle
		var labelRect = gMapRect.selectAll("text")
			.data(data)
			.enter()
			.append("text")			
			.attr("x", function(d){return Xscale(d.x)+40;})
			.attr("y", function(d){return Yscale(d.y)+50;})						
			.attr("class", "labelRect")
			.attr("text-anchor", "left")
			.attr("font-family","sans-serif")
			.attr("font-size","12px")
			.attr("fill","#666")
			.style("display", "none");

		// Define the first line of text 
		var textTspan1 = labelRect.append("tspan")			
			.attr("x", function(d){return Xscale(d.x)+10;})
			.attr("y", function(d){return Yscale(d.y)+30;})
			.text(function(d,i){ return 'Group Id:' + i;})
			.attr("font-weight", "bold");

		// Define the second line of text
		var textTspan2 = labelRect.append("tspan")			
			.attr("x", function(d){return Xscale(d.x)+10;})
			.attr("y", function(d){return Yscale(d.y)+50;})
			.text(function(d){return "Members: " + d.members });

		// Define the event for the mouse over the circle
		var circleMouseOver = function(d){			
			var tempRect = mapRect.filter( function(e){ return (e.x == d.x) && (e.y == d.y); });
			var tempText = labelRect.filter( function(e){ return (e.x == d.x) && (e.y == d.y); });
			tempRect.style("display", "block");
			tempText.style("display", "block");
		}

		// Define the event for the mouse out the circle
		var circleMouseOut = function() {
			mapRect.style("display", "none");
			labelRect.style("display", "none");
		}
	}	
);
