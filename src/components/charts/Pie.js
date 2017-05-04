import * as d3 from 'd3'

import services from 'src/modules/services'

export default {
  name: 'pie',
  props: ['groupByField'],
  template: require('components/charts/Pie.html'),
  data () {
    return {
      model: nch.model,
      pieData: []
    }
  },

  watch: {
    model: {
      handler: function (val, oldVal) {
        this.render()
      }, deep: true
    }
  },

  mounted() {
    console.log("Pie mounted: " + this.groupByField);
    services.getPieData().then((response) => {
      this.pieData = response
      this.render()
    }).catch((message) => {
      console.log('Pie promise catch:' + message)
    })
  },
  methods: {

    render() {
      var items = this.pieData;

      var responseData = [];

      if (this.groupByField == 'categoryname') {
        responseData = this.getDataForCategories(items);
      }
      else if (this.groupByField == 'medianame') {
        responseData = this.getDataForMediaTypes(items);
      }

      var svg = d3.select('#pieChart').attr('width', 800).html(''),
        width = +svg.attr('width'),
        height = +svg.attr('height'),
        radius = Math.min(width / 2, height) / 2.5
      var g = svg.append('g').attr('transform', 'translate(' + width / 4 + ',' + ( height / 2 - 30) + ')')

      var color = d3.scaleOrdinal([
        '#d62024',
        '#70ccdd',
        '#f07a20',
        '#2bb34b',
        '#cc449a',
        '#2a3088',
        '#3366CC',
        '#DC3912',
        '#109618',
        '#990099',
        '#ab98c5',
        '#898aa6',
        '#687b88',
        '#486b6b',
        '#5da056',
        '#74d03c',
        '#8cff00',
        '#6633CC',
        '#39DC12',
        '#961018',
        '#009999',
        '#999900',
        '#7b6888'
      ])

      var lineHeight = 40
      var total = 0

      var pie = d3.pie()
        .sort(null)
        .value(function (d) {
          return d.totalcouponredemption
        })

      var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0)

      var out = d3.arc()
        .outerRadius(radius - 6)
        .innerRadius(0)

      var label = d3.arc()
      .outerRadius(radius - 80)
      .innerRadius(radius - 80);

      var arc = g.selectAll('.arc')
        .data(pie(responseData))
        .enter().append('g')
        .attr('class', 'arc')

      for (i = 0; i < responseData.length; i++) {
        total += responseData[i].totalcouponredemption
      }

      var groupBy = this.groupByField

      arc.append('path')
        .attr('d', out)
        .attr('class', 'path')
        .attr('fill', 'white')

      arc.append('path')
        .attr('d', path)
        .attr('class', 'path')
        .attr('fill', function (d) {
          //return color(d.data.categoryname)
          return color(d.data[groupBy])
        })


      arc.append("text")
        .attr("font-weight", "bold")
        .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")" })
        .text(function(d) { return d3.format('.0%')(d.data.totalcouponredemption / total) })
        .attr("fill","white")

      // arc.append("circle")
      //   .attr("r", radius-10)
      //   .attr("fill", "transparent")
      //   .attr("stroke", "white")
      //   .attr("stroke-width", "3px")

      g.selectAll('.arc')
        .on('mouseover', piemouseover)
        .on('mouseout', piemouseout)

      function piemouseover(d) {
        nch.model.selectedCategory = d.data.categoryname
        nch.model.selectedMedia = null
      }

      function piemouseout(d) {
        nch.model.selectedCategory = null
      }

      g = svg.append('g').attr('transform', 'translate(' + (width / 2 ) + ',' + 0 + ')')

      var list = g.selectAll('.list')
        .data(responseData)
        .enter().append('g')
        .attr('class', 'list')

      var i = 0, j

      g.append("g")
        .append("text")
        .attr("x", 200)
        .attr("y", 20)
        .attr("dy", "0.32em")
        .attr("fill", "#000")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .text("Media Type Legend")

      list.append('circle')
        .attr("r", 15)
        .attr("cx", 0)
        .attr("cy", function (d, i) {
          return 70 + i * lineHeight
        })
        .attr("stroke", "white")
        .attr("stroke-width", "3px")
        .attr('fill', function (d) {
          //return color(d.categoryname)
          return color(d[groupBy])

        })

      list.append('text')
        .attr('x', 20)
        .attr('y', function (d, i) {
          return 70 + i * lineHeight
        })
        .attr("font-weight", "bold")
        .text(function (d) {
          //return (d.categoryname)
          return (d[groupBy])
        })

       list.append('text')
        .attr('x', 320)
        .attr('y', function (d, i) {
          return 70 + i * lineHeight
        })
        .attr("font-weight", "bold")
        .text(function (d) {
          return d3.format(',.0f')(d.totalcouponredemption)
        })
        .attr("text-anchor", "end")

      
      list.append('text')
        .attr('x', 380)
        .attr('y', function (d, i) {
          return 70 + i * lineHeight
        })
        .attr("font-weight", "bold")
        .text(function (d) {
          return d3.format('.0%')(d.totalcouponredemption / total)
        })
        .attr("text-anchor", "end")


      list.append('line')
        .attr('y1', function (d, i) {
          return 85 + i * lineHeight
        })
        .attr('y2', function (d, i) {
          return 85 + i * lineHeight
        })
        .attr('x1', 20)
        .attr('x2', width / 2)
        .attr('stroke', 'grey')
        .style("stroke-dasharray","5,5")
    },

    getDataForCategories(items) {
      var responseData = []

      for (var i = 0; i < items.length; i++) {

        for (var j = 0; j < this.model.selectedCategories.length; j++) {
          if ((this.model.selectedCategories[j] == items[i].categoryname) && (this.model.selectedMedia == null || this.model.selectedMedia == items[i].medianame)) {
            for (var k = 0; k < responseData.length; k++) {
              if ((responseData[k].categoryname == items[i].categoryname)) {
                responseData[k].totalcouponredemption += items[i].totalcouponredemption
                break
              }
            }

            if (k == responseData.length && items[i].totalcouponredemption != 0) {
              var item = {
                categoryname: items[i].categoryname,
                medianame: items[i].medianame,
                totalcouponredemption: items[i].totalcouponredemption
              }
              responseData.push(item)
            }
          }
        }
      }

      return responseData;
    },

    getDataForMediaTypes(items) {
      var responseData = []

      for (var i = 0; i < items.length; i++) {

        for (var k = 0; k < responseData.length; k++) {
          if ((responseData[k].medianame == items[i].medianame)) {
            responseData[k].totalcouponredemption += items[i].totalcouponredemption
            break
          }
        }

        if (k == responseData.length && items[i].totalcouponredemption != 0) {
          var item = {
            medianame: items[i].medianame,
            totalcouponredemption: items[i].totalcouponredemption
          }
          responseData.push(item)
        }
      }

      return responseData;
    }

  }
}
