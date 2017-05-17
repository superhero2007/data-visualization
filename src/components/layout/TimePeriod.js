import { mixin as clickaway } from 'vue-clickaway'

import services from 'src/modules/services'

export default {
  name: 'time-period',
  mixins: [ clickaway ],
  props: { },
  template: require('components/layout/TimePeriod.html'),
  data () {
    return {
      model: nch.model,
      showTimePeriodOptions: false,
      timeperiodData: [],
      scrollValue: 0
    }
  },
  props: {
    timeperiodValue: 0
  },
  mounted() {
    services.getTimePeriodData().then( (response) => {
      response[0].values.sort(function(a, b) { return a.year - b.year })
      response[1].values.sort(function(a, b) { return b.year - a.year })
      response[2].values.sort(function(a, b) { return new Date(b.year + b.month) - new Date(a.year + a.month) })

      for(var i = 0; i < response[0].values.length; i++) {
        response[0].values[i].flag = 1
      }

      for(var i = 0; i < response[1].values.length; i++) {
        response[1].values[i].item = []
        for(var j = 0; j< response[1].values[i].quarters.length; j++) {
          response[1].values[i].item[j] = {
            value: response[1].values[i].quarters[j],
            flag: 1
          }
        }
      }

      for(var i = 0; i < response[2].values.length; i++) {
        response[2].values[i].item = []
        for(var j = 0; j< response[2].values[i].weeks.length; j++) {
          response[2].values[i].item[j] = {
            value: response[2].values[i].weeks[j],
            flag: 1
          }
        }
      }

      this.timeperiodData = response

    }).catch( (message) => { console.log('TimePeriod promise catch:' + message) })
  },
  methods: {
    onAwayClick: function() {
  	  this.showTimePeriodOptions = false
    },

    itemClick: function(item) {
      item.flag = 1 - item.flag
    },

    itemUp: function() {
      if(this.scrollValue)
        this.scrollValue --
      document.getElementsByClassName('timeperiod-content')[0].scrollTop = 24 + 38 * this.scrollValue
    },

    itemDown: function() {
      if(this.scrollValue < this.timeperiodData[this.timeperiodValue]['values'].length - 4)
        this.scrollValue ++
      document.getElementsByClassName('timeperiod-content')[0].scrollTop = 24 + 38 * this.scrollValue
    },

    handleScroll: function(e) {
      let currentScrollPosition = e.srcElement.scrollTop - 24
      if( currentScrollPosition < 0)
        currentScrollPosition = 0
      this.scrollValue =  Math.ceil (currentScrollPosition / 38)
    }
  }
}
