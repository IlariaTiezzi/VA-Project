// Global variables
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
            .attr("width", 600)
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
        d3.select('#cf-linechart svg')
            .datum(dataset)
            .call(chart);

        // Resize chart according to the size of the window
        nv.utils.windowResize(chart.update);

        return chart;
      });




    }
);