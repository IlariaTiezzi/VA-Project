
//Global variables
var margin = 80;
var w = 700;
var h = 700;


// Create a chart to see the size and position of the group of users in the park map
d3.json("assets/data/we-groups.json", 

	function(error, data) {
		if (error) {console.log(error);} 
		
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
		    .attr("opacity", "0.3");

		// Create a rectangle with fill the park map
		svg.append("rect")
			.attr("width", w)
			.attr("height", h)
			.attr("fill", "url(#parkmap)");		
		
		//Add text to identify the name of the areas
		var tundraland = svg.append("text")			
			.attr("x", 150)
			.attr("y", -10)						
			.attr("class", "labelArea")
			.text("Tundra Land");

		var entrycorridor = svg.append("text")			
			.attr("x", 380)
			.attr("y", -10)						
			.attr("class", "labelArea")
			.text("Entry Corridor");

		var kiddieland = svg.append("text")			
			.attr("x", 550)
			.attr("y", -10)						
			.attr("class", "labelArea")
			.text("Kiddie Land");

		var wetland = svg.append("text")			
			.attr("x", 370)
			.attr("y", -710)
			.attr("transform", "rotate(90)")						
			.attr("class", "labelArea")
			.text("Wet Land");

		var lineWetland = svg.append("line")			
			.attr("x1", 550)
			.attr("y1", 400)
			.attr("x2", 705)
			.attr("y2", 400)
			.attr("stroke", "#0192b5")						
			.attr("stroke-width", 0.5);

		var coasteralley = svg.append("text")			
			.attr("x", 550)
			.attr("y", -710)
			.attr("transform", "rotate(90)")				
			.attr("class", "labelArea")
			.text("Coaster Alley");


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
			.attr("width", "120")
			.attr("height", "70")
			.attr("rx", 5)
			.attr("ry", 5)
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
			.attr("y", function(d){return Yscale(d.y)+28;})
			.text(function(d,i){ return 'Group Id: ' + i;})
			.attr("font-weight", "bold");

		// Define the second line of text
		var textTspan2 = labelRect.append("tspan")			
			.attr("x", function(d){return Xscale(d.x)+10;})
			.attr("y", function(d){return Yscale(d.y)+48;})
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


// Create a multi bar charts  to display the number of members per area
d3.json("assets/data/we-area.json", 

	function(error, data) {
		if (error) {console.log(error);} 

		// Create a SVG element inside the DIV with ID #multibar		
		var svg = d3.select("#multibar")
			.append("svg")
			.attr("height", 400)
			.attr("style", "padding: 10px");
		
		// Set the name of the days
		var setDay = function(d){
			var day;
			if (d.day === "06") { return day = "Friday";}
			else if (d.day === "07") { return day = "Saturday";}
			else { return day = "Sunday";}
			return day;
		}
		
		// Group values by day and area, then map the data of value for the new array
		var dataset = d3.nest()
			.key(function(d){return setDay(d);})
			.key(function(d){return d.area;})
			.rollup(function(v){return d3.sum(v,function(d){return d.members;});})
			.entries(data)
			.map(function(d){
				return {
					key: d.key,
					values: d.values.map(function(p){return {x:p.key, y:p.values}})				
				}
			});  	

  		// Create a multi bar charts for the dataset
		nv.addGraph(function() {
		    var chart = nv.models.multiBarChart()
			      .duration(350)
			      .reduceXTicks(true) 
			      .rotateLabels(0)      
			      .showControls(true)   
			      .groupSpacing(0.1)
			      .color(d3.scale.category20c().range());    
		    
		    chart.xAxis;

		    chart.yAxis.tickFormat(d3.format('s')); 

		    d3.select('#multibar svg')
		        .datum(dataset)
		        .call(chart);

		    nv.utils.windowResize(chart.update);

		    return chart;
		});


				
	}	
);

