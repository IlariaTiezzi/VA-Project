
// Global variables
var c20c = d3.scale.category20c().range();
var colors = [c20c[3],c20c[2], c20c[1], c20c[0]];
var formatSuffix = d3.format(".2s");

// Create a heatmap  to display the number of check-in per hours of the friday
d3.json("assets/data/fri-h-area.json", 

	function(error, data) {
		if (error) {console.log(error);} 

		var margin = 30;
		var w = 200;
		var h = 470;		
		var extentValue = d3.extent(data, function(d){ return d.users});

        // Set the names of areas
        var setArea = function(d){
            var area;
            if (d.area === "Coaster Alley") { return area = "CA";}
            else if (d.area === "Entry Corridor") { return area = "EC";}
            else if (d.area === "Kiddie Land") { return area = "KL";}
            else if (d.area === "Tundra Land") { return area = "TL";}
            else { return area = "WL";}
            return area;
        }	

		// Define a new data array and assign the name of areas
		var dataset = data.map(function(d) {
    		return {
    			area: setArea(d),
        		hour: d.hour,
    			value: d.users
    		}
		});
		
		// Create a new array by extracting and sorting only the hours
		var hours = d3.set(dataset
			.map(function(d){return d.hour;})).values()
			.sort(function(a,b){return a - b});
			
		// Create a new array by extracting only the areas
		var areas = d3.set(dataset
			.map(function(d){ return d.area;})).values();		

		// Create a SVG element inside the DIV with ID #heatmap-fri
		var svg = d3.select('#heatmap-fri')
        	.append("svg")
        	.attr("width", w + margin)
        	.attr("height", h + margin + margin)
        	.append("g");        	

        // Create the scales considering the range of the data
        var xScale = d3.scale.ordinal()
        	.domain(areas)
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

        // Create cells by considering area and time as coordinates, then color them according to the number of users
        var cells = svg.selectAll('rect')
        	.data(dataset)
        	.enter()
        	.append('g')
        	.append('rect')
        	.attr('class', 'cell')
        	.attr('width', w/5-3)
        	.attr('height', h/16-3)
        	.attr('x', function(d){return xScale(d.area);})
        	.attr('y', function(d){return yScale(d.hour);})        	
        	.attr('fill', function(d) {return colorScale(d.value);})
        	
        	.on("mouseover", function(d){
        		// Get this cells x/y values, then augment for the tooltip
        		var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand()/2;
        		var yPosition = parseFloat(d3.select(this).attr("y")) /2 + h/2;

        		// Update the tooltip position
        		var labelCells = d3.select("#heatmap-tooltip-fri")
        			.style("left", xPosition + "px")
        			.style("top", yPosition + "px");

        		// Updates the value of the first paragraph
        		var labelTime = d3.select("#heatmap-time-fri")
        			.text(d.area + " " + d.hour);

        		// Updates the value of the second paragraph
        		var labelValue = d3.select("#heatmap-value-fri")
        			.text(formatSuffix(d.value))
        			.style("font-size", "20px")
        			.style("font-weight", "bold");

        		// Show the tooltip
        		d3.select("#heatmap-tooltip-fri").classed("hidden", false);
        	})
        	.on("mouseout", function(){
        		// Hide the tooltip
        		d3.select("#heatmap-tooltip-fri").classed("hidden", true);
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

// Create a heatmap  to display the number of check-in per hours of the saturday
d3.json("assets/data/sat-h-area.json", 

    function(error, data) {
        if (error) {console.log(error);} 

        var margin = 30;
        var w = 200;
        var h = 470;
        var extentValue = d3.extent(data, function(d){ return d.users});

        // Set the names of areas
        var setArea = function(d){
            var area;
            if (d.area === "Coaster Alley") { return area = "CA";}
            else if (d.area === "Entry Corridor") { return area = "EC";}
            else if (d.area === "Kiddie Land") { return area = "KL";}
            else if (d.area === "Tundra Land") { return area = "TL";}
            else { return area = "WL";}
            return area;
        }   

        // Define a new data array and assign the name of areas
        var dataset = data.map(function(d) {
            return {
                area: setArea(d),
                hour: d.hour,
                value: d.users
            }
        });
        
        // Create a new array by extracting and sorting only the hours
        var hours = d3.set(dataset
            .map(function(d){return d.hour;})).values()
            .sort(function(a,b){return a - b});
            
        // Create a new array by extracting only the areas
        var areas = d3.set(dataset
            .map(function(d){ return d.area;})).values();       

        // Create a SVG element inside the DIV with ID #heatmap-sat
        var svg = d3.select('#heatmap-sat')
            .append("svg")
            .attr("width", w + margin)
            .attr("height", h + margin + margin)
            .append("g");           

        // Create the scales considering the range of the data
        var xScale = d3.scale.ordinal()
            .domain(areas)
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

        // Create cells by considering area and time as coordinates, then color them according to the number of users
        var cells = svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('g')
            .append('rect')
            .attr('class', 'cell')
            .attr('width', w/5-3)
            .attr('height', h/16-3)
            .attr('x', function(d){return xScale(d.area);})
            .attr('y', function(d){return yScale(d.hour);})         
            .attr('fill', function(d) {return colorScale(d.value);})
            
            .on("mouseover", function(d){
                // Get this cells x/y values, then augment for the tooltip
                var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand()/2;
                var yPosition = parseFloat(d3.select(this).attr("y")) /2 + h/2;

                // Update the tooltip position
                var labelCells = d3.select("#heatmap-tooltip-sat")
                    .style("left", xPosition + "px")
                    .style("top", yPosition + "px");

                // Updates the value of the first paragraph
                var labelTime = d3.select("#heatmap-time-sat")
                    .text(d.area + " " + d.hour);

                // Updates the value of the second paragraph
                var labelValue = d3.select("#heatmap-value-sat")
                    .text(formatSuffix(d.value))
                    .style("font-size", "20px")
                    .style("font-weight", "bold");

                // Show the tooltip
                d3.select("#heatmap-tooltip-sat").classed("hidden", false);
            })
            .on("mouseout", function(){
                // Hide the tooltip
                d3.select("#heatmap-tooltip-sat").classed("hidden", true);
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

// Create a heatmap  to display the number of check-in per hours of the sunday
d3.json("assets/data/sun-h-area.json", 

    function(error, data) {
        if (error) {console.log(error);} 

        var margin = 30;
        var w = 200;
        var h = 470;
        var extentValue = d3.extent(data, function(d){ return d.users});

        // Set the names of areas
        var setArea = function(d){
            var area;
            if (d.area === "Coaster Alley") { return area = "CA";}
            else if (d.area === "Entry Corridor") { return area = "EC";}
            else if (d.area === "Kiddie Land") { return area = "KL";}
            else if (d.area === "Tundra Land") { return area = "TL";}
            else { return area = "WL";}
            return area;
        }   

        // Define a new data array and assign the name of areas
        var dataset = data.map(function(d) {
            return {
                area: setArea(d),
                hour: d.hour,
                value: d.users
            }
        });
        
        // Create a new array by extracting and sorting only the hours
        var hours = d3.set(dataset
            .map(function(d){return d.hour;})).values()
            .sort(function(a,b){return a - b});
            
        // Create a new array by extracting only the areas
        var areas = d3.set(dataset
            .map(function(d){ return d.area;})).values();       

        // Create a SVG element inside the DIV with ID #heatmap-sun
        var svg = d3.select('#heatmap-sun')
            .append("svg")
            .attr("width", w + margin)
            .attr("height", h + margin + margin)
            .append("g");           

        // Create the scales considering the range of the data
        var xScale = d3.scale.ordinal()
            .domain(areas)
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

        // Create cells by considering area and time as coordinates, then color them according to the number of users
        var cells = svg.selectAll('rect')
            .data(dataset)
            .enter()
            .append('g')
            .append('rect')
            .attr('class', 'cell')
            .attr('width', w/5-3)
            .attr('height', h/16-3)
            .attr('x', function(d){return xScale(d.area);})
            .attr('y', function(d){return yScale(d.hour);})         
            .attr('fill', function(d) {return colorScale(d.value);})
            
            .on("mouseover", function(d){
                // Get this cells x/y values, then augment for the tooltip
                var xPosition = parseFloat(d3.select(this).attr("x")) + xScale.rangeBand()/2;
                var yPosition = parseFloat(d3.select(this).attr("y")) /2 + h/2;

                // Update the tooltip position
                var labelCells = d3.select("#heatmap-tooltip-sun")
                    .style("left", xPosition + "px")
                    .style("top", yPosition + "px");

                // Updates the value of the first paragraph
                var labelTime = d3.select("#heatmap-time-sun")
                    .text(d.area + " " + d.hour);            

                // Updates the value of the second paragraph
                var labelValue = d3.select("#heatmap-value-sun")
                    .text(formatSuffix(d.value))
                    .style("font-size", "20px")
                    .style("font-weight", "bold");

                // Show the tooltip
                d3.select("#heatmap-tooltip-sun").classed("hidden", false);
            })
            .on("mouseout", function(){
                // Hide the tooltip
                d3.select("#heatmap-tooltip-sun").classed("hidden", true);
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

// Create a cumulative line chart to compare the number of movement per hours of the day
d3.json("assets/data/we-mov.json", 

    function(error, data) {
        if (error) {console.log(error);} 

        var setColor = [colors[0],colors[2], colors[3]];

        // Set the name of the days
        var setDay = function(d){
            var day;
            if (d.day === "06") { return day = "Friday";}
            else if (d.day === "07") { return day = "Saturday";}
            else { return day = "Sunday";}
            return day;
        }

        // Define a new data array and assign the name of days
        var dataset = d3.nest()
            .key(function(d){return setDay(d);})
            .entries(data)
            .map(function(d) {
                return {
                    key: d.key,
                    values: d.values.map(function(p){return [p.hour, p.users];})
                }
            });      

        console.log(dataset);

        // Create a SVG element inside the DIV with ID #linechart        
        var svg = d3.select("#linechart")
            .append("svg")
            .attr("width", "95%")
            .attr("height", 600);        

        // Add a cumulative line chart
        nv.addGraph(function() {
        var chart = nv.models.cumulativeLineChart()            
            .x(function(d) { return d[0] })
            .y(function(d) { return d[1]/100}) // 100% is 1.00
            .color(setColor)          // Select the range of colors                   
            .showControls(false)    // Don't show the controls
            .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
            .showYAxis(true)        //Show the y-axis
            .showXAxis(true)        //Show the x-axis
            .useInteractiveGuideline(true);

        // Define the label and displays all data in the x axis 
        chart.xAxis
            .axisLabel("Hours")
            .ticks(16);       

        // Define the format of number in the y axis
        chart.yAxis
            .tickFormat(d3.format(',.1%')); 

        // Add the data to chart
        d3.select('#linechart svg')
            .datum(dataset)
            .call(chart);

        // Resize chart according to the size of the window
        nv.utils.windowResize(chart.update);

        return chart;
      });




    }
);