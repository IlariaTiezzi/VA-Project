
// Create a chart to see the size and position of the group of users in the park map
d3.json("assets/data/we-groups.json", 

	function(error, data) {
		if (error) {console.log(error);} 

		var margin = 80;
		var w = 700;
		var h = 700;
		
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
		var xScale = d3.scale.linear()
			.domain ([0,100])
			.range([0, w]);

		var yScale = d3.scale.linear()
			.domain ([0,100])
			.range([h, 0]);

		var scaleCount = d3.scale.linear()
			.domain ([0,150000])
			.range([0, 15]);
		
		// Define the axis considering the scale
		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(yScale)
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
			.attr("cx", function(d){return xScale(d.x);})
			.attr("cy", function(d){return yScale(d.y);})
			.attr("r", function(d){return scaleCount(d.users);})			
			.attr("fill", "#0192b5")
			.attr("opacity", "0.8")
			.on("mouseover", function(d, i){
        		// Get this cells x/y values, then augment for the tooltip
        		var xPosition = parseFloat(d3.select(this).attr("cx"))+150;
        		var yPosition = parseFloat(d3.select(this).attr("cy"))+150;

        		// Update the tooltip position
        		var labelCells = d3.select("#viz-tooltip")
        			.style("left", xPosition + "px")
        			.style("top", yPosition + "px");

        		// Update the value of the first paragraph
        		var labelGroup = d3.select("#viz-group")
        			.text("Group ID " + i);

        		//  Update the value of the second paragraph
        		var labelValue = d3.select("#viz-value")
        			.text(d.users)
        			.style("font-size", "20px")
        			.style("font-weight", "bold");

        		// Show the tooltip
        		d3.select("#viz-tooltip").classed("hidden", false);
        	})
        	.on("mouseout", function(){
        		// Hide the tooltip
        		d3.select("#viz-tooltip").classed("hidden", true);
        	});			
	}	
);


// Create a multi bar charts  to display the number of users per area
d3.json("assets/data/we-area.json", 

	function(error, data) {
		if (error) {console.log(error);} 

		var colors = ["#9ecae1", "#6baed6", "#3182bd"];

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
			.rollup(function(v){return d3.sum(v,function(d){return d.users;});})
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
			      .reduceXTicks(true)  	//If 'false', every single x-axis tick label will be rendered.
			      .rotateLabels(0)     	//Angle to rotate x-axis labels.
			      .showControls(true)	//Allow user to switch between 'Grouped' and 'Stacked' mode.
			      .groupSpacing(0.1)	//Distance between each group of bars.
			      .color(colors); // Configure the range of colors 
      
		    
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


// Create a heatmap  to display the number of users per hours of the day
d3.json("assets/data/we-h-day.json", 

	function(error, data) {
		if (error) {console.log(error);} 

		var margin = 30;
		var w = 210;
		var h = 470;
		var colors = ["#c6dbef", "#9ecae1", "#6baed6", "#3182bd"];
		var formatSuffix = d3.format(".2s");
		var extentValue = d3.extent(data, function(d){ return d.users});	

		// Set the name of the days
		var setDay = function(d){
			var day;
			if (d.day === "06") { return day = "Fr";}
			else if (d.day === "07") { return day = "Sa";}
			else { return day = "Su";}
			return day;
		}	

		// Define a new data array and set the name of the days
		var dataset = data.map(function(d) {
    		return {
    			day: setDay(d),
        		hour: d.hour,
    			value: d.users
    		}
		});
		
		// Create a new array by extracting and sorting only the hours
		var hours = d3.set(dataset
			.map(function(d){return d.hour;})).values()
			.sort(function(a,b){return a - b});
			
		// Create a new array by extracting only the days
		var days = d3.set(dataset
			.map(function(d){ return d.day;})).values();		

		// Create a SVG element inside the DIV with ID #heatmap
		var svg = d3.select('#heatmap')
        	.append("svg")
        	.attr("width", w + margin)
        	.attr("height", h + margin + margin)
        	.append("g");        	

        // Create the scales considering the range of the data
        var xScale = d3.scale.ordinal()
        	.domain(days)
        	.rangeBands([0, w]);

        var yScale = d3.scale.ordinal()
        	.domain(hours)
        	.rangeBands([0, h]);

        var colorScale = d3.scale.quantile()
        	.domain(extentValue)
        	.range(colors); 

        // Define the axis considering the scale
    	var xAxis = d3.svg.axis()
        	.scale(xScale)        	
        	.orient("bottom");

        var yAxis = d3.svg.axis()
        	.scale(yScale)        	
        	.orient("right");

        // Create cells by considering day and time as coordinates, then color them according to the number of users
        var cells = svg.selectAll('rect')
        	.data(dataset)
        	.enter()
        	.append('g')
        	.append('rect')
        	.attr('class', 'cell')
        	.attr('width', w/3-3)
        	.attr('height', h/16-3)
        	.attr('x', function(d){return xScale(d.day);})
        	.attr('y', function(d){return yScale(d.hour);})        	
        	.attr('fill', function(d) {return colorScale(d.value);})
        	
        	.on("mouseover", function(d){
        		// Get this cells x/y values, then augment for the tooltip
        		var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand()/2;
        		var yPosition = parseFloat(d3.select(this).attr("y")) /2 + h/2;

        		// Update the tooltip position
        		var labelCells = d3.select("#heatmap-tooltip")
        			.style("left", xPosition + "px")
        			.style("top", yPosition + "px");

        		// Updates the value of the first paragraph
        		var labelTime = d3.select("#heatmap-time")
        			.text(d.day + " " + d.hour);

        		// Updates the value of the second paragraph
        		var labelValue = d3.select("#heatmap-value")
        			.text(d.value)
        			.style("font-size", "20px")
        			.style("font-weight", "bold");

        		// Show the tooltip
        		d3.select("#heatmap-tooltip").classed("hidden", false);
        	})
        	.on("mouseout", function(){
        		// Hide the tooltip
        		d3.select("#heatmap-tooltip").classed("hidden", true);
        	});

        // Add x axis to svg
        svg.append("g")
        	.attr("class", "axis")
        	.attr("transform", "translate(0," + h + ")")
        	.call(xAxis)
        	.selectAll('text')
        	.attr('font-weight', 'normal')
        	.style("text-anchor", "start")
        	.attr("dx", "-1em");        	

        // Add y axis to svg
        svg.append("g")
        	.attr("class", "axis")
        	.attr("transform", "translate(" + w + ", 0)")
        	.call(yAxis)
        	.selectAll('text')
        	.attr('font-weight', 'normal')
        	.style("text-anchor", "start");

        // Define a legend according to the color scale
        var legend = svg.selectAll(".legend")
              .data([0].concat(colorScale.quantiles()), function(d) { return d; })
              .enter().append("g")
              .attr("class", "legend");

        // Add the rectangles by assigning the fill according to the color scale
        legend.append("rect")
            .attr("x", function(d, i) { return w/4 * i; })
            .attr("y", 510)
            .attr("width", w/4)
            .attr("height", 10)
            .style("fill", function(d, i) { return colors[i];});

        // Add the text by defining the format
        legend.append("text")
            .attr("class", "txt-legend")
            .text(function(d) { return "≥ " + formatSuffix(d); })
            .attr("x", function(d, i) { return w/4 * i; })
            .attr("y", 510)
            .attr("dy", 20)
            .style("font-size", "11px")
            .style("fill", "#0192b5")
            .style("font-family", "sans-serif");        
		
	}
);


// Create a donut charts  to display the number check-in per day
d3.json("assets/data/we-checkin-day.json", 

	function(error, data) {
		if (error) {console.log(error);} 

		var colors = ["#9ecae1", "#6baed6", "#3182bd"];

		// Create a SVG element inside the DIV with ID #multibar		
		var svg = d3.select("#donutchart")
			.append("svg")
			.attr("width", 250)
			.attr("height", 250);
		
		// Set the name of the days
		var setDay = function(d){
			var day;
			if (d.day === "06") { return day = "Friday";}
			else if (d.day === "07") { return day = "Saturday";}
			else { return day = "Sunday";}
			return day;
		}
		
		
		// Create a donut charts for the data 
		nv.addGraph(function() {
			var chart = nv.models.pieChart()
				.x(function(d) { return setDay(d) })
				.y(function(d) { return d.users })
				.showLabels(true)     //Display pie labels
				.labelThreshold(.05)  //Configure the minimum slice size for labels to show up
				.labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
				.donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
				.donutRatio(0.35)     //Configure how big you want the donut hole size to be.
				.color(colors);  // Configure the range of colors.
			  

			d3.select("#donutchart svg")
			    .datum(data)
			    .transition().duration(350)
			    .call(chart);

			return chart;
		});
				
	}	
);



