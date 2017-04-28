export default {
  name: 'filter-modal',
  template: require('components/charts/FilterModal.html'),
  props: {
    show: {
      type: Boolean,
      required: true,
      twoWay: false
    },
    data: {
      type: Array,
      default: []
    },
    onClose: Function,
    onSave: Function
  },
  data () {
    return {
      comparisonvalue: []
    }
  },
  methods: {
    ok () {
      let self = this;
      this.onSave(self.comparisonvalue);
      this.onClose();
    },
    cancel () {
      this.onClose();
    }
  }
}
