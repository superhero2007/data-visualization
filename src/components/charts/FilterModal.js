import * as d3 from 'd3'

export default {
  name: 'filter-modal',
  template: require('components/charts/FilterModal.html'),
  props: {
    show: {
      type: Boolean,
      required: true,
      twoWay: false
    },
    categories: {
      type: Array,
      default: []
    },
    onClose: Function,
    onSave: Function
  },
  data () {
    return {
      comparisonvalue: nch.model.selectedCategories
    }
  },
  watch: {
    show: function (val) {
      if (val) {
        this.comparisonvalue = nch.model.selectedCategories
      }
    }
  },
  methods: {
    ok () {
      let self = this
      this.onSave(self.comparisonvalue)
      this.onClose()
    },
    cancel () {
      this.onClose()
    },
    selectAll (items) {
      let selectedItems = items.map(function (d) {
        return d.categoryname
      })
      this.comparisonvalue = d3.merge([selectedItems, this.comparisonvalue])
    },
    clearAll (items) {
      let temp = []
      let unique = true
      this.comparisonvalue.forEach(function (v) {
        unique = true
        items.forEach(function (item) {
          if (item.categoryname === v) {
            unique = false
            return
          }
        })

        if (unique) {
          temp.push(v)
        }
      })
      this.comparisonvalue = temp
    }
  }
}
