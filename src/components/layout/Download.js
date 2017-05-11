import {saveSvgAsPng} from 'save-svg-as-png'

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
  	csvClick: function()	{
  		console.log('TODO: implement CSV download')
  	},
  	pngClick: function()	{
  		saveSvgAsPng(document.getElementById(this.firstChart), this.firstChart + '.png')
  		saveSvgAsPng(document.getElementById(this.secondChart), this.secondChart + '.png')
  	},
  	pdfClick: function()	{
      console.log('TODO: implement PDF download')
  	}
  }
}
