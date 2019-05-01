function getTotals(data) {
    // get age ranges from first item (same for each item in the array)
    ranges = Object.keys(data[0]).filter(d => d != "day");
    return data.map(function(d) {
        return {"day": d.day,
            "total": ranges.reduce(function(t, s) { return t + d[s]; }, 0)};
    });
}


function makeBar(data) {
    totals = getTotals(data);
    console.log("Totals:", totals);
    var height = 400;
    var width = 600;
// margin will allow us to ignore all of the indent math,
// just translate everything away from the edges!
    var margin = {top: 20, bottom: 100, left: 100, right: 20};
    var svg = d3.select("#bar").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g") // add a group to translate everything according to margins
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var y = d3.scaleBand()
        .rangeRound([0,height])
        .domain(totals.map(function(d) { return d.day; })) // map names to bands
        .padding(0.1); // leave a gap between bands

// yAxis will automatically use names from the domain as labels
    var yAxis = d3.axisBottom().scale(y);
    svg.append("g")
        .attr("transform", "translate(3," + (height+200) + ")") // move to bottom
        .call(yAxis);

    var x = d3.scaleLinear()
        .domain([0,d3.max(totals.map(function(d) { return d.total; }))]) // go to maximum value
        .range([0, width]);

    var xAxis = d3.axisLeft().scale(x);
    svg.append("g")
        //.call(xAxis); // draw axis

    svg.selectAll("rect").data(totals)
        .enter().append("rect")
        .attr("x", 0)
        .attr("y", function(d,i) { return y(d.day);}) // y-value based on bar name
        .attr("width", function(d) { return x(d.total);}) // x-value based on number
        .attr("height", y.bandwidth()) // height uses y-scales bandwidth
        .style("fill", "blue")
        //.attr("transform", "rotate(-90)")
        //.attr("transform", "translate(0," + (height+100) + ")")
        .attr("transform", "translate(2, 600) rotate(-90)");

    var x = d3.scaleLinear()
        .domain([d3.max(totals.map(function(d) { return d.total; })),0]) // go to maximum value
        .range([0, width]);

    var xAxis = d3.axisLeft().scale(x);
    svg.append("g")
        .call(xAxis); // draw axis

}




function makeStacked(data) {
    console.log("Data:", data);
    // get data in to proper format
    var stack = d3.stack()
        .keys(['10', '20', '30', '40', '50', '60','70', '80', '90', '100', '110', '120', '130']);
    series = stack(data);
    console.log(series);
    var margin = {top: 20, right: 30, bottom: 30, left: 30},
        width = 600 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;
    var svg = d3.select("#stacked").append("svg")
        .attr("width", width +margin.left +margin.right)
        .attr("height", height + margin.top+ margin.bottom)
        .attr("transform", "translate("+margin.left+","+margin.top+")");


    //x axis
    var x = d3.scaleLinear()
        .domain([0,31])
        .range([10,width])
    var xAxis = d3.axisBottom().scale(x);
    svg.append("g")
        .attr("transform", "translate(50," +(height) + ")")
        .call(xAxis);
    svg.append("text")
        .attr("transform",
            "translate(" + (350) + " ," + (height+30) + ")")
        .style("text-anchor", "middle")
        .text("Day");


    //y axis
    var y = d3.scaleLinear()
        .domain([0, 80000])
        .range([height, 33]);
    var yAxis = d3.axisLeft().scale(y);
    svg.append("g")
        .attr("transform", "translate(60, 0)")
        .call(yAxis);
    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", -5)
        .attr("x",-250)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text("Number Of Bike Trips");
    
// different colors of stack
    var colors = ['#bebfbe','#0cccd4','#0031fd','#9100ff','#f000a3','#ff8d00','#ff0013','#ff0013','#ff0013','#ff0013','#ff0013','#ff0013','#ff0013'];
    var color = ["70+","60","50","40","30","20","10"];



    //creates stacks
    var groups = svg.selectAll("a")
        .data(series)
        .enter()
        .append("a")
        .attr("fill", function(d,i){return colors[i];})
    groups.selectAll("rect")
        .data(function(d, i) {return d})
        .enter()
        .append("rect")
        .attr("x", function(d,i) { return x(i);})
        .attr("y", function(d,i) { return y(d[1]);})
        .attr("width", 13)
        .attr("height", function(d,i) { return height - y(d[1] - d[0]);})
        .attr("transform", "translate(60,0)");

    // commands to add in the legend
    var legend = svg.selectAll('.legend')
        .data(colors)
        .text("Day")
        .enter()
        .append('g')
        .attr('class', 'legend')
        .attr('transform', function(d, i) {
            if(i<=6){
                var horizontal = 620;
                var vertical = i*20;
                return 'translate(' + horizontal + ',' + vertical + ')';
            }
            else{
                var horizontal = 10*1000;
                var vertical = 10*1000;
                return 'translate(' + horizontal + ',' + vertical + ')';
            }
        });
    var legendRect = 18;
    var legendSpace = 4;
    // adding the text and legend squares
    colors.reverse();
    legend.append('rect')
        .attr('width', legendRect)
        .attr('height', legendRect)
        .style('fill', function(d,i){if(i<7){return colors[i+6]};})
        .style('stroke', function(d,i){if(i<7){return colors[i+6]};});
    legend.append('text')
        .attr('x', legendRect + legendSpace)
        .attr('y', legendRect - legendSpace)
        .text(function(d,i) { if(i<7){return color[i]}; })
}

function makeCharts(data) {
    makeBar(data);
    makeStacked(data);
}

d3.json("bikeData.json").then(makeCharts);
