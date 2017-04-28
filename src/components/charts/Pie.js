import * as d3 from 'd3'

import services from 'src/modules/services'

export default {
  name: 'pie',
  template: require('components/charts/Pie.html'),
  data () {
    return {
      model: nch.model
    }
  },
  mounted() {
    services.getPieData().then(this.render).catch((message) => { console.log('Pie promise catch:' + message) })
  },
  methods: {

    render(jsonData) {

      var svg = d3.select('#pieChart').attr('width', 800),
        width = +svg.attr('width'),
        height = +svg.attr('height'),
        radius = Math.min(width/2, height) / 2,
        g = svg.append('g').attr('transform', 'translate(' + width / 4 + ',' + height / 2 + ')')

      var color = d3.scaleOrdinal([
        '#98abc5',
        '#8a89a6',
        '#7b6888',
        '#6b486b',
        '#a05d56',
        '#d0743c',
        '#ff8c00',
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
        '#999900'
        ])

      var pie = d3.pie()
        .sort(null)
        .value(function(d) { return d.totalcouponredemption })

      var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0)

      var arc = g.selectAll('.arc')
          .data(pie(jsonData))
          .enter().append('g')
          .attr('class', 'arc')

      var i = 0, j = 0
      var lineHeight = 16

      var total = 0

      for ( i = 0; i < jsonData.length; i++ ) {
        total += jsonData[i].totalcouponredemption
      }

      arc.append('path')
        .attr('d', path)
        .attr('fill', function(d) { return color(d.data.categoryname) })

      g = svg.append('g').attr('transform', 'translate(' + (width / 2 ) + ',' + 0 + ')')

      var list = g.selectAll('.list')
          .data(jsonData)
          .enter().append('g')
          .attr('class', 'list')

      i = 0

      list.append('rect')
        .attr('x', 5)
        .attr('y', function (d) {
          return 25 + i++ * lineHeight
        })
        .attr('width', 12)
        .attr('height', 12)
        .attr('fill', function(d) { return color(d.categoryname) })

      i = 0

      list.append('text')
        .attr('x', 30)
        .attr('y', function (d) {
          i++
          return 20 + i * lineHeight
        })
        .text( function (d) {
          return (d.categoryname)
        })

      i = 0

      list.append('text')
        .attr('x', 300)
        .attr('y', function (d) {
          i++
          return 20 + i * lineHeight
        })
        .text( function (d) {
          return d3.format(',.0f')(d.totalcouponredemption)
        })

      i = 0

      list.append('text')
        .attr('x', 370)
        .attr('y', function (d) {
          i++
          return 20 + i * lineHeight
        })
        .text( function (d) {
          return d3.format('.0%')(d.totalcouponredemption/total)
        })

      i = 1
      j = 1

      g.append('line').attr('y1', 23).attr('y2', 23).attr('x1', 0).attr('x2', width/2).attr('stroke', 'grey')

      list.append('line')
        .attr('y1', function() { return 23 + i++ * lineHeight })
        .attr('y2', function() { return 23 + j++ * lineHeight })
        .attr('x1', 0)
        .attr('x2', width/2)
        .attr('stroke', 'grey')
    }
  }
}
