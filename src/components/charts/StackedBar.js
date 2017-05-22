import * as d3 from 'd3'

import services from 'src/modules/services'

export default {
  name: 'stackedbar',
  props: ['groupByField', 'labelField'],
  template: require('components/charts/StackedBar.html'),
  data () {
    return {
      model: nch.model,
      services: nch.services,
      stackedData: []
    }
  },

  watch: {
    model: {
      handler: function (val, oldVal) {
        if (this.groupByField == 'facevalue') {
          this.stackedData = this.getFaceData()
          this.render()
        }
      },
      deep: true
    },
    services: {
      handler: function (val, oldVal) {
        if (this.groupByField == 'facevalue') {
          this.stackedData = this.getFaceData()
          this.render()
        }
      },
      deep: true
    }
  },

  mounted () {
    console.log('Stacked Bar mounted: ')
    if (this.groupByField == 'productmoved') {
      services.getProductMovedPieData().then((response) => {
        this.stackedData = response
        this.render()
      }).catch((message) => {
        console.log('Stacked Bar promise catch:' + message)
      })
    } else if (this.groupByField == 'facevalue') {
      this.stackedData = this.getFaceData()
      this.render()
    }

    var faceValueData = nch.services.dataService.getFaceValueData();
    console.log("Face value data");
    console.log(faceValueData);
  },

  methods: {
    render() {
      var responseData = this.stackedData
      if (responseData.length == 0) {
        return
      }

      var groupBy = this.groupByField

      if (groupBy == 'productmoved') {
        responseData = this.getDataForProductMoved(responseData, this.model.selectedProductMoved.value)
      }

      var svg = d3.select('#stackedBarChart').attr('width', 700).html(''),
        margin = {top: 20, right: 20, bottom: 30, left: 20},
        width = +svg.attr('width') - margin.left - margin.right,
        height = +svg.attr('height') - margin.top - margin.bottom,
        g = svg.append('g').attr('transform', 'translate(' + 180 + ',' + margin.top + ')')

      var x = d3.scaleBand()
        .rangeRound([0, width - 400])
        .paddingInner(0.05)
        .align(0.1)

      var y = d3.scaleLinear()
        .rangeRound([0, height - 80])

      var z = d3.scaleOrdinal()
        .range(['#5B90C6', '#CE6660', '#AAC66C', '#927DB2'])

      var keys

      if (groupBy == 'productmoved') {
        keys = Object.keys(responseData[0]).slice(1)

        for (var i = 0; i < responseData.length; i++) {
          var t = 0
          for (var j in responseData[i]) {
            if (j != 'mfrname') {
              t += responseData[i][j]
            }
          }
          responseData[i].total = t
        }

        responseData.sort(function (a, b) { return b.total - a.total })
        x.domain(responseData.map(function (d) { return d.mfrname }))
        y.domain([d3.max(responseData, function (d) { return d.total }), 0]).nice()
        z.domain(keys)
      } else if (groupBy == 'facevalue') {
        keys = [0, 1, 2, 3]

        x.domain(responseData.map(function (d) { return d.mfrname }))
        y.domain([d3.max(responseData, function (d) {
          return d3.max(d,function (v){
            return v.total
          })
        }), 0]).nice()
        z.domain(keys)
      }

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

      if (groupBy == 'productmoved') {
        this.renderProduct(g, height, x, y, z, responseData, keys)
      } else if (groupBy == 'facevalue') {
        this.renderFaceValue(g, height, x, y, z, responseData, keys)
      }

      svg.selectAll('.oneRect')
        .on('mouseover', svgmouseover)
        .on('mouseout', svgmouseout)

      function svgmouseover (d) {
        console.log(this.parentNode.__data__.key)
        nch.model.selectedPrice = {
          value: this.parentNode.__data__.key,
          flag: true
        }
      }

      function svgmouseout (d) {
        console.log(d)
      }

      g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      this.renderLegend(g, keys, z)
    },

    getDataForMediaTypes (items, selectedMedia) {
      var responseData = [
        {
          'mfrname' : 'General Mills, Inc.',
          '< $0.40' : 0,
          '$0.40 - $0.75' : 0,
          '$0.76 - $1.00' : 0,
          '$1.00 +' : 0
        },
        {
          'mfrname' : 'Comparables',
          '< $0.40' : 0,
          '$0.40 - $0.75' : 0,
          '$0.76 - $1.00' : 0,
          '$1.00 +' : 0
        }
      ]
      for (var i = 0; i < items.length; i++) {
        for (var j = 0; j < responseData.length; j++) {
          if (selectedMedia == '' || selectedMedia == items[i].medianame) {
            var index = 1
            if ('General Mills, Inc.' == items[i].mfrname) {
              index = 0
            } else if ('Comparables' == items[i].mfrname) {
              index = 1
            }

            if (items[i].price < 0.4) {
              responseData[index]['< $0.40'] += items[i].totalcouponredemption
            } else if (items[i].price <= 0.75) {
              responseData[index]['$0.40 - $0.75'] += items[i].totalcouponredemption
            } else if (items[i].price <= 1) {
              responseData[index]['$0.76 - $1.00'] += items[i].totalcouponredemption
            } else {
              responseData[index]['$1.00 +'] += items[i].totalcouponredemption
            }
          }
        }
      }
      return responseData
    },

    getDataForProductMoved (items, selectedProductMoved) {
      var responseData = []

      for (var i = 0; i < items.length; i++) {
        for (var j = 0; j < responseData.length; j++) {
          if ((responseData[j].mfrname == items[i].mfrname) && (selectedProductMoved== '' || selectedProductMoved == items[i].productmoved)) {
            if (!(items[i].period in responseData[j])) {
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

    renderLegend (g, keys, z) {
      var length = keys.length
      var faceLegend = ['< $0.40', '$0.40 - $0.75', '$0.76 - $1.00', '$1.00 +']
      var groupBy = this.groupByField

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
        .attr('transform', function (d, i) {
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
        .text(function (d) {
          if (groupBy == 'facevalue') {
            return faceLegend[d]
          } else {
            return d
          }
        })

      legend.append('line')
        .attr('y1', 35)
        .attr('y2', 35)
        .attr('x1', 25)
        .attr('x2', 125)
        .attr('stroke', 'grey')
        .style('stroke-dasharray','5, 5')
    },

    renderAxis (g, y) {
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
        .text(function (d) {
          return d
        })
        .style('text-anchor', 'end')
        .attr('fill', 'grey')
    },

    renderProduct (g, height, x, y, z, responseData, keys) {

      this.renderAxis(g, y)

      g.append('g')
        .selectAll('g')
        .data(d3.stack().keys(keys)(responseData))
        .enter().append('g')
        .attr('fill', function (d) {
          return z(d.key)
        })
        .selectAll('rect')
        .data(function (d) {
          return d
        })
        .enter().append('rect')
        .attr('class','oneRect')
        .attr('x', function (d, i) {
          return x(d.data.mfrname) + i * 30 + 90
        })
        .attr('y', function (d) {
          return y(d[1])
        })
        .attr('height', function (d) {
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
        .data(function (d) {
          return d
        })
        .enter().append('text')
        .attr('x', function (d, i) {
          return x.bandwidth()/2 + x(d.data.mfrname) + i * 30 + 90
        })
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .attr('y', function (d) {
          return y(d[1]/2 + d[0]/2)
        })
        .text(function (d) {
          if ((d[1]-d[0])/d.data.total > 0.005) {
            return d[1]-d[0]
          }
          else {
            return ''
          }
        })
        .attr('fill', 'black')

      g.append('g')
        .selectAll('text')
        .data(responseData)
        .enter().append('text')
        .attr('x', function (d, i) {
          return x.bandwidth() / 2 + x(d.mfrname) + i * 30 + 90
        })
        .attr('font-weight', 'bold')
        .style('text-anchor', 'middle')
        .attr('y', height - 40)
        .text(function (d) {
          return d.mfrname
        })
    },

    renderFaceValue (g, height, x, y, z, responseData, keys) {

      this.renderAxis(g, y)

      g.append('g')
        .selectAll('g')
        .data(responseData)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
          return 'translate(' + i * 20 + ',' + 0 + ')'
        })
        .selectAll('g')
        .data(function (d) {
          return d3.stack().keys(keys)(d)
        })
        .enter().append('g')
        .attr('fill', function (d) {
          return z(d.key)
        })
        .selectAll('rect')
        .data(function (d) {
          return d
        })
        .enter().append('rect')
        .attr('class','oneRect')
        .attr('x', function (d, i) {
          return x(this.parentNode.parentNode.__data__.mfrname) + i * (x.bandwidth()/2 + 3) + 90
        })
        .attr('y', function (d) {
          return y(d[1])
        })
        .attr('height', function (d) {
          return (((height - 80 - (y(d[1]- d[0])) > 3)?(height - 83 - (y(d[1]- d[0]))):(0)) )
        })
        .attr('width', x.bandwidth()/2)
        .attr('stroke', 'white')
        .attr('stroke-width', '2')
        .style('filter', 'url(#drop-shadow)')

      g.append('g')
        .selectAll('g')
        .data(responseData)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
          return 'translate(' + i * 20 + ',' + 0 + ')'
          })
        .selectAll('g')
        .data(function (d) {
          return d3.stack().keys(keys)(d)
        })
        .enter().append('g')
        .selectAll('g')
        .data(function (d) {
          return d
        })
        .enter().append('text')
        .attr('x', function (d, i) {
          return x.bandwidth()/4 + x(this.parentNode.parentNode.__data__.mfrname) + i * x.bandwidth()/2 + 90
        })
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .attr('y', function (d) {
          return y(d[1]/2 + d[0]/2)
        })
        .text(function (d) {
          if ((d[1]-d[0])/d.data.total > 0.005) {
            return d3.format('.0%')((d[1]-d[0])/d.data.total)
          } else {
            return ''
          }
        })
        .attr('fill', 'black')

      g.append('g')
        .selectAll('text')
        .data(responseData)
        .enter().append('text')
        .attr('x', function (d, i) {
          return x.bandwidth() / 2 + x(d.mfrname) + i * 20 + 90
        })
        .attr('font-weight', 'bold')
        .style('text-anchor', 'middle')
        .attr('y', height - 40)
        .text(function (d) {
          return d.mfrname
        })
    },


    getFaceData () {
      var faceValueData = nch.services.dataService.getFaceValueData()
      var result = []
      for (var k in faceValueData) {
        var newitem = []
        newitem['mfrname'] = faceValueData[k].label
        if (typeof(faceValueData[k]['period1']['data'][1]) == 'undefined' || typeof(faceValueData[k]['period2']['data'][1]) == 'undefined') {
          break
        }
        newitem[0] = {
          0 : faceValueData[k]['period1']['data'][1]['percentage'] * 100,
          1 : faceValueData[k]['period1']['data'][2]['percentage'] * 100,
          2 : faceValueData[k]['period1']['data'][3]['percentage'] * 100,
          3 : faceValueData[k]['period1']['data'][4]['percentage'] * 100,
          total: 100
        }
        newitem[1] = {
          0 : faceValueData[k]['period2']['data'][1]['percentage'] * 100,
          1 : faceValueData[k]['period2']['data'][2]['percentage'] * 100,
          2 : faceValueData[k]['period2']['data'][3]['percentage'] * 100,
          3 : faceValueData[k]['period2']['data'][4]['percentage'] * 100,
          total: 100
        }
        result.push(newitem)
      }
      return result
    }

    // getFaceData () {
    //   var manufacturerData = []
    //   var comparableData = []

    //   if (this.model.timeperiodData == 0) {
    //     for (var i = 0; i < this.model.selectedYear.length; i++) {
    //       var timePeriod = {
    //         type: 'year',
    //         year: this.model.selectedYear[i].year
    //       }
    //       manufacturerData[i] = this.services.dataService.getManufacturerData(timePeriod)
    //       comparableData[i] = this.services.dataService.getComparableData(timePeriod)
    //     }
    //   }

    //   if (this.model.timeperiodData == 1) {
    //     console.log(this.model.timeperiodData, this.model.selectedQuarter)
    //     for (var i = 0; i < this.model.selectedQuarter.length; i++) {
    //       var timePeriod = {
    //         type: 'quarter',
    //         year: this.model.selectedQuarter[i].year,
    //         value: this.model.selectedQuarter[i].value
    //       }
    //       manufacturerData[i] = this.services.dataService.getManufacturerData(timePeriod)
    //       comparableData[i] = this.services.dataService.getComparableData(timePeriod)
    //     }
    //   }

    //   if (this.model.timeperiodData == 2) {
    //     for (var i = 0; i < this.model.selectedWeek.length; i++) {
    //       var timePeriod = {
    //         type: 'week',
    //         year: this.model.selectedWeek[i].year,
    //         month: this.model.selectedWeek[i].month,
    //         value: this.model.selectedWeek[i].value
    //       }
    //       manufacturerData[i] = this.services.dataService.getManufacturerData(timePeriod)
    //       comparableData[i] = this.services.dataService.getComparableData(timePeriod)
    //     }
    //   }
    //   console.log(manufacturerData)
    //   console.log(comparableData)
    // }
  }
}
