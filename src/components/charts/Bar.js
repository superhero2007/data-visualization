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
      handler: function (val, oldVal) {
        this.render()
      },
      deep: true
    }
  },

  mounted () {
    services.getRedemptionsByMedia().then((response) => {
      this.barData = response
      this.render()
    }).catch((message) => { console.log('Bar promise catch:' + message) })
  },
  methods: {
    render () {
      const items = this.barData
      let min = 10000000
      let max = -1
      let mediaMap = {}
      let responseData = { min: 0, max: 0, mediaData: mediaMap }

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        let currentData = null

        for (let j = 0; j < this.model.selectedCategories.length; j++) {
          if ((item['categoryname'] === this.model.selectedCategories[j]) && (this.model.selectedCategory.value === '' || this.model.selectedCategory.value === item['categoryname'])) {
            break
          }
        }

        // if (j === this.model.selectedCategories.length) {
        //   continue
        // }

        if (mediaMap[ item['medianame'] ]) {
          currentData = mediaMap[ item['medianame'] ]
        } else {
          currentData = { name: item['medianame'], redempations: 0, redempationValue: 0 }
          mediaMap[ item['medianame'] ] = currentData
        }

        // currentData.redempations += item['totalcouponredemption']
        // currentData.redempationValue += item['totalcouponredemeedvalue']
        currentData.redempations += item['totalcouponredemeedvalue']
        currentData.redempationValue += item['totalcouponredemption']

        if (currentData.redempations < min) {
          min = currentData.redempations
        }

        if (currentData.redempations > max) {
          max = currentData.redempations
        }
      }

      // const mediaTypes = Object.keys(mediaMap)
      responseData.min = min
      responseData.max = max

      const data = Object.keys(responseData.mediaData).map(function (d) { return responseData.mediaData[d] } )
      const svg = d3.select('#barChart').html('')
      const margin = {top: 20, right: 20, bottom: 30, left: 40}
      const width = +svg.attr('width') - margin.left - margin.right
      const height = +svg.attr('height') - margin.top - margin.bottom

      const x = d3.scaleBand().rangeRound([0, width]).padding(0.1)
      const y = d3.scaleLinear().rangeRound([height, 0])

      const g = svg.append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')

      x.domain(data.map(function (d) {
        return d.name
      }))
      y.domain([0, d3.max(data, function (d) {
        return d.redempationValue
      })])

      g.append('g')
        .attr('class', 'axis axis--x')
        .attr('transform', 'translate(0,' + height + ')')
        .call(d3.axisBottom(x))

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
          return x(d.name) + x.bandwidth() / 2
        })
        .attr('y', function (d) {
          return y(d.redempationValue) + (height - y(d.redempationValue)) * 0.1 -  5
        })
        .style('text-anchor', 'middle')
        .text(function (d) {
          return d3.format(',.0f')(d.redempationValue)
        })

      if (this.model.selectedCategory.flag) {
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
      // })
      function barmouseover (d) {
        if (nch.model.selectedMedia.value !== d.name) {
          nch.model.selectedMedia = {
            value: d.name,
            flag: true
          }
          nch.model.selectedCategory = {
            value: '',
            flag: false
          }
        }
      }

      function barmouseout (d) {
        nch.model.selectedMedia = {
          value: '',
          flag: true
        }
        nch.model.selectedCategory = {
          value: '',
          flag: false
        }
      }
    }
  }
}
