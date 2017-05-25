import * as d3 from 'd3'

export default {
  name: 'table-content',
  template: require('components/charts/TableContent.html'),
  props: {
    category: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      model: nch.model,
      datas: [],
      media: [],
      currentManufacturer: nch.model.currentManufacturer,
      compareManufacturer: 'Comparables'
    }
  },
  watch: {
    category: function () {
      this.datas = this.model.tableData
      this.media = this.model.allMediaData
      this.comparableData = this.model.currentComparableData
    },
  },
  mounted () {
    this.datas = this.model.tableData
    this.media = this.model.allMediaData
    this.comparableData = this.model.currentComparableData
  },
  methods: {
    formattedValue (value) {
      return d3.format('(.2f')(value)
    },
    getIcon (mediaValue) {
      if (mediaValue === 'FSI') {
        return 'fa-scissors'
      } else if (mediaValue === 'Print At Home') {
        return 'fa-print'
      } else if (mediaValue === 'Handout Electronic Checkout') {
        return 'fa-tablet'
      } else if (mediaValue === 'Military') {
        return 'fa-star'
      } else {
        return 'fa-question-circle'
      }
    },
    getData (string) {
      console.log(string)
      if (this.datas[string]) {
        return true
      } else {
        return false
      }
    }
  }
}
