var tip = d3.tip().attr('class','d3-tip').html(function(d) {
  return "<strong>County Name: </strong> <span class = 'details'> " 
    +d.properties.NAME+ "<br></span>"
    +"<strong>Labor Force: </strong> <span class = 'details'> "
    +d.total
    ;});
  
  var data = d3.map(); //map1

  var data2 = d3.map(); //map2
  
  var colorScheme = d3.schemeSpectral[6];
  colorScheme.unshift("#eee")
  var colorScale1 = d3.scaleThreshold()
      .domain([0.5, 0.7, 0.9, 1.1, 1.3, 1.5])
      .range(colorScheme);

  var colorScheme2 = d3.schemePRGn[6];
  colorScheme2.unshift("#eee")
    var colorScale2 = d3.scaleThreshold()
      .domain([0.5, 0.7, 0.9, 1.1, 1.3, 1.5]) //change these numbers
      // .domain([4000, 8000, 12000, 16000, 19000, 50000, 80000, 200000, 600000])
      .range(colorScheme2);
  
  var margin = {top: 0, right: 0, bottom: 0, left: 0},
              width = 1500 - margin.left - margin.right,
              height = 1500 - margin.top - margin.bottom;
  
  var svg = d3.select(".mapChart")
              .append("svg")
              .attr("width", width)
              .attr("height", height);
  
////////////////////////////////////////////
//Map Show 1 (button 1)

function mapShow1(){

  var tip = d3.tip().attr('class','d3-tip').html(function(d) {
    return "<strong>Name: </strong> <span class = 'details'> " 
      +d.properties.NAME+ "<br></span>" + 
      "<strong>Data: </strong> <span class = 'details'> "  +d.total+ "<br></span>"; });
    svg.call(tip);

//boolean variable: var VariableA;

d3.queue()
  .defer(d3.json,"indycounty.json")
  .defer(d3.csv,"in_out_2016.csv",function(d) { data.set(d.description, +d.LabWorkRatio); }) //
  .await(ready); //change this data set

  function ready(error,countyMap){
    if (error) throw error;
//console.log(countyMap);
    // NOTICE: Here we transfer topojson to geojson
    var indyState = topojson.feature(countyMap, {
          type: "GeometryCollection",
          geometries: countyMap.objects.indycounty.geometries
      });


    var projection = d3.geoMercator()
        .fitExtent([[200, 120], [600, 600]],indyState);

    var geoPath = d3.geoPath()
                    .projection(projection);
      //console.log(indyState);
  // Draw the map
  var originalColor;
  
 svg.append("g")
     .attr("class", "countries")
     .selectAll("path")
     .data(indyState.features)
     .enter().append("path")
     .attr("d", geoPath)
     .attr("stroke","black")
     .attr("fill", function (d){

 //if (variable = true/boolean variable)
             d.total = data.get(d.properties.NAME) || 0;
//else {d.total = data_alt.get(key) - second data set will be visualized on top
             return colorScale1(d.total);

         })
  
  .on('click', function(d){
  tip.show(d) 
  })
  .on('mouseover', function(d){
    d3.select(this)
      .style("fill","green");
    d3.select("#" + d.properties.NAME)
    .style("fill", "green");
      
  })
    .on('mouseout', function(d){
    tip.hide(d)
    d3.select(this)
      .style("fill",originalColor);
    d3.select("#" + d.properties.NAME)
    .style("fill", originalColor);
  })
  
  ;}}
  
