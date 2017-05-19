import * as d3 from 'd3'

import services from '../../modules/services'

export default {
  name: 'geo',
  props: ['title', 'geoId', 'graphWidth', 'graphHeight', 'manufacturer'],
  template: require('components/charts/Geo.html'),
  data () {
    return {
      model: nch.model,
      quantile: null,
      rateById: null,
      projection: null,
      path: null
    }
  },
  mounted () {
    services.getRedemptionsByState(this.title).then(this.render).catch((message) => { console.log('Geo promise catch:' + message) })
  },
  methods: {
    render (response) {
      const stateMap = response.states
      const section = response.max / 4
      console.log('max: ' + response.max)
      console.log('section: ' + section)

      // Append Div for tooltip to SVG
      const div = d3.select('body')
        .append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0)

      const projection = d3.geoAlbersUsa()
      projection.scale(this.graphWidth).translate([this.graphWidth / 2, this.graphHeight / 2])

      const path = d3.geoPath().projection(projection)
      const svg = d3.select('#' + this.geoId)
      const colorValues = ['#dae1f3', '#708fa4', '#2e5492', '#0c2244']
      // const color = d3.scaleLinear().range(['rgb(213,222,217)','rgb(69,173,168)','rgb(84,36,55)','rgb(217,91,67)'])
      const color = d3.scaleLinear().range(colorValues)
      const states = Object.keys(stateMap)
      color.domain([0, 1, 2, 3]) // setting the range of the input data

      // Load GeoJSON data and merge with states data
      d3.json('/static/api/us-states.json', function (json) {
        for (let i = 0; i < states.length; i++) {
          const stateAbbrev = states[i]
          const stateName = nch.utils.getStateName(stateAbbrev)
          const stateData = stateMap[stateAbbrev]

          // Find the corresponding state inside the GeoJSON
          for (let j = 0; j < json.features.length; j++) {
            const jsonState = json.features[j].properties.name
            if (stateName === jsonState) {
              json.features[j].properties.redemptions = stateData.redempations
              json.features[j].properties.visited = 3
              if (stateData.redempations < section) {
                json.features[j].properties.visited = 0
              } else if (stateData.redempations < (section * 2)) {
                json.features[j].properties.visited = 1
              } else if (stateData.redempations < (section * 3)) {
                json.features[j].properties.visited = 2
              }
              break
            }
          }
        }

        // Bind the data to the SVG and create one path per GeoJSON feature
        svg.selectAll('path')
          .data(json.features)
          .enter()
          .append('path')
          .attr('d', path)
          .style('stroke', '#fff')
          .style('stroke-width', '1')
          .style('fill', function (d) {
            // Get data value
            const value = d.properties.visited
            if (value) {
              // If value exists…
              return color(value)
            } else {
              // If value is undefined…
              // return 'rgb(213,222,217)'
              return '#d4d4d4' // default
            }
          })
          .on('mouseover', function (d) {
            div.transition()
              .duration(200)
              .style('opacity', '.9')
            div.text(d.properties.name + '\n(' + d.properties.redemptions + ')')
              .style('left', (d3.event.pageX) + 'px')
              .style('top', (d3.event.pageY - 28) + 'px')
          })

          // fade out tooltip on mouse out
          .on('mouseout', function (d) {
            div.transition()
              .duration(500)
              .style('opacity', 0)
          })
      })
    } // end render
  }
}
