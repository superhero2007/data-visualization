import * as d3 from 'd3';

export default {
  name: 'table-content',
  template: require('components/charts/TableContent.html'),
  props: {
    datas: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      media: nch.model.allMedaiNames,
      currentManufacturer: nch.model.currentManufacturer,
      compareManufacturer: 'Comparables'
    }
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
    }
  }
}
