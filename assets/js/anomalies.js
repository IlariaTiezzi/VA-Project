// Global variables
var c20c = d3.scale.category20c().range();
var blue20c = [c20c[3],c20c[2], c20c[1], c20c[0]];
var colors10 = d3.scale.category10().range();
var formatSuffix = d3.format(".2s");

// Create a cumulative line chart to compare the number of check-ins per hours of the day in Creighton Pavilion
d3.json("assets/data/we-cf-checkin.json", 

    function(error, data) {
        if (error) {console.log(error);} 

        var w = "95%";
        var h = 600;

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

        // Create a SVG element inside the DIV with ID #cf-linechart        
        var svg = d3.select("#cf-linechart")
            .append("svg")
            .attr("width", w)
            .attr("height", h);        

        // Add a cumulative line chart
        nv.addGraph(function() {
        var chart = nv.models.cumulativeLineChart()            
            .x(function(d) { return d[0] })
            .y(function(d) { return d[1]/100}) // 100% is 1.00
            .color(colors10)          // Select the range of colors                  
            .showControls(false)    // Don't show the controls
            .showLegend(true)       //Show the legend, allowing users to turn on/off line series.
            .showYAxis(true)        //Show the y-axis
            .showXAxis(true)        //Show the x-axis
            .useInteractiveGuideline(true);

        // Define the label and displays all data in the x axis 
        chart.xAxis
            .axisLabel("Hours")
            .ticks(16);

        // Define the label and the format of y axis
        chart.yAxis
            .axisLabel("Check-in")
            .tickFormat(d3.format(',%')); 

        // Add the data to chart
        d3.select('#cf-linechart svg')
            .datum(dataset)
            .call(chart);

        // Resize chart according to the size of the window
        nv.utils.windowResize(chart.update);

        return chart;
      });

    }
);


// Create a bubble chart to see the check-ins and movements per id with at least a check-in in Creighton Pavilion
d3.json("assets/data/we-checkin-mov-id.json", 

    function(error, data) {
        if (error) {console.log(error);} 

        var w = "95%";
        var h = 600;

        // Filter data with check-in greater than 0
        var filterData = data.filter(function(d){return d.checkin_cf > 0;})
  
        // Define a new array with filtered data
        var dataset = filterData.map(function(d) {
                return {
                    key: d.id,
                    values: [{x: d.movements, y: d.checkin_tot, size: d.movements, shape: 'circle', checkin_cf: d.checkin_cf}]
                }
            });      

         // Create a SVG element inside the DIV with ID #cf-bubblechart       
        var svg = d3.select("#cf-bubblechart")
            .append("svg")
            .attr("width", w)
            .attr("height", h);  

        // Add a scatter chart
        nv.addGraph(function() {
            var chart = nv.models.scatterChart()
                .showLegend(false)       //Do not show the legend.
                .showYAxis(true)        //Show the y-axis
                .showXAxis(true)        //Show the x-axis       
                .duration(350)          // Define the duration of the transformation
                .color(blue20c);         // Define the range of colors

            // Define the label and displays all data in the x axis 
            chart.xAxis
                .axisLabel("Movements")
                .ticks(10); 

            // Define the label and displays all data in the x axis 
            chart.yAxis
                .axisLabel("Check-in")
                .ticks(10); 

            // Define the contents of the tooltip
            chart.tooltip.contentGenerator(function(d) {
                var series = d.series[0];
                
                if (series.value === null) return; 

                var header = 
                    "<thead>" + 
                      "<tr>" +
                        "<td class='legend-color-guide'><div style='background-color: " + series.color + ";'></div></td>" +
                        "<td class='key'>ID: <strong>" + series.key + "</strong></td>" +
                      "</tr>" + 
                    "</thead>";

                var body = 
                    "<tbody>" +
                        "<tr><td class='x-value'><strong>Moviments: </strong>" + d.point.x + "</td></tr>" +
                        "<tr><td class='x-value'><strong>Check-in: </strong>" + d.point.y + "</td></tr>"+
                        "<tr><td><strong>Check-in C.F.: </strong>" + d.point.checkin_cf + "</td></tr>"+
                    "</tbody>";

                return "<table>" + header + body + "</table>";                    
            });


            // Add the data to chart
            d3.select('#cf-bubblechart svg')
              .datum(dataset)
              .call(chart);

            // Resize chart according to the size of the window
            nv.utils.windowResize(chart.update);

            return chart;
        });

    }
);

// Create a chart to see the size and position of the specified user in the park map
d3.json("assets/data/we-id.json", 

    function(error, data) {
        if (error) {console.log(error);} 

        var margin = 80;
        var w = 700;
        var h = 700;  

        // Filter data with check-in greater than 0
        var filterCheckin = data.filter(function(d){return d.tag === "check-in";})   

        // Filter data with check-in greater than 0
        var filterMov = data.filter(function(d){return d.tag === "movement";})  

        // Create a SVG element inside the DIV with ID #mov-id
        var svg = d3.select("#mov-id")
            .append("svg")
            .attr("width", w + margin)
            .attr("height", h + margin)
            .attr("style", "padding: 40px");

        // Define and places the park map as background of the SVG
        svg.append('defs')
            .append('pattern')
            .attr('id', 'parkmap-id')
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
            .attr("fill", "url(#parkmap-id)"); 

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

        var rScale = d3.scale.linear()
            .domain ([0,10])
            .range([0, 20]);

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
            .attr("cx", function(d){return xScale(d.x);})
            .attr("cy", function(d){return yScale(d.y);})
            .attr("r", function(d){return rScale(d.movements);})            
            .attr("fill", function(d){
                if (d.tag === "check-in") return blue20c[3];
                else return blue20c[2];
            })
            .attr("opacity", "0.8")
            .on("mouseover", function(d){
                // Add the stroke
                d3.select(this)
                    .style("stroke", blue20c[3])
                    .style("stroke-width", 2);
                // Show the tooltip
                circleMouseOver(d); 
            })
            .on("mouseout", function(){
                // Remove the stroke
                d3.select(this).style("stroke", "none"); 
                // Hide the tooltip
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
            .attr("x", function(d){return xScale(d.x) + 5;}) 
            .attr("y", function(d){return yScale(d.y) + 5;}) 
            .attr("dx", "20") 
            .attr("width", "120") 
            .attr("height", "70") 
            .attr("rx", 5) 
            .attr("ry", 5) 
            .style("fill", "#FFF") 
            .attr("stroke", "#CCC") 
            .attr("stroke-width", "1px") 
            .style("display", "none"); 

        // Create a text for each data entry inside the rectangle 
        var labelRect = gMapRect.selectAll("text") 
            .data(data) 
            .enter() 
            .append("text")            
            .attr("class", "labelRect") 
            .attr("text-anchor", "left") 
            .attr("font-family","sans-serif") 
            .attr("font-size","12px") 
            .attr("fill","#666") 
            .style("display", "none"); 

        // Define the first line of text  
        var textTspan1 = labelRect.append("tspan")       
            .attr("x", function(d){return xScale(d.x)+15;}) 
            .attr("y", function(d){return yScale(d.y)+35;}) 
            .text(function(d){ 
                if (d.tag === "check-in") return d.tag;
                else return d.movements + " " + d.tag;
            }) 
            .attr("font-weight", "bold"); 

        // Define the second line of text 
        var textTspan2 = labelRect.append("tspan")       
        .attr("x", function(d){return xScale(d.x)+15;}) 
            .attr("y", function(d){return yScale(d.y)+55;})  
        .text(function(d){return "Hour: " + d.hour }); 

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