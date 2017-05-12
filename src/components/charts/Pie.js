import * as d3 from 'd3'

import services from 'src/modules/services'

export default {
  name: 'pie',
  props: ['groupByField', 'labelField'],
  template: require('components/charts/Pie.html'),
  data () {
    return {
      model: nch.model,
      pieData: []
    }
  },

  watch: {
    model: {
      handler: function (newValue, oldValue) {
        this.render()
      }, deep: true
    }
  },

  mounted() {
    console.log('Pie mounted: ' + this.groupByField)
    if(this.groupByField != 'productmoved') {
      services.getPieData().then((response) => {
        this.pieData = response
        this.render()
      }).catch((message) => {
        console.log('Pie promise catch:' + message)
      })
    }
    else {
      services.getProductMovedPieData().then((response) => {
        this.pieData = response
        this.render()
      }).catch((message) => {
        console.log('Pie promise catch:' + message)
      })
    }
  },
  methods: {

    render() {
      var items = this.pieData

      var responseData = []

      if (this.groupByField == 'categoryname') {
        responseData = this.getDataForCategories(items)
      }
      else if (this.groupByField == 'medianame') {
        responseData = this.getDataForMediaTypes(items)
      }
      else if (this.groupByField == 'productmoved') {
        responseData = this.getDataForProductMoved(items)
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

      var total = 0
      for (var i = 0; i < responseData.length; i++) {
        total += responseData[i].totalcouponredemption
      }

      var pie = d3.pie()
        .sort(null)
        .value(function (d) {
          return d.totalcouponredemption
        })

      var arc = g.selectAll('.arc')
        .data(pie(responseData))
        .enter().append('g')
        .attr('class', 'arc')

      var groupBy = this.groupByField

      if((groupBy == 'medianame' && this.model.selectedMedia.value != '') || (groupBy == 'productmoved' && this.model.selectedProductMoved.value != '')) {
        this.renderSelectedMedia(arc, radius, color)
      }
      else {
        this.renderMediaTypes(arc, radius, color, total)
      }

      g = svg.append('g').attr('transform', 'translate(' + (width / 2 ) + ',' + 0 + ')')
      this.renderLegend(g, responseData, total, color)
    },

    getDataForCategories(items) {
      var responseData = []

      for (var i = 0; i < items.length; i++) {

        for (var j = 0; j < this.model.selectedCategories.length; j++) {
          if ((this.model.selectedCategories[j] == items[i].categoryname) && (this.model.selectedMedia.value == '' || this.model.selectedMedia.value == items[i].medianame)) {
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

      return responseData
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

      return responseData
    },

    getDataForProductMoved(items) {
      var responseData = []

      for (var i = 0; i < items.length; i++) {

        for (var k = 0; k < responseData.length; k++) {
          if ((responseData[k].productmoved == items[i].productmoved)) {
            responseData[k].totalcouponredemption += items[i].totalcouponredemption
            break
          }
        }

        if (k == responseData.length && items[i].totalcouponredemption != 0) {
          var item = {
            productmoved: items[i].productmoved,
            totalcouponredemption: items[i].totalcouponredemption
          }
          responseData.push(item)
        }
      }

      return responseData
    },

    renderSelectedMedia(arc, radius, color) {
      var groupBy = this.groupByField
      arc.append('circle')
        .attr('r', function (d) {
          return (
            (((groupBy == 'medianame') && (d.data.medianame == nch.model.selectedMedia.value))
              || ((groupBy == 'productmoved') && (d.data.productmoved == nch.model.selectedProductMoved.value)))
            ?(radius - 10)
            :(0)
          )
        })
        .attr('fill', function (d) {
            return color(d.data[groupBy])
        })
        .attr('stroke', 'white')
        .attr('stroke-width', '3px')
      arc.append('text')
        .attr('font-size', '20')
        .attr('transform', 'translate(0, -20)')
        .text(
            ((groupBy == 'medianame')
            ?(this.model.selectedMedia.value)
            :(this.model.selectedProductMoved.value))
          )
        .attr('fill','white')
        .attr('text-anchor', 'middle')

      arc.append('text')
        .attr('font-weight', 'bold')
        .attr('font-size', '40')
        .attr('transform', 'translate(0, 15)')
        .text('100%')
        .attr('fill','white')
        .attr('text-anchor', 'middle')
    },

    renderLegend(g, responseData, total, color) {
      var lineHeight = 40
    	var groupBy = this.groupByField
      var list = g.selectAll('.list')
        .data(responseData)
        .enter().append('g')
        .attr('class', 'list')

      g.append('g')
        .append('text')
        .attr('x', ((groupBy == 'productmoved')?(100):(200)))
        .attr('y', ((groupBy == 'productmoved')?(20):(40)))
        .attr('dy', '0.32em')
        .attr('fill', '#000')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .text(this.labelField + ' Legend')

      if(groupBy == 'productmoved') {
        var subtitle= g.append('g')
        subtitle.append('text')
        .attr('x', 40)
        .attr('y', 50)
        .attr('dy', '0.32em')
        .attr('fill', '#000')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .text('OFFER')
        .attr('fill','#498fe1')

        subtitle.append('text')
        .attr('x', 220)
        .attr('y', 50)
        .attr('dy', '0.32em')
        .attr('fill', '#000')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'end')
        .text('REDEMPTION')
        .attr('fill','#498fe1')

        subtitle.append('line')
        .attr('y1', 65)
        .attr('y2', 65)
        .attr('x1', 20)
        .attr('x2', 220)
        .attr('stroke', 'grey')
        .style('stroke-dasharray','5,5')
      }

      list.append('text')
        .attr('x', 20)
        .attr('y', function (d, i) {
          return 90 + i * lineHeight
        })
        .attr('font-weight', 'bold')
        .text(function (d) {
          return (d[groupBy])
        })

      list.append('text')
        .attr('x', 320)
        .attr('y', function (d, i) {
          return 90 + i * lineHeight
        })
        .attr('font-weight', 'bold')
        .text(function (d) {
          return ((groupBy == 'productmoved')?(''):(d3.format(',.0f')(d.totalcouponredemption)))
        })
        .attr('text-anchor', 'end')

      list.append('text')
        .attr('x', ((groupBy == 'productmoved')?(210):(380)))
        .attr('y', function (d, i) {
          return 90 + i * lineHeight
        })
        .attr('font-weight', 'bold')
        .text(function (d) {
          return d3.format('.0%')(d.totalcouponredemption / total)
        })
        .attr('text-anchor', 'end')

      list.append('line')
        .attr('y1', function (d, i) {
          return 105 + i * lineHeight
        })
        .attr('y2', function (d, i) {
          return 105 + i * lineHeight
        })
        .attr('x1', 20)
        .attr('x2', ((groupBy == 'productmoved')?(220):(400)))
        .attr('stroke', 'grey')
        .style('stroke-dasharray','5,5')

      list.append('rect')
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('y', function (d, i) {
          return 65 + i * lineHeight
        })
        .attr('height', lineHeight)
        .attr('x', -10)
        .attr('width', ((groupBy == 'productmoved')?(230):(410)))
        .attr('fill', function (d) {
          return color(d[groupBy])
        })
        .attr('fill-opacity', function (d) {
          return (
              ((groupBy == 'medianame' && nch.model.selectedMedia.value == d.medianame)
                ||(groupBy == 'productmoved' && nch.model.selectedProductMoved.value == d.productmoved))
              ?(0.2)
              :(0)
            )
        })
        .attr('class', 'listRect')

      list.append('circle')
        .attr('r', 15)
        .attr('cx', 0)
        .attr('cy', function (d, i) {
          return 85 + i * lineHeight
        })
        .attr('stroke', 'white')
        .attr('stroke-width', '3px')
        .attr('fill', function (d) {
          return color(d[groupBy])
        })

      g.selectAll('.listRect')
        .on('mouseover', listmouseover)
        .on('mouseout', listmouseout)

      function listmouseover(d) {
        if(typeof(d.productmoved)!='undefined') {
          if(nch.model.selectedProductMoved.value != d.productmoved) {
            nch.model.selectedProductMoved = {
              value: d.productmoved,
              flag: true
            }
          }
        }
        else if(typeof(d.categoryname)=='undefined') {
          if(nch.model.selectedMedia.value != d.medianame) {
            nch.model.selectedMedia = {
              value: d.medianame,
              flag: true
            }
            nch.model.selectedCategory = {
              value: '',
              flag: false
            }
          }
        }
        else {
          if(nch.model.selectedCategory.value != d.categoryname) {
            nch.model.selectedCategory = {
              value: d.categoryname,
              flag: true
            }
            nch.model.selectedMedia = {
              value: '',
              flag: false
            }
          }
        }
      }

      function listmouseout(d) {
        if(typeof(d.productmoved)!='undefined') {
          nch.model.selectedProductMoved.value =''
        }
        else if(typeof(d.categoryname)=='undefined') {
          nch.model.selectedMedia.value = ''
        }
        else {
          nch.model.selectedCategory.value = ''
        }
      }
    },

    renderMediaTypes(arc, radius, color, total) {
    	var groupBy = this.groupByField
      var path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0)

      var out = d3.arc()
        .outerRadius(radius - 6)
        .innerRadius(0)

      var label = d3.arc()
      	.outerRadius(radius - 80)
      	.innerRadius(radius - 80)

    	arc.append('path')
        .attr('d', out)
        .attr('class', 'path')
        .attr('fill', 'white')

      arc.append('path')
        .attr('d', path)
        .attr('class', 'path')
        .attr('fill', function (d) {
          return color(d.data[groupBy])
        })

      arc.append('text')
        .attr('font-weight', 'bold')
        .attr('transform', function(d) {
          return 'translate(' + label.centroid(d) + ')'
        })
        .text(function(d) {
          return d3.format('.0%')(d.data.totalcouponredemption / total)
        })
        .attr('fill','white')

      arc.append('path')
        .attr('d', out)
        .attr('class', 'out')
        .attr('fill', 'transparent')

      arc.selectAll('.out')
        .on('mouseover', piemouseover)
        .on('mouseout', piemouseout)

      function piemouseover(d) {
        if(nch.model.selectedCategory.value != d.data.categoryname) {
          nch.model.selectedCategory = {
            value: d.data.categoryname,
            flag: true
          }
          nch.model.selectedMedia = {
            value: '',
            flag: false
          }
        }
      }

      function piemouseout(d) {
        nch.model.selectedCategory = {
          value: '',
          flag: true
        }
        nch.model.selectedMedia = {
          value: '',
          flag: false
        }
      }
    }
  }
}
