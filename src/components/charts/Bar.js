import * as d3 from 'd3'

import services from 'src/modules/services'

export default {
  name: 'bar',
  template: require('components/charts/Bar.html'),
  data () {
    return {
      model: nch.model,
      barData: {}
    }
  },

  watch: {
    model: {
      handler:function(val, oldVal){
        this.render()
      },deep: true
    }
  },

  mounted() {
    services.getRedemptionsByMedia().then( (response) => {
      this.barData = response
      this.render()
    }).catch( (message) => { console.log('Bar promise catch:' + message) })
  },
  methods: {

    render() {
      var items = this.barData
      var min = 10000000
      var max = -1
      var mediaMap = {}
      var responseData = { min: 0, max: 0, mediaData: mediaMap }

      for( var i = 0 ; i < items.length ; i++ ) {
        var item = items[i]
        var currentData = null

        for( var j = 0 ; j < this.model.selectedCategories.length ; j ++ ) {
          if( (item['categoryname'] == this.model.selectedCategories[j]) && (this.model.selectedCategory.value == '' || this.model.selectedCategory.value == item['categoryname']))
          {
            break
          }
        }

        if( j == this.model.selectedCategories.length)
          continue

        if( mediaMap[ item['medianame'] ] ) {
          currentData = mediaMap[ item['medianame'] ]
        }
        else {
          currentData = { name: item['medianame'], redempations: 0, redempationValue: 0 }
          mediaMap[ item['medianame'] ] = currentData
        }

        //currentData.redempations += item['totalcouponredemption']
        //currentData.redempationValue += item['totalcouponredemeedvalue']
        currentData.redempations += item['totalcouponredemeedvalue']
        currentData.redempationValue += item['totalcouponredemption']

        if( currentData.redempations < min ) {
          min = currentData.redempations
        }

        if( currentData.redempations > max ) {
          max = currentData.redempations
        }
      }

      var mediaTypes = Object.keys( mediaMap )
      responseData.min = min
      responseData.max = max

      var data = Object.keys(responseData.mediaData).map(function (d) { return responseData.mediaData[d] } )
      var svg = d3.select('#barChart').html(''),
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
        .attr('height', function(d){
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
          return y(d.redempationValue) + (height - y(d.redempationValue)) * 0.1-  5
        })
        .style('text-anchor', 'middle')
        .text(function (d) {
          return d3.format(',.0f')(d.redempationValue)
        })

        if( this.model.selectedCategory.flag )
        {
          g.selectAll('.bar')
            .attr('y', height)
            .attr('height', 1)
            .transition()
            .duration(1000)
            .attr('height', function(d){
              return (height - y(d.redempationValue)) * 0.9
            })
            .attr('y', function (d) {
              return y(d.redempationValue) + (height - y(d.redempationValue)) * 0.1
            })

          g.selectAll('.barValue')
            .attr('y', height)
            .transition()
            .duration(1000)
            .attr('y', function (d) {
              return y(d.redempationValue) + (height - y(d.redempationValue)) * 0.1-  5
            })
        }

       g.selectAll('rect')
          .on('mouseover', barmouseover)
          .on('mouseout', barmouseout)
      //})
      function barmouseover (d) {
        if(nch.model.selectedMedia.value != d.name)
        {
          nch.model.selectedMedia = 
          {
            value: d.name,
            flag: true
          }
          nch.model.selectedCategory =
          {
            value: '',
            flag: false
          }
        }
      }

      function barmouseout (d) {
        nch.model.selectedMedia = 
        {
          value: '',
          flag: true
        }
        nch.model.selectedCategory =
        {
          value: '',
          flag: false
        }
      }

    }

  }
}
