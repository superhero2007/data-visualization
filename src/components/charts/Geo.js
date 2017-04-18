import * as d3 from 'd3';
import * as topojson from 'topojson'

import services from '../../modules/services';

export default {
  name: 'geo',
  props: ['title', 'geoId'],
  template: require('components/charts/Geo.html'),
  data () {
    return {
      model: nch.model,
      quantile: null,
      rateById: null,
      projection: null,
      path: null,
      graphWidth: 460,
      graphHeight: 210
    }
  },
  mounted() {
    //this.fetchStates();
    this.fetchStates3();
    //this.fetchStates2();
  },
  methods: {
    fetchStates() {
      var projection = d3.geoAlbersUsa();
      projection.scale(480).translate([this.graphWidth / 2, this.graphHeight / 2]);

      var path = d3.geoPath().projection(projection);
      var svg = d3.select("#" + this.geoId);

      d3.json("/static/api/us.json", function(error, us) {

        svg.append("path")
          .attr("class", "stateFill")
          .datum(topojson.feature(us, us.objects.states))
          .attr("d", path);


      });
    },

    fetchStates3() {

      services.getRedemptionsByState();

      var projection = d3.geoAlbersUsa();
      projection.scale(480).translate([this.graphWidth / 2, this.graphHeight / 2]);

      var path = d3.geoPath().projection(projection);
      var svg = d3.select("#" + this.geoId);

      var color = d3.scaleLinear()
        .range(["rgb(213,222,217)","rgb(69,173,168)","rgb(84,36,55)","rgb(217,91,67)"]);

      // Load in my states data!
      d3.csv("/static/api/stateslived.tsv", function(data) {
        color.domain([0,1,2,3]); // setting the range of the input data

        // Load GeoJSON data and merge with states data
        d3.json("/static/api/us-states.json", function(json) {

            // Loop through each state data value in the .csv file
            for (var i = 0; i < data.length; i++) {

              // Grab State Name
              var dataState = data[i].state;

              // Grab data value
              var dataValue = data[i].visited;

              // Find the corresponding state inside the GeoJSON
              for (var j = 0; j < json.features.length; j++)  {
                var jsonState = json.features[j].properties.name;

                if (dataState == jsonState) {

                  // Copy the data value into the JSON
                  json.features[j].properties.visited = dataValue;

                  // Stop looking through the JSON
                  break;
                }
              }
            }

            // Bind the data to the SVG and create one path per GeoJSON feature
            svg.selectAll("path")
              .data(json.features)
              .enter()
              .append("path")
              .attr("d", path)
              .style("stroke", "#fff")
              .style("stroke-width", "1")
              .style("fill", function(d) {

                // Get data value
                var value = d.properties.visited;

                if (value) {
                  //If value exists…
                  return color(value);
                } else {
                  //If value is undefined…
                  return "rgb(213,222,217)";
                }
              });
        });
      });
    },

    fetchStates2() {

      console.log( "fetching states, id: " + this.geoId );

      this.rateById = d3.map();
      var width = 460,height = 210;
      this.projection = d3.geoAlbersUsa()
        .scale(480)
        .translate([width / 2, height / 2]);

      this.path = d3.geoPath().projection(this.projection);

      var rateMap = this.rateById;
      d3.queue()
        .defer(d3.json, '/static/api/us.json')
        .defer(d3.tsv, "/static/api/unemployment.tsv", function(d) { rateMap.set(d.id, +d.rate); })
        .await(this.ready);

    },

    ready( error, us ) {
      if (error) {
        throw error;
      }

      var quantile = d3.scaleQuantile()
        .range(d3.range(9).map(function(i) { return "q" + i + "-9"; }));

      quantile.domain( this.rateById.values() );

      var width = 460,height = 210;
      var svg = d3.select("#" + this.geoId)
        .attr("width", width)
        .attr("height", height);
      var rateMap = this.rateById;

      svg.append("g")
        .attr("class", "counties")
        .selectAll("path")
        .data(topojson.feature(us, us.objects.counties).features)
        .enter().append("path")
        .attr("class", function(d) { return quantile(rateMap.get(d.id)); })
        .attr("d", this.path);

      svg.append("path")
        .datum(topojson.mesh(us, us.objects.states, function(a, b) { return a !== b; }))
        .attr("class", "states")
        .attr("d", this.path);
    }
  }
}
