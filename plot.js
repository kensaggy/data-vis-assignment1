(function () {

    var margin = {top: 20, right: 30, bottom: 50, left: 50};
    var width = 960 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;

    var colorScheme = {
        Glob : '#e66101',
        NHem : '#5e3c99',
        SHem : '#b2abd2'
    }

    var xScale = d3.scale.linear()
        /* Domain goes from minimum year to maximum year */
        .domain([d3.min(data, function(d) {
            return d.Year;
        }), d3.max(data, function(d) {
            return d.Year;
        })])
        .range([0, width]);

    var yScale = d3.scale.linear()
        /*
        Domain goes from minimum NHem tempature to the maximum NHem temperature
        To be exact, we could take the min/max between all three measurements: NHem, SHem & Glob
        */
        .domain([d3.min(data, function(d) {
            return d.NHem;
        }), d3.max(data, function(d) {
            return d.NHem;
        })])
        .range([height,0]);

    var xAxis = d3.svg.axis()
        .scale(xScale)
        .tickSize(-height)
        .tickPadding(10)
        .tickSubdivide(true)
        .orient("bottom")
        .tickFormat(d3.format("d"));

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .tickPadding(10)
        .tickSize(-width)
        .tickSubdivide(true)
        .orient("left");

    var svg = d3.select("body").append("svg")
        // .call(zoom)
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "x axis")
        .append("text")
        .attr("class", "axis-label")
        .attr("y", height + 35)
        .attr("x", width/2)
        .text('Year');

    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

    svg.append("g")
        .attr("class", "y axis")
        .append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", (-margin.left) + 10)
        .attr("x", -height/2)
        .text('Temperature (ºF)');

    svg.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", width)
        .attr("height", height);

    function scaleYear(d) {
        return xScale(d.Year);
    }

    function yScaleParam(param) {
        return function (d) {
            return yScale(d[param])
        }
    }

    var GlobGen = d3.svg.line()
        .interpolate("basis")
        .x(scaleYear)
        .y(yScaleParam('Glob'));

    var NHemLineGen = d3.svg.line()
        .interpolate("basis")
        .x(scaleYear)
        .y(yScaleParam('NHem'));

    var SHemLineGen = d3.svg.line()
        .interpolate("basis")
        .x(scaleYear)
        .y(yScaleParam('SHem'));

    svg.selectAll('.glob_line')
        .data(data)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("clip-path", "url(#clip)")
        .attr('stroke', colorScheme.Glob)
        .attr("d", GlobGen(data));

    svg.selectAll('.nhem_line')
        .data(data)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("clip-path", "url(#clip)")
        .attr('stroke', colorScheme.NHem)
        .attr("d", NHemLineGen(data));

    svg.selectAll('.shem_line')
        .data(data)
        .enter()
        .append("path")
        .attr("class", "line")
        .attr("clip-path", "url(#clip)")
        .attr('stroke', colorScheme.SHem)
        .attr("d", SHemLineGen(data));

    var legend = svg.selectAll(".legend")
        .data([
            {'name':'South Hemispheres', 'color': colorScheme.SHem},
            {'name':'North Hemispheres', 'color': colorScheme.NHem},
            {'name':'Global', 'color': colorScheme.Glob}
        ])
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) {
            return "translate(0," + (height - (i + 1) * 20) + ")";
        });

    legend.append("rect")
        .attr("x", width - 20)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return d.color; });

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) { return d.name; });

})();