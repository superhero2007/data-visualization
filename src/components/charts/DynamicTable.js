import TableContent from 'src/components/charts/TableContent'
import Download from '../layout/Download'

export default {
  name: 'dynamic-table',
  template: require('components/charts/DynamicTable.html'),
  components: {
    TableContent,
    Download
  },
  props: {
    category: {
      type: Array,
      default: []
    }
  },
  data () {
    return {
      model: nch.model,
      services: nch.services,
      selectedCategories: {},
      isShow: false,
      showDownloadOptions: false
    }
  },
  watch: {
    category: function (val) {
      this.selectedCategories = val
      this.updateTableData(val)
    },
  },
  mounted () {
    this.updateTableData(this.model.selectedCategories)
  },
  methods: {
    updateTableData (categories) {
      this.model.currentComparableData = this.services.dataService.getCurrentComparableData()
      this.model.allMediaData = this.services.dataService.getAllMediaData()
      this.model.tableData = this.services.dataService.getCurrentManufacturerTableData(categories)
    },
  }
}
