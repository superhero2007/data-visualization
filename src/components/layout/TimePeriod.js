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
      timeperiodData: []
    }
  },
  props: {
    timeperiodValue: 0
  },
  mounted() {
    services.getTimePeriodData().then( (response) => {
      this.timeperiodData = response
      console.log(this.timeperiodData)
    }).catch( (message) => { console.log('Bar promise catch:' + message) })
  },
  methods: {
    onAwayClick: function() {
  	  this.showTimePeriodOptions = false
    },
    onScroll: function(e, position){
      this.position = position;
    }
  }
}
