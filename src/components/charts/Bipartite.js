import * as d3 from 'd3'
var vis = require('imports-loader?d3=d3!../../vendor/viz.js')

import services from 'src/modules/services'

export default {
  name: 'bipartite',
  template: require('components/charts/Bipartite.html'),
  data () {
    return {
      model: nch.model,
    }
  },
  mounted() {
    services.getBipartiteData().then(this.render).catch((message) => { console.log('Bipartite promise catch:' + message) })
  },

  methods: {

    var color ={"FSI":"#3366CC", "Handout Electronic Checkout":"#DC3912",  "Military":"#FF9900", "Print At Home":"#109618", "Unknown":"#990099"};
    var svg = d3.select("#bipartiteGraph").attr("width", 960).attr("height", 880);

    svg.append("text").attr("x",250).attr("y",70)
      .attr("class","header").text("Total redemptions");

    svg.append("text").attr("x",750).attr("y",70)
      .attr("class","header").text("Total");

      var g = [svg.append('g').attr('transform', 'translate(150,100)')
        , svg.append('g').attr('transform', 'translate(650,100)')]

      var chartHeight = 700;

      var bp = [viz.bP()
        .data(jsonData)
        .min(12)
        .pad(1)
        .height(chartHeight)
        .width(200)
        .barSize(35)
        .fill(d => color[d.primary])
        , viz.bP()
          .data(jsonData)
          .value(d => d[3])
          .min(12)
          .pad(1)
          .height(chartHeight)
          .width(200)
          .barSize(35)
          .fill(d => color[d.primary])
      ];

      [0, 1].forEach(function (i) {
        g[i].call(bp[i])

        g[i].append('text').attr('x', -50).attr('y', -8).style('text-anchor', 'middle').text('Channel')
        g[i].append('text').attr('x', 250).attr('y', -8).style('text-anchor', 'middle').text('State')

        g[i].append('line').attr('x1', -100).attr('x2', 0)
        g[i].append('line').attr('x1', 200).attr('x2', 300)

        g[i].append('line').attr('y1', 610).attr('y2', 610).attr('x1', -100).attr('x2', 0)
        g[i].append('line').attr('y1', 610).attr('y2', 610).attr('x1', 200).attr('x2', 300)

        g[i].selectAll('.mainBars')
          .on('mouseover', mouseover)
          .on('mouseout', mouseout)

        g[i].selectAll('.mainBars').append('text').attr('class', 'label')
          .attr('x', d => (d.part == 'primary' ? -30 : 30))
          .attr('y', d => +6)
          .text(d => d.key)
          .attr('text-anchor', d => (d.part == 'primary' ? 'end' : 'start'))

        g[i].selectAll(".mainBars").append("text").attr("class","perc")
          .attr("x",d=>(d.part=="primary"? -100: 80))
          .attr("y",d=>+6)
          .text(function(d){ console.log(d); return (d.value)})
          .attr("text-anchor",d=>(d.part=="primary"? "end": "start"));
      });

      function mouseover (d) {
        [0, 1].forEach(function (i) {
          bp[i].mouseover(d)

          g[i].selectAll(".mainBars").select(".perc")
            .text(function(d){ return (d.value)});
        });

      }


      function mouseout (d) {
        [0, 1].forEach(function (i) {
          bp[i].mouseout(d)

          g[i].selectAll('.mainBars').select('.perc')
            .text(function (d) { return (d.value)})
        })
      }

      d3.select(self.frameElement).style('height', '880px')
    }
  }
}
