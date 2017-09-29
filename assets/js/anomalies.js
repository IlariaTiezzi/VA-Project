// Global variables
var w = 600;
var h = 600;
var c20c = d3.scale.category20c().range();
var colors = [c20c[3],c20c[2], c20c[1], c20c[0]];
var formatSuffix = d3.format(".2s");

// Create a cumulative line chart to compare the number of check-ins per hours of the day in Creighton Pavilion
d3.json("assets/data/we-cf-checkin.json", 

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
        var svg = d3.select("#cf-linechart")
            .append("svg")
            .attr("width", w)
            .attr("height", h);        

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


// Create a bubblele chart to see the users with a lower avarage of movements
d3.json("assets/data/we-checkin-mov-id.json", 

    function(error, data) {
        if (error) {console.log(error);} 

        // Calcolate the average of the movements
        var movAvg  = d3.mean(data, function(d){ return d.movements});       

        // Filter id with movements slower than average
        var filterMov = data.filter(function(d){return d.movements < movAvg;});       

        // Define a new array with filtered data
        var dataset = filterMov
            .map(function(d) {
                return {
                    key: d.id,
                    values: [{x: d.movements, y: d.checkin, size: d.movements, shape: 'circle'}]
                }
            });      

         // Create a SVG element inside the DIV with ID #bubblechart       
        var svg = d3.select("#bubblechart")
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
                .color(colors);         // Define the range of colours

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
                    "</tbody>";

                return "<table>" + header + body + "</table>";                    
            });
       
            // Add the data to chart
            d3.select('#bubblechart svg')
              .datum(dataset)
              .call(chart);

            // Resize chart according to the size of the window
            nv.utils.windowResize(chart.update);

            return chart;
        });

    }
);