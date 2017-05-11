//import {saveSvgAsPng} from 'save-svg-as-png'
import { mixin as clickaway } from 'vue-clickaway';

export default {
  name: 'download',
  mixins: [ clickaway ],
  //props: ['firstChart', 'secondChart'],
  props: {
    pngEnabled: {
      type: String,
      default: 'false'
    },
    pdfEnabled: {
      type: String,
      default: 'false'
    },
    csvEnabled: {
      type: String,
      default: 'false'
    },
  },
  template: require('components/layout/Download.html'),
  data () {
    return {
      model: nch.model,
      showDownloadOptions: false
    }
  },
  methods: {
  	csvClick: function()	{
  		console.log('TODO: implement CSV download')
  	},
  	pngClick: function()	{
  		//saveSvgAsPng(document.getElementById(this.firstChart), this.firstChart + '.png')
  		//saveSvgAsPng(document.getElementById(this.secondChart), this.secondChart + '.png')
      console.log('TODO: implement PNG download')
  	},
  	pdfClick: function()	{
      console.log('TODO: implement PDF download')
  	},
    onAwayClick: function() {
  	  this.showDownloadOptions = false;
    }
  }
}
