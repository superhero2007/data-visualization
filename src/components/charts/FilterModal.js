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
  methods: {
    ok () {
      let self = this
      this.onSave(self.comparisonvalue)
      this.onClose()
    },
    cancel () {
      this.onClose()
    }
  }
}
