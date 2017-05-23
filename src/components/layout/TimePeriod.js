import { mixin as clickaway } from 'vue-clickaway'
import services from 'src/modules/services'

export default {
  name: 'time-period',
  mixins: [ clickaway ],
  props: {
    timeperiodValue: 0
  },
  template: require('components/layout/TimePeriod.html'),
  data () {
    return {
      model: nch.model,
      showTimePeriodOptions: false,
      timeperiodData: [],
      scrollValue: 0,
      selectedYear: nch.model.selectedYear,
      selectedQuarter: nch.model.selectedQuarter,
      selectedWeek: nch.model.selectedWeek
    }
  },
  mounted () {
    services.getTimePeriodData().then((response) => {
      response[0].values.sort(function (a, b) { return a.year - b.year })
      response[1].values.sort(function (a, b) { return b.year - a.year })
      response[2].values.sort(function (a, b) { return new Date(b.year + b.month) - new Date(a.year + a.month) })

      for(var i = 0; i < response[0].values.length; i++) {
        response[0].values[i].flag = 0
      }

      response[0].values[response[0].values.length - 1].flag = 1
      response[0].values[response[0].values.length - 2].flag = 1
      this.selectedYear.push(response[0].values[response[0].values.length - 1])
      this.selectedYear.push(response[0].values[response[0].values.length - 2])

      for(var i = 0; i < response[1].values.length; i++) {
        response[1].values[i].item = []
        for (let j = 0; j < response[1].values[i].quarters.length; j++) {
          response[1].values[i].item[j] = {
            year: response[1].values[i].year,
            value: response[1].values[i].quarters[j],
            flag: 0
          }
        }
      }

      var last = response[1].values[0]
      last.item[last.item.length - 1].flag = 1
      this.selectedQuarter.push(last.item[last.item.length - 1])
      if(last.item.length > 1)
      {
        last.item[last.item.length - 2].flag = 1
        this.selectedQuarter.push(last.item[last.item.length - 2])
      }
      else
      {
        last = response[1].values[1]
        last.item[last.item.length - 1].flag = 1
        this.selectedQuarter.push(last.item[last.item.length - 1])
      }



      for(var i = 0; i < response[2].values.length; i++) {
        response[2].values[i].item = []
        for (let j = 0; j < response[2].values[i].weeks.length; j++) {
          response[2].values[i].item[j] = {
            year: response[2].values[i].year,
            month: response[2].values[i].month,
            value: response[2].values[i].weeks[j],
            flag: 0
          }
        }
      }

      last = response[2].values[0]
      last.item[last.item.length - 1].flag = 1
      this.selectedWeek.push(last.item[last.item.length - 1])
      if(last.item.length > 1)
      {
        last.item[last.item.length - 2].flag = 1
        this.selectedWeek.push(last.item[last.item.length - 2])
      }
      else
      {
        last = response[2].values[1]
        last.item[last.item.length - 1].flag = 1
        this.selectedWeek.push(last.item[last.item.length - 1])
      }

      this.timeperiodData = response
    }).catch((message) => { console.log('TimePeriod promise catch:' + message) })
  },
  methods: {
    onAwayClick: function () {
      this.showTimePeriodOptions = false
    },

    itemClick: function(type, item) {
      var selectedItem
      if(type == "year")
        selectedItem = this.selectedYear
      else if(type == "quarter")
        selectedItem = this.selectedQuarter
      else if(type == "week")
        selectedItem = this.selectedWeek

      if(selectedItem.length == 2 && !item.flag)
        return;

      if(!item.flag)
        selectedItem.push(item)
      else if(selectedItem[0] === item)
        selectedItem.splice(0, 1)
      else
        selectedItem.splice(1, 1)

      item.flag = 1 - item.flag
    },

    itemUp: function () {
      if (this.scrollValue) {
        this.scrollValue --
      }
      document.getElementsByClassName('timeperiod-content')[0].scrollTop = 24 + 38 * this.scrollValue
    },

    itemDown: function () {
      if (this.scrollValue < this.timeperiodData[this.timeperiodValue]['values'].length - 4) {
        this.scrollValue ++
      }
      document.getElementsByClassName('timeperiod-content')[0].scrollTop = 24 + 38 * this.scrollValue
    },

    handleScroll: function (e) {
      let currentScrollPosition = e.srcElement.scrollTop - 24
      if (currentScrollPosition < 0) {
        currentScrollPosition = 0
      }
      this.scrollValue =  Math.ceil (currentScrollPosition / 38)
    }
  }
}
