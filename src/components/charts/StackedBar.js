import * as d3 from 'd3'

import services from 'src/modules/services'

export default {
  name: 'stackedbar',
  props: ['groupByField', 'labelField'],
  template: require('components/charts/StackedBar.html'),
  data () {
    return {
      model: nch.model,
      stackedData: []
    }
  },

  watch: {
    model: {
      handler:function(val, oldVal) {
        this.render()
      },deep: true
    }
  },

  mounted() {
    console.log('Stacked Bar mounted: ')
    if(this.groupByField == 'facevalue') {
      services.getStackedBarChartData().then((response) => {
        this.stackedData = response
        this.render()
      }).catch((message) => {
        console.log('Stacked Bar promise catch:' + message)
      })
    }
    else if(this.groupByField == 'productmoved') {
      services.getProductMovedPieData().then((response) => {
        this.stackedData = response
        this.render()
      }).catch((message) => {
        console.log('Stacked Bar promise catch:' + message)
      })
    }
  },
  methods: {

    render() {
      var items = this.stackedData
      if(items.length == 0)
        return

      var responseData = []
      var groupBy = this.groupByField

      if(groupBy == 'facevalue') {
        responseData = this.getDataForMediaTypes(items, this.model.selectedMedia.value)
      }
      else if(groupBy == 'productmoved') {
        responseData = this.getDataForProductMoved(items, this.model.selectedProductMoved.value)
      }

      var svg = d3.select('#stackedBarChart').attr('width', 700).html(''),
        margin = {top: 20, right: 20, bottom: 30, left: 20},
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom,
        g = svg.append('g').attr('transform', 'translate(' + 180 + ',' + margin.top + ')')

      var keys 
      if(groupBy == 'facevalue') {
        keys= ['$1.00 +', '$0.76 - $1.00', '$0.40 - $0.75', '< $0.40']
      }
      else if(groupBy == 'productmoved') {
        keys = Object.keys(responseData[0]).slice(1)
      }

      for (var i = 0; i < responseData.length; i++) {
        var t = 0
        for (var j in responseData[i]) {
          if(j != 'mfrname')
            t += responseData[i][j]
        }
        if(groupBy == 'facevalue') {
          for (var j in responseData[i]) {
            if(j != 'mfrname')
              responseData[i][j] = responseData[i][j] / t * 100
          }
          t = 100
        }
        responseData[i].total = t
      }

      var x = d3.scaleBand()
        .rangeRound([0, width - 400])
        .paddingInner(0.05)
        .align(0.1)

      var y = d3.scaleLinear()
        .rangeRound([0, height - 80])

      var z = d3.scaleOrdinal()
        .range(['#5B90C6', '#CE6660', '#AAC66C', '#927DB2'])

      responseData.sort(function(a, b) { return b.total - a.total })
      x.domain(responseData.map(function(d) { return d.mfrname }))
      y.domain([d3.max(responseData, function(d) { return d.total }),0]).nice()
      z.domain(keys)

      var defs = svg.append('defs')
      var filter = defs.append('filter')
          .attr('id', 'drop-shadow')
          .attr('height', '130%')

      filter.append('feGaussianBlur')
          .attr('in', 'SourceAlpha')
          .attr('stdDeviation', 2)
          .attr('result', 'blur')

      filter.append('feOffset')
          .attr('in', 'blur')
          .attr('dx', 1)
          .attr('dy', 0)
          .attr('result', 'offsetBlur')

      var feMerge = filter.append('feMerge')

      feMerge.append('feMergeNode')
          .attr('in', 'offsetBlur')
      feMerge.append('feMergeNode')
          .attr('in', 'SourceGraphic')

      this.renderBar(g, height, x, y, z, responseData, keys)

      g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      this.renderLegend(g, keys, z)
    },

    getDataForMediaTypes(items, selectedMedia) {
      var responseData = []
      for (var i = 0; i < items.length; i++) {
        for (var j = 0; j < responseData.length; j++) {
          if((responseData[j].mfrname == items[i].mfrname) && (selectedMedia == '' || selectedMedia == items[i].medianame)) {
            if(items[i].price < 0.4)
              responseData[j]['< $0.40'] += items[i].totalcouponredemption
            else if(items[i].price <= 0.75)
              responseData[j]['$0.40 - $0.75'] += items[i].totalcouponredemption
            else if(items[i].price <= 1)
              responseData[j]['$0.76 - $1.00'] += items[i].totalcouponredemption
            else
              responseData[j]['$1.00 +'] += items[i].totalcouponredemption
            break
          }
        }
        if((j == responseData.length) && (selectedMedia == '' || selectedMedia == items[i].medianame)) {
          var newItem = {
            'mfrname' : items[i].mfrname,
            '< $0.40' : 0,
            '$0.40 - $0.75' : 0,
            '$0.76 - $1.00' : 0,
            '$1.00 +' : 0
          }
          if(items[i].price < 0.4)
            newItem['< $0.40'] += items[i].totalcouponredemption
          else if(items[i].price <= 0.75)
            newItem['$0.40 - $0.75'] += items[i].totalcouponredemption
          else if(items[i].price <= 1)
            newItem['$0.76 - $1.00'] += items[i].totalcouponredemption
          else
            newItem['$1.00 +'] += items[i].totalcouponredemption
          responseData.push(newItem)
        }
      }
      return responseData
    },

    getDataForProductMoved(items, selectedProductMoved) {
      var responseData = []

      for (var i = 0; i < items.length; i++) {
        for (var j = 0; j < responseData.length; j++) {
          if((responseData[j].mfrname == items[i].mfrname) && (selectedProductMoved== '' || selectedProductMoved == items[i].productmoved)) {
            if (!(items[i].period in responseData[j])){
              responseData[j][items[i].period] = 0
            }
            responseData[j][items[i].period] += items[i].totalcouponredemption
            break
          }
        }

        if ((j == responseData.length) && (items[i].totalcouponredemption != 0) && (selectedProductMoved== '' || selectedProductMoved == items[i].productmoved)) {
          var item = {}
          item['mfrname'] = items[i].mfrname
          item[items[i].period] = items[i].totalcouponredemption
          responseData.push(item)
        }
      }

      return responseData
    },

    renderLegend(g, keys, z) {
      var length = keys.length

      g.append('g')
        .append('text')
        .attr('x', 10)
        .attr('y', 0)
        .attr('dy', '0.32em')
        .attr('fill', '#000')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'start')
        .text(this.labelField)

      var legend = g.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 14)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'start')
        .selectAll('g')
        .data(keys.slice())
        .enter().append('g')
        .attr('transform', function(d, i) {
          return 'translate(20,' + ( 40 * (length - i) - 20) + ')'
        })

      legend.append('circle')
        .attr('r', 15)
        .attr('cx', 0)
        .attr('cy', 20)
        .attr('fill', z)
        .attr('stroke', 'white')
        .attr('stroke-width', '3px')

      legend.append('text')
        .attr('x', 25)
        .attr('y', 20)
        .attr('dy', '0.32em')
        .text(function(d) {
          return d
        })

      legend.append('line')
        .attr('y1', 35)
        .attr('y2', 35)
        .attr('x1', 25)
        .attr('x2', 125)
        .attr('stroke', 'grey')
        .style('stroke-dasharray','5, 5')
    },

    renderBar(g, height, x, y, z, responseData, keys) {
      var groupBy = this.groupByField
      if(groupBy == 'productmoved') {
        var axisData = y.ticks()

        g.append('g')
          .selectAll('g')
          .data(axisData)
          .enter().append('line')
          .attr('y1', function (d) {
            return y(d)
          })
          .attr('y2', function (d) {
            return y(d)
          })
          .attr('x1', 60)
          .attr('x2', 420 )
          .attr('stroke', 'grey')
          .style('stroke-dasharray','5, 5')

        g.append('g')
          .selectAll('g')
          .data(axisData)
          .enter().append('text')
          .attr('y', function (d) {
            return y(d) + 5
          })
          .attr('x', 50)
          .text(function(d) {
            return d
          })
          .style('text-anchor', 'end')
          .attr('fill', 'grey')
      }

      g.append('g')
        .selectAll('g')
        .data(d3.stack().keys(keys)(responseData))
        .enter().append('g')
        .attr('class','oneRect')
        .attr('fill', function(d) {
          return z(d.key)
        })
        .selectAll('rect')
        .data(function(d) {
          return d
        })
        .enter().append('rect')
        .attr('x', function(d, i) {
          return x(d.data.mfrname) + i * 30 + 90
        })
        .attr('y', function(d) {
          return y(d[1])
        })
        .attr('height', function(d) {
          return  (((height - 80 - (y(d[1]- d[0])) > 3)?(height - 83 - (y(d[1]- d[0]))):(0)) )
        })
        .attr('width', x.bandwidth())
        .attr('stroke', 'white')
        .attr('stroke-width', '2')
        .style('filter', 'url(#drop-shadow)')

      g.append('g')
        .selectAll('g')
        .data(d3.stack().keys(keys)(responseData))
        .enter().append('g')
        .selectAll('g')
        .data(function(d) {
          return d
        })
        .enter().append('text')
        .attr('x', function (d, i) {
          return x.bandwidth()/2 + x(d.data.mfrname) + i * 30 + 90
        })
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .attr('y', function(d) {
          return y(d[1]/2 + d[0]/2)
        })
        .text(function(d) {
          if((d[1]-d[0])/d.data.total > 0.005)
            return ((groupBy == 'productmoved')?(d[1]-d[0]):(d3.format('.0%')((d[1]-d[0])/d.data.total)))
          else
            return ''
        })
        .attr('fill', 'black')

      g.append('g')
        .selectAll('text')
        .data(responseData)
        .enter().append('text')
        .attr('x', function (d, i) {
          return x.bandwidth()/2 + x(d.mfrname) + i * 30 + 90
        })
        .attr('font-weight', 'bold')
        .style('text-anchor', 'middle')
        .attr('y', height - 40)
        .text(function(d) {
          return d.mfrname
        })
    }
  }
}
