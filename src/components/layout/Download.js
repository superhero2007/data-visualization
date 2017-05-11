import {saveSvgAsPng, svgAsPngUri } from 'save-svg-as-png'
// import {createPdf} from 'pdfmake'

export default {
  name: 'download',
  props: ['firstChart', 'secondChart'],
  template: require('components/layout/Download.html'),
  data () {
    return {
      model: nch.model
    }
  },
  methods: {
  	csvClick: function(firstChart, secondChart)
  	{
  		console.log('csvClick')
  	},
  	pngClick: function(firstChart, secondChart)
  	{
  		saveSvgAsPng(document.getElementById(firstChart), firstChart + '.png')
  		saveSvgAsPng(document.getElementById(secondChart), secondChart + '.png')
  	},
  	pdfClick: function(firstChart, secondChart)
  	{
  		var buffer = document.getElementById(firstChart)
  		svgAsPngUri(buffer,{}, function(uri){
  			console.log(uri)
  			//var pdfmake = require("pdfmake")
  			var docDefinition = {
	  			content: [
	  				{
	  					image: uri
	  				}
  				],
  				images: {
  					mySuperImage:uri
  				}
  			}
  			//pdfmake.createPdf(docDefinition).download()
  		})
  		console.log('pdf')
  	}
  }
}
