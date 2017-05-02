import * as d3 from 'd3'

import services from 'src/modules/services'

export default {
  name: 'stackedbar',
  template: require('components/charts/StackedBar.html'),
  data () {
    return {
      model: nch.model
    }
  },

  mounted() {
    this.render()
  },
  methods: {

    render() {

      var svg = d3.select("#stackedBarChart").attr('width', 600),
        margin = {top: 20, right: 20, bottom: 30, left: 20},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + 200 + "," + margin.top + ")")

      var x = d3.scaleBand()
        .rangeRound([0, width - 300])
        .paddingInner(0.05)
        .align(0.1)

      var y = d3.scaleLinear()
        .rangeRound([0, height - 80])

      var z = d3.scaleOrdinal()
        .range(["#927DB2", "#AAC66C", "#CE6660", "#5B90C6"])

      d3.csv("/static/api/stacked-bar-example.tsv", function(d, i, columns) {

        console.log( "stacked bar" )
        console.log(columns)
        var t = 0

        for (i = 1, t = 0; i < columns.length; ++i) t += d[columns[i]] = +d[columns[i]]
        d.total = t
        return d
      }, function(error, data) {
        if (error) throw error
        console.log(data)

        var keys = data.columns.slice(1)

        data.sort(function(a, b) { return b.total - a.total })
        x.domain(data.map(function(d) { return d.Manufacturer }))
        y.domain([0, d3.max(data, function(d) { return d.total })]).nice()
        z.domain(keys)

        // filters go in defs element
        var defs = svg.append("defs");

        // create filter with id #drop-shadow
        // height=130% so that the shadow is not clipped
        var filter = defs.append("filter")
            .attr("id", "drop-shadow")
            .attr("height", "130%");

        // SourceAlpha refers to opacity of graphic that this filter will be applied to
        // convolve that with a Gaussian with standard deviation 3 and store result
        // in blur
        filter.append("feGaussianBlur")
            .attr("in", "SourceAlpha")
            .attr("stdDeviation", 2)
            .attr("result", "blur");

        // translate output of Gaussian blur to the right and downwards with 2px
        // store result in offsetBlur
        filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 1)
            .attr("dy", 2)
            .attr("result", "offsetBlur");

        // overlay original SourceGraphic over translated blurred opacity by using
        // feMerge filter. Order of specifying inputs is important!
        var feMerge = filter.append("feMerge");

        feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
        feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

        g.append("g")
          .selectAll("g")
          .data(d3.stack().keys(keys)(data))
          .enter().append("g")
          .attr("class","oneRect")
          .attr("fill", function(d) { return z(d.key) })
          .selectAll("rect")
          .data(function(d) { return d })
          .enter().append("rect")
          .attr("x", function(d, i) { 
            return x(d.data.Manufacturer) + i * 50 })
          .attr("y", function(d) { 
            return y( d[0]) })
          .attr("height", function(d) { return y(d[1]) - y(d[0]) })
          .attr("width", x.bandwidth())
          .attr("stroke", "white")
          .attr("stroke-width", "3px")
          .style("filter", "url(#drop-shadow)")

        g.selectAll(".oneRect")
          .data(d3.stack().keys(keys)(data))
          .selectAll("g")
          .data(function(d) { return d })
          .enter().append("text")
          .attr('x', function (d, i) {
            return x.bandwidth()/2 + x(d.data.Manufacturer) + i * 50
          })
          .style('text-anchor', 'middle')
          .style('font-weight', 'bold')
          .attr("y", function(d) { return (y(d[0]) + y(d[1]))/2 })
          .text(function(d) { return d3.format('.0%')((d[1]-d[0])/d.data.total) })
          .attr("fill","black")

        g.append("g")
          .selectAll("text")
          .data(data)
          .enter().append("text")
          .attr('x', function (d, i) {
            return x.bandwidth()/2 + x(d.Manufacturer) + i * 50
          })
          .attr("font-weight", "bold")
          .style('text-anchor', 'middle')
          .attr("y", height - 40)
          .text(function(d) { return d.Manufacturer })

        // g.append("g")
        //   .attr("class", "axis")
        //   .attr("transform", "translate(0," + height + ")")
        //   .call(d3.axisBottom(x))

        // g.append("g")
        //   .attr("class", "axis")
        //   .call(d3.axisLeft(y).ticks(null, "s"))
        //   .append("text")
        //   .attr("x", 2)
        //   .attr("y", y(y.ticks().pop()) + 0.5)
        //   .attr("dy", "0.32em")
        //   .attr("fill", "#000")
        //   .attr("font-weight", "bold")
        //   .attr("text-anchor", "start")
        //   .text("Face Value Ranges")
      g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")")

        g.append("g")
          .append("text")
          .attr("x", 2)
          .attr("y", 0)
          .attr("dy", "0.32em")
          .attr("fill", "#000")
          .attr("font-weight", "bold")
          .attr("text-anchor", "start")
          .text("Face Value Ranges")

        var legend = g.append("g")
          .attr("font-family", "sans-serif")
          .attr("font-size", 14)
          .attr("font-weight", "bold")
          .attr("text-anchor", "start")
          .selectAll("g")
          .data(keys.slice())
          .enter().append("g")
          .attr("transform", function(d, i) { 
            return "translate(20," + (40 * i + 20) + ")" 
          })

        legend.append("circle")
          .attr("r", 15)
          .attr("cx", 0)
          .attr("cy", 20)
          .attr("fill", z)
          .attr("stroke", "white")
          .attr("stroke-width", "3px")

        legend.append("text")
          .attr("x", 25)
          .attr("y", 20)
          .attr("dy", "0.32em")
          .text(function(d) { return d })

        legend.append('line')
          .attr('y1', 35)
          .attr('y2', 35)
          .attr('x1', 25)
          .attr('x2', 125)
          .attr('stroke', 'grey')
          .style("stroke-dasharray","5,5")

      })

    }
  }
}
