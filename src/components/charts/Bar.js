import * as d3 from 'd3'

import services from 'src/modules/services'

export default {
  name: 'bar',
  template: require('components/charts/Bar.html'),
  data () {
    return {
      model: nch.model
    }
  },
  mounted() {
    services.getRedemptionsByMedia().then( this.render ).catch( (message) => { console.log('Bar promise catch:' + message) })
  },
  methods: {

    render( response ) {

      var data = Object.keys(response.mediaData).map(function (d) { return response.mediaData[d] } )
      var svg = d3.select('#barChart'),
        margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom

      var x = d3.scaleBand().rangeRound([0, width]).padding(0.1),
        y = d3.scaleLinear().rangeRound([height, 0])

      var g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      // d3.tsv('/static/api/bar-example.tsv', function(d) {
      //   d.frequency = +d.frequency
      //   return d
      // }, function(error, data) {
      //   if (error) throw error

      x.domain(data.map(function (d) {
        return d.name
      }))
      y.domain([0, d3.max(data, function (d) {
        return d.redempationValue
      })])

      // var dataArray = Object.keys( data ).map(function (d) { return data[d].redempationValue } )
      //
      // x.domain( Object.keys( data ) )
      // y.domain([0, d3.max(dataArray, function (d) {
      //   return d
      // })])

      g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))

      // g.append('g')
      //   .attr('class', 'axis axis--y')
      //   .call(d3.axisLeft(y).ticks(10, '%'))
      //   .append('text')
      //   .attr('transform', 'rotate(-90)')
      //   .attr('y', 6)
      //   .attr('dy', '0.71em')
      //   .attr('text-anchor', 'end')
      //   .text('Frequency')

      g.selectAll('.bar')
        .data(data)
        .enter().append('rect')
        .attr('class', 'bar')
        .attr('x', function (d) {
          return x(d.name)
        })
        .attr('y', function (d) {
          return y(d.redempationValue) + (height - y(d.redempationValue)) * 0.1
        })
        .attr('width', x.bandwidth())
        .attr('height', function (d) {
          return (height - y(d.redempationValue)) * 0.9
        })

      g.selectAll('.barValue')
        .data(data)
        .enter().append('text')
        .attr('class', 'barValue')
        .attr('x', function (d) {
          return x(d.name)+x.bandwidth()/2
        })
        .attr('y', function (d) {
          return y(d.redempationValue) + (height - y(d.redempationValue)) * 0.1 - 5
        })
        .style('text-anchor', 'middle')
        .text(function (d) {
          return d3.format(',.0f')(d.redempationValue)
        })
      //})

    }

  }
}
