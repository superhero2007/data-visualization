import * as d3 from 'd3'
import services from 'src/modules/services'

export default {
  name: 'pie',
  props: ['groupByField', 'labelField', 'manufacturerCode', 'chartId'],
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
        if (this.groupByField === 'categoryname') {
          this.pieData = this.getMediaData()
        } else if (this.groupByField === 'medianame') {
          var faceValueData
          if(this.model.selectedItem.selectedMfrname == 'General Mills, Inc')
            faceValueData = nch.services.dataService.getCurrentManufacturerData()
          else
            faceValueData = nch.services.dataService.getComparableData()
          this.pieData = [this.getFaceData(faceValueData)]
        }
        this.render()
      },
      deep: true
    },
    services: {
      handler: function (newValue, oldValue) {
        if (this.groupByField === 'categoryname') {
          this.pieData = this.getMediaData()
        } else if (this.groupByField === 'medianame') {
          var faceValueData
          if(this.model.selectedItem.selectedMfrname == 'General Mills, Inc')
            faceValueData = nch.services.dataService.getCurrentManufacturerData()
          else
            faceValueData = nch.services.dataService.getComparableData()
          this.pieData = [this.getFaceData(faceValueData)]
        }
        this.render()
      },
      deep: true
    }
  },
  mounted () {
    console.log('Pie mounted: ' + this.groupByField + ", manufacturer code: " + this.manufacturerCode );
    if (this.groupByField === 'productmoved') {
      services.getProductMovedPieData().then((response) => {
        this.pieData = response
        this.render()
      }).catch((message) => {
        console.log('Pie promise catch:' + message)
      })
    } else if (this.groupByField === 'categoryname') {
      this.pieData = this.getMediaData()
      this.render()
    } else if (this.groupByField === 'medianame') {
      var faceValueData
      if(this.model.selectedItem.selectedMfrname == 'General Mills, Inc')
        faceValueData = nch.services.dataService.getCurrentManufacturerData()
      else
        faceValueData = nch.services.dataService.getComparableData()
      this.pieData = this.getFaceData(faceValueData)
      this.render()
    }
  },
  methods: {
    render () {
      const svg = d3.select('#' + this.chartId);
      const width = +svg.attr('width')
      const height = +svg.attr('height')
      const radius = Math.min(width , height) / 2

      var j = 0; // HACK: remove
      //for (var j = 0; j < this.pieData.length; j++) {
        //const items = this.pieData[j]
      const items = this.pieData

        if (items.length == 0) {
          return
        }
        let responseData = []

        if (this.groupByField === 'categoryname') {
          responseData = this.getDataForCategories(items, (this.model.selectedItem.selectedMfrname === j))
        } else if (this.groupByField === 'medianame') {
          responseData = this.getDataForMediaTypes(items)
        } else if (this.groupByField === 'productmoved') {
          responseData = this.getDataForProductMoved(items)
        }

        //let g = svg.append('g').attr('transform', 'translate(' + width / 4 + ',' + (height / 2 - 30 + j * height) + ')')
      let g = svg.append("g").attr("transform", "translate( 300," + height / 2 + ")");
        const color = d3.scaleOrdinal( nch.utils.pieColors() );

        let total = 0
        for (let i = 0; i < responseData.length; i++) {
          total += responseData[i].totalcouponredemption
        }

        const pie = d3.pie()
          .sort(null)
          .value(function (d) {
            return d.totalcouponredemption
          })

        const arc = g.selectAll('.arc')
          .data(pie(responseData))
          .enter().append('g')
          .attr('class', 'arc')

        const groupBy = this.groupByField

        if ((groupBy === 'medianame' && this.model.selectedItem.selectedMedia !== '') || (groupBy === 'productmoved' && this.model.selectedItem.selectedProductMoved !== '')) {
          this.renderSelectedMedia(arc, radius, color)
        } else {
          this.renderMediaTypes(arc, radius, color, total, j)
        }

        g = svg.append('g').attr('transform', 'translate(550,-50)')
        this.renderLegend(g, responseData, total, color, j)
      //}
    },

    getDataForCategories (items, filterFlag) {
      const responseData = []
      for (let i = 0; i < items.length; i++) {

        for (let j = 0; j < this.model.selectedCategories.length; j++) {

          if ((this.model.selectedCategories[j].categoryname === items[i].categoryname) &&
            (this.model.selectedItem.selectedMedia === '' || this.model.selectedItem.selectedMedia === items[i].medianame || !filterFlag)) {

            let k
            for (k = 0; k < responseData.length; k++) {
              if ((responseData[k].categoryname === items[i].categoryname)) {
                responseData[k].totalcouponredemption += items[i].totalcouponredemption
                break
              }
            }

            if (k === responseData.length && items[i].totalcouponredemption !== 0) {
              const item = {
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

    getDataForMediaTypes (items) {
      const responseData = []

      for (let i = 0; i < items.length; i++) {
        if(this.model.selectedItem.selectedPrice === '' || this.model.selectedItem.selectedPrice === items[i].selectedPrice)
        {
          let k
          for (k = 0; k < responseData.length; k++) {
            if ((responseData[k].medianame === items[i].medianame)) {
              responseData[k].totalcouponredemption += items[i].totalcouponredemption
              break
            }
          }

          if (k === responseData.length && items[i].totalcouponredemption !== 0) {
            const item = {
              medianame: items[i].medianame,
              totalcouponredemption: items[i].totalcouponredemption
            }
            responseData.push(item)
          }
        }
      }

      return responseData
    },

    getDataForProductMoved (items) {
      const responseData = []

      for (let i = 0; i < items.length; i++) {
        let k
        for (k = 0; k < responseData.length; k++) {
          if ((responseData[k].productmoved === items[i].productmoved)) {
            responseData[k].totalcouponredemption += items[i].totalcouponredemption
            break
          }
        }

        if (k === responseData.length && items[i].totalcouponredemption !== 0) {
          const item = {
            productmoved: items[i].productmoved,
            totalcouponredemption: items[i].totalcouponredemption
          }
          responseData.push(item)
        }
      }

      return responseData
    },

    renderSelectedMedia (arc, radius, color) {
      let groupBy = this.groupByField
      arc.append('circle')
        .attr('r', function (d) {
          return (
            (((groupBy === 'medianame') && (d.data.medianame === nch.model.selectedItem.selectedMedia)) || ((groupBy === 'productmoved') && (d.data.productmoved === nch.model.selectedItem.selectedProductMoved)))
              ? (radius - 10)
              : (0)
          )
        })
        .attr('fill', function (d) { return color(d.data[groupBy]) })
        .attr('stroke', 'white')
        .attr('stroke-width', '3px')
      arc.append('text')
        .attr('font-size', '20')
        .attr('transform', 'translate(0, -20)')
        .text(((groupBy === 'medianame')
            ? (this.model.selectedItem.selectedMedia)
            : (this.model.selectedItem.selectedProductMoved))
          )
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
      arc.append('text')
        .attr('font-weight', 'bold')
        .attr('font-size', '40')
        .attr('transform', 'translate(0, 15)')
        .text('100%')
        .attr('fill', 'white')
        .attr('text-anchor', 'middle')
    },

    renderLegend (g, responseData, total, color, mfrname) {
      const lineHeight = 40
      const groupBy = this.groupByField
      const list = g.selectAll('.list')
        .data(responseData)
        .enter().append('g')
        .attr('class', 'list')

      g.append('g')
        .append('text')
        .attr('x', ((groupBy === 'productmoved') ? (100) : (400)))
        .attr('y', ((groupBy === 'productmoved') ? (20) : (40)))
        .attr('dy', '0.32em')
        .attr('fill', '#000')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .text(this.labelField + ' Legend')

      if (groupBy === 'productmoved') {
        const subtitle = g.append('g')
        subtitle.append('text')
        .attr('x', 40)
        .attr('y', 50)
        .attr('dy', '0.32em')
        .attr('fill', '#000')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'middle')
        .text('OFFER')
        .attr('fill', '#498fe1')

        subtitle.append('text')
        .attr('x', 220)
        .attr('y', 50)
        .attr('dy', '0.32em')
        .attr('fill', '#000')
        .attr('font-weight', 'bold')
        .attr('text-anchor', 'end')
        .text('REDEMPTION')
        .attr('fill', '#498fe1')

        subtitle.append('line')
        .attr('y1', 65)
        .attr('y2', 65)
        .attr('x1', 20)
        .attr('x2', 220)
        .attr('stroke', 'grey')
        .style('stroke-dasharray', '5,5')
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
          return ((groupBy === 'productmoved') ? ('') : (d3.format(',.0f')(d.totalcouponredemption)))
        })
        .attr('text-anchor', 'end')

      list.append('text')
        .attr('x', ((groupBy === 'productmoved') ? (210) : (380)))
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
        .attr('x2', ((groupBy === 'productmoved') ? (220) : (400)))
        .attr('stroke', 'grey')
        .style('stroke-dasharray', '5,5')

      list.append('rect')
        .attr('rx', 10)
        .attr('ry', 10)
        .attr('y', function (d, i) {
          return 65 + i * lineHeight
        })
        .attr('height', lineHeight)
        .attr('x', -10)
        .attr('width', ((groupBy === 'productmoved') ? (230) : (410)))
        .attr('fill', function (d) {
          return color(d[groupBy])
        })
        .attr('fill-opacity', function (d) {
          return (
              ((groupBy === 'medianame' && nch.model.selectedItem.selectedMedia === d.medianame) || (groupBy === 'productmoved' && nch.model.selectedItem.selectedProductMoved === d.productmoved))
                ? (0.2)
                : (0)
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

      function listmouseover (d) {
        if (groupBy === 'productmoved') {
          nch.model.selectedItem.selectedMfrname = ''
          nch.model.selectedItem.selectedProductMoved = d.productmoved
          nch.model.selectedItem.selectedCategory = ''
          nch.model.selectedItem.selectedMedia = ''
          nch.model.selectedItem.selectedPeriod = ''
          nch.model.selectedItem.selectedPrice = ''
          nch.model.selectedItem.flag = 2
        } else if (groupBy === 'medianame') {
          nch.model.selectedItem.selectedMfrname = ''
          nch.model.selectedItem.selectedProductMoved = ''
          nch.model.selectedItem.selectedCategory = ''
          nch.model.selectedItem.selectedMedia = d.medianame
          nch.model.selectedItem.selectedPeriod = ''
          nch.model.selectedItem.selectedPrice = ''
          nch.model.selectedItem.flag = 2
        } else if (groupBy === 'categoryname') {
          nch.model.selectedItem.selectedMfrname = mfrname
          nch.model.selectedItem.selectedProductMoved = ''
          nch.model.selectedItem.selectedCategory = d.categoryname
          nch.model.selectedItem.selectedMedia = ''
          nch.model.selectedItem.selectedPeriod = ''
          nch.model.selectedItem.selectedPrice = ''
          nch.model.selectedItem.flag = 2
        }
      }

      function listmouseout (d) {
        nch.model.selectedItem.selectedMfrname = ''
        nch.model.selectedItem.selectedProductMoved = ''
        nch.model.selectedItem.selectedCategory = ''
        nch.model.selectedItem.selectedMedia = ''
        nch.model.selectedItem.selectedPeriod = ''
        nch.model.selectedItem.selectedPrice = ''
      }
    },

    renderMediaTypes (arc, radius, color, total, mfrname) {
      const groupBy = this.groupByField
      const path = d3.arc()
        .outerRadius(radius - 10)
        .innerRadius(0)
      const out = d3.arc()
        .outerRadius(radius - 6)
        .innerRadius(0)
      const label = d3.arc().outerRadius(radius - 80).innerRadius(radius - 80)
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
        .attr('transform', function (d) {
          return 'translate(' + label.centroid(d) + ')'
        })
        .text(function (d) {
          return d3.format('.0%')(d.data.totalcouponredemption / total)
        })
        .attr('fill', 'white')

      arc.append('path')
        .attr('d', out)
        .attr('class', 'out')
        .attr('fill', 'transparent')

      arc.selectAll('.out')
        .on('mouseover', piemouseover)
        .on('mouseout', piemouseout)

      function piemouseover (d) {
        if (groupBy === 'categoryname') {
          nch.model.selectedItem.selectedMfrname = mfrname
          nch.model.selectedItem.selectedProductMoved = ''
          nch.model.selectedItem.selectedCategory = d.data.categoryname
          nch.model.selectedItem.selectedMedia = ''
          nch.model.selectedItem.selectedPeriod = ''
          nch.model.selectedItem.selectedPrice = ''
          nch.model.selectedItem.flag = 2
        }
      }

      function piemouseout(d) {
        nch.model.selectedItem.selectedMfrname = ''
        nch.model.selectedItem.selectedProductMoved = ''
        nch.model.selectedItem.selectedCategory = ''
        nch.model.selectedItem.selectedMedia = ''
        nch.model.selectedItem.selectedPeriod = ''
        nch.model.selectedItem.selectedPrice = ''
      }
    },

    getFaceData (faceValueData) {
      var responseData = []
      for (var i = 0; i < faceValueData.length; i++) {
        var newItem = {}
        newItem.medianame = faceValueData[i].mediacodename
        newItem.categoryname = faceValueData[i].categoryname
        if (nch.model.selectedItem.selectedPeriod === '2016 Q2' || nch.model.selectedItem.selectedPeriod === 'Period2' || nch.model.selectedItem.selectedPeriod === 2) {
          newItem.totalcouponredemption = faceValueData[i].totalredemptionsp2
        } else {
          newItem.totalcouponredemption = faceValueData[i].totalredemptionsp1
        }
        newItem.selectedPrice = faceValueData[i].facevalueperunitrangecode
        responseData.push(newItem)
      }
      return responseData
    },

    getMediaData () {
      var manufacturerData = nch.services.dataService.getCurrentManufacturerData()
      var comparableData = nch.services.dataService.getComparableData()
      var resultData = []

      var responseData1 = []
      for (var i = 0; i < manufacturerData.length; i++) {
        var newItem = {}
        newItem.medianame = manufacturerData[i].mediacodename
        newItem.categoryname = manufacturerData[i].categoryname
        if (nch.model.selectedItem.selectedMfrname === 0 && nch.model.selectedItem.selectedPeriod === 2) {
          newItem.totalcouponredemption = manufacturerData[i].totalredemptionsp2
        } else {
          newItem.totalcouponredemption = manufacturerData[i].totalredemptionsp1
        }
        newItem.selectedPrice = manufacturerData[i].facevalueperunitrangecode
        responseData1.push(newItem)
      }

      if( this.manufacturerCode != 'ALL' ) {
        return responseData1
      }

      resultData.push(responseData1)

      var responseData2 = []
      for (var i = 0; i < comparableData.length; i++) {
        var newItem = {}
        newItem.medianame = comparableData[i].mediacodename
        newItem.categoryname = comparableData[i].categoryname
        if (nch.model.selectedItem.selectedMfrname === 1 && nch.model.selectedItem.selectedPeriod === 2) {
          newItem.totalcouponredemption = comparableData[i].totalredemptionsp2
        } else {
          newItem.totalcouponredemption = comparableData[i].totalredemptionsp1
        }
        newItem.selectedPrice = comparableData[i].facevalueperunitrangecode
        responseData2.push(newItem)
      }
      resultData.push(responseData2)

      return responseData2;
      //return resultData
    }
  }
}
