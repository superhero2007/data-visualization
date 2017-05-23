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
<<<<<<< HEAD
        this.render()
=======
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
>>>>>>> newStackBarCheck
      },
      deep: true
    }
  },

  mounted () {
    console.log('Stacked Bar mounted: ')
<<<<<<< HEAD
    if (this.groupByField === 'facevalue') {
      services.getStackedBarChartData().then((response) => {
        this.stackedData = response
        this.render()
      }).catch((message) => {
        console.log('Stacked Bar promise catch:' + message)
      })
    } else if (this.groupByField === 'productmoved') {
=======
    if (this.groupByField == 'productmoved') {
>>>>>>> newStackBarCheck
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
<<<<<<< HEAD
  methods: {
    render () {
      const items = this.stackedData
      if (items.length === 0) {
        return
      }

      let responseData = []
      const groupBy = this.groupByField

      if (groupBy === 'facevalue') {
        responseData = this.getDataForMediaTypes(items, this.model.selectedMedia.value)
      } else if (groupBy === 'productmoved') {
        responseData = this.getDataForProductMoved(items, this.model.selectedProductMoved.value)
=======

  methods: {
    render() {
      var responseData = this.stackedData
      if (responseData.length == 0) {
        return
      }

      var groupBy = this.groupByField

      if (groupBy == 'productmoved') {
        responseData = this.getDataForProductMoved(responseData, this.model.selectedProductMoved.value)
>>>>>>> newStackBarCheck
      }

      const svg = d3.select('#stackedBarChart').attr('width', 700).html('')
      const margin = {top: 20, right: 20, bottom: 30, left: 20}
      const width = +svg.attr('width') - margin.left - margin.right
      const height = +svg.attr('height') - margin.top - margin.bottom
      let g = svg.append('g').attr('transform', 'translate(' + 180 + ',' + margin.top + ')')

<<<<<<< HEAD
      let keys
      if (groupBy === 'facevalue') {
        keys = ['$1.00 +', '$0.76 - $1.00', '$0.40 - $0.75', '< $0.40']
      } else if (groupBy === 'productmoved') {
        keys = Object.keys(responseData[0]).slice(1)
      }

      for (let i = 0; i < responseData.length; i++) {
        let t = 0
        let j
        for (j in responseData[i]) {
          if (j !== 'mfrname') {
            t += responseData[i][j]
          }
        }
        if (groupBy === 'facevalue') {
          for (let j in responseData[i]) {
            if (j !== 'mfrname') {
              responseData[i][j] = responseData[i][j] / t * 100
            }
          }
          t = 100
        }
        responseData[i].total = t
      }

      const x = d3.scaleBand()
=======
      var x = d3.scaleBand()
>>>>>>> newStackBarCheck
        .rangeRound([0, width - 400])
        .paddingInner(0.25)
        .align(0.1)

      const y = d3.scaleLinear()
        .rangeRound([0, height - 80])

      const z = d3.scaleOrdinal()
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

<<<<<<< HEAD
      const defs = svg.append('defs')
      const filter = defs.append('filter')
          .attr('id', 'drop-shadow')
          .attr('height', '130%')
=======
      var defs = svg.append('defs')
      var filter = defs.append('filter')
        .attr('id', 'drop-shadow')
        .attr('height', '130%')
>>>>>>> newStackBarCheck

      filter.append('feGaussianBlur')
        .attr('in', 'SourceAlpha')
        .attr('stdDeviation', 2)
        .attr('result', 'blur')

      filter.append('feOffset')
        .attr('in', 'blur')
        .attr('dx', 1)
        .attr('dy', 0)
        .attr('result', 'offsetBlur')

      const feMerge = filter.append('feMerge')

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
        //console.log(this.parentNode.__data__.key)
        nch.model.selectedPrice = {
          value: this.parentNode.__data__.key,
          flag: true
        }
      }

      function svgmouseout (d) {
        //console.log(d)
      }

      g = svg.append('g').attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      this.renderLegend(g, keys, z)
    },

    getDataForMediaTypes (items, selectedMedia) {
<<<<<<< HEAD
      const responseData = []
      for (let i = 0; i < items.length; i++) {
        let j
        for (j = 0; j < responseData.length; j++) {
          if ((responseData[j].mfrname === items[i].mfrname) && (selectedMedia === '' || selectedMedia === items[i].medianame)) {
            if (items[i].price < 0.4) {
              responseData[j]['< $0.40'] += items[i].totalcouponredemption
            } else if (items[i].price <= 0.75) {
              responseData[j]['$0.40 - $0.75'] += items[i].totalcouponredemption
            } else if (items[i].price <= 1) {
              responseData[j]['$0.76 - $1.00'] += items[i].totalcouponredemption
            } else {
              responseData[j]['$1.00 +'] += items[i].totalcouponredemption
            }
            break
          }
        }
        if ((j === responseData.length) && (selectedMedia === '' || selectedMedia === items[i].medianame)) {
          let newItem = {
            'mfrname' : items[i].mfrname,
            '< $0.40' : 0,
            '$0.40 - $0.75' : 0,
            '$0.76 - $1.00' : 0,
            '$1.00 +' : 0
          }
          if (items[i].price < 0.4) {
            newItem['< $0.40'] += items[i].totalcouponredemption
          } else if (items[i].price <= 0.75) {
            newItem['$0.40 - $0.75'] += items[i].totalcouponredemption
          } else if (items[i].price <= 1) {
            newItem['$0.76 - $1.00'] += items[i].totalcouponredemption
          } else {
            newItem['$1.00 +'] += items[i].totalcouponredemption
          }
          responseData.push(newItem)
=======
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
>>>>>>> newStackBarCheck
        }
      }
      return responseData
    },

    getDataForProductMoved (items, selectedProductMoved) {
<<<<<<< HEAD
      const responseData = []

      for (let i = 0; i < items.length; i++) {
        let j
        for (j = 0; j < responseData.length; j++) {
          if ((responseData[j].mfrname === items[i].mfrname) && (selectedProductMoved === '' || selectedProductMoved === items[i].productmoved)) {
=======
      var responseData = []

      for (var i = 0; i < items.length; i++) {
        for (var j = 0; j < responseData.length; j++) {
          if ((responseData[j].mfrname == items[i].mfrname) && (selectedProductMoved== '' || selectedProductMoved == items[i].productmoved)) {
>>>>>>> newStackBarCheck
            if (!(items[i].period in responseData[j])) {
              responseData[j][items[i].period] = 0
            }
            responseData[j][items[i].period] += items[i].totalcouponredemption
            break
          }
        }

        if ((j === responseData.length) && (items[i].totalcouponredemption !== 0) && (selectedProductMoved === '' || selectedProductMoved === items[i].productmoved)) {
          const item = {}
          item['mfrname'] = items[i].mfrname
          item[items[i].period] = items[i].totalcouponredemption
          responseData.push(item)
        }
      }
      return responseData
    },

    renderLegend (g, keys, z) {
<<<<<<< HEAD
      const length = keys.length
=======
      var length = keys.length
      var faceLegend = ['$1.00 +', '$0.76 - $1.00', '$0.40 - $0.75', '< $0.40']
      var groupBy = this.groupByField

>>>>>>> newStackBarCheck
      g.append('g')
        .append('text')
        .attr('x', 10)
        .attr('y', 0)
        .attr('dy', '0.32em')
        .attr('fill', '#000')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'start')
        .text(this.labelField)

      const legend = g.append('g')
        .attr('font-family', 'sans-serif')
        .attr('font-size', 14)
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'start')
        .selectAll('g')
        .data(keys.slice())
        .enter().append('g')
        .attr('transform', function (d, i) {
<<<<<<< HEAD
          return 'translate(20,' + (40 * (length - i) - 20) + ')'
=======
          return 'translate(20,' + ( 40 * (length - i) - 20) + ')'
>>>>>>> newStackBarCheck
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
<<<<<<< HEAD
          return d
=======
          if (groupBy == 'facevalue') {
            return faceLegend[d]
          } else {
            return d
          }
>>>>>>> newStackBarCheck
        })

      legend.append('line')
        .attr('y1', 35)
        .attr('y2', 35)
        .attr('x1', 25)
        .attr('x2', 125)
        .attr('stroke', 'grey')
        .style('stroke-dasharray', '5, 5')
    },

<<<<<<< HEAD
    renderBar (g, height, x, y, z, responseData, keys) {
      const groupBy = this.groupByField
      if (groupBy === 'productmoved') {
        const axisData = y.ticks()

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
          .attr('x2', 420)
          .attr('stroke', 'grey')
          .style('stroke-dasharray', '5, 5')

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
      }
=======
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
>>>>>>> newStackBarCheck

      g.append('g')
        .selectAll('g')
        .data(d3.stack().keys(keys)(responseData))
        .enter().append('g')
<<<<<<< HEAD
        .attr('class', 'oneRect')
=======
>>>>>>> newStackBarCheck
        .attr('fill', function (d) {
          return z(d.key)
        })
        .selectAll('rect')
        .data(function (d) {
          return d
        })
        .enter().append('rect')
<<<<<<< HEAD
=======
        .attr('class','oneRect')
>>>>>>> newStackBarCheck
        .attr('x', function (d, i) {
          return x(d.data.mfrname) + i * 30 + 90
        })
        .attr('y', function (d) {
          return y(d[1])
        })
        .attr('height', function (d) {
<<<<<<< HEAD
          return (((height - 80 - (y(d[1] - d[0])) > 3) ? (height - 83 - (y(d[1] - d[0]))) : (0)))
=======
          return  (((height - 80 - (y(d[1]- d[0])) > 3)?(height - 83 - (y(d[1]- d[0]))):(0)) )
>>>>>>> newStackBarCheck
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
          return x.bandwidth() / 2 + x(d.data.mfrname) + i * 30 + 90
        })
        .style('text-anchor', 'middle')
        .style('font-weight', 'bold')
        .attr('y', function (d) {
<<<<<<< HEAD
          return y(d[1] / 2 + d[0] / 2)
        })
        .text(function (d) {
          if ((d[1] - d[0]) / d.data.total > 0.005) {
            return ((groupBy === 'productmoved') ? (d[1] - d[0]) : (d3.format('.0%')((d[1] - d[0]) / d.data.total)))
          } else {
=======
          return y(d[1]/2 + d[0]/2)
        })
        .text(function (d) {
          if ((d[1]-d[0])/d.data.total > 0.005) {
            return d[1]-d[0]
          }
          else {
>>>>>>> newStackBarCheck
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

      // this.renderAxis(g, y)
      g.append('g')
        .selectAll('g')
        .data(responseData)
        .enter()
        .append('g')
        .attr('transform', function (d, i) {
          return 'translate(' + i * 20 + ',' + 0 + ')'
        })
        .selectAll('g')
        .data(function (d) { return d })
        .enter().append('rect')
        .attr('x', function (d, i) {
          return x(this.parentNode.__data__.mfrname) + i * (x.bandwidth()/2 + 15) + 90
        })
        .attr('y', 0)
        .attr('height', height - 80)
        .attr('width', x.bandwidth()/2)
        .attr('fill', 'transparent')
        .attr('stroke', 'white')
        .attr('stroke-width', '5')
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
          console.log(d)
          return d })
        .enter().append('text')
        .attr('x', function (d, i) {
          return x(this.parentNode.__data__.mfrname) + i * (x.bandwidth()/2 + 15) + 90
        })
        .attr('y', height - 50)
        .attr('font-weight', 'bold')
        .text(function (d) {
          return d.label
        })

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
          return x(this.parentNode.parentNode.__data__.mfrname) + i * (x.bandwidth()/2 + 15) + 90
        })
        .attr('y', function (d) {
          return y(d[1])
        })
        .attr('height', function (d) {
          return height - 80 - y(d[1]- d[0])
        })
        .attr('width', x.bandwidth()/2)
        // .attr('stroke', 'white')
        // .attr('stroke-width', '2')
        // .style('filter', 'url(#drop-shadow)')

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
          return x.bandwidth()/4 + x(this.parentNode.parentNode.__data__.mfrname) + i * (x.bandwidth()/2 + 15) + 90
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
          return x.bandwidth() / 2 + x(d.mfrname) + i * 20 + 100
        })
        .attr('font-weight', 'bold')
        .style('text-anchor', 'middle')
        .attr('y', height - 20)
        .text(function (d) {
          return d.mfrname
        })
    },


    getFaceData () {
      var faceValueData = nch.services.dataService.getFaceValueData()
      var result = []
      var manufacturerData = this.formatData( faceValueData.manufacturer );
      result.push(manufacturerData);
      var comparableData = this.formatData( faceValueData.comparables );
      result.push(comparableData);
      return result
    },


    formatData ( manufacturerData ) {
      var dataList = []
      dataList['mfrname'] = manufacturerData.label

      dataList[0] = {
        0 : manufacturerData['data'][4]['p1Percentage'] * 100,
        1 : manufacturerData['data'][3]['p1Percentage'] * 100,
        2 : manufacturerData['data'][2]['p1Percentage'] * 100,
        3 : manufacturerData['data'][1]['p1Percentage'] * 100,
        total: 100,
        label: '2016 Q1' // TODO: should come from nch.model.firstPeriod
      }
      dataList[1] = {
        0 : manufacturerData['data'][4]['p2Percentage'] * 100,
        1 : manufacturerData['data'][3]['p2Percentage'] * 100,
        2 : manufacturerData['data'][2]['p2Percentage'] * 100,
        3 : manufacturerData['data'][1]['p2Percentage'] * 100,
        total: 100,
        label: '2016 Q2' // TODO: should come from nch.model.firstPeriod
      }

      return dataList;
    }

  }
}
