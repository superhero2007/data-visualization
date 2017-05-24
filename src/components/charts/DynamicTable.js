// import TableContent from 'src/components/charts/TableContent'
import Download from '../layout/Download'

export default {
  name: 'dynamic-table',
  template: require('components/charts/DynamicTable.html'),
  components: {
    // TableContent,
    Download
  },
  data () {
    return {
      isShow: false,
      tableData: {},
      model: nch.model,
      showDownloadOptions: false
    }
  },
  watch: {
    model: {
      handler: function (newValue, oldValue) {
        // this.updateTable()
      },
      deep: true
    }
  },
  mounted () {
    // services.loadCombinedData()
    // this.updateTable()
  },
  methods: {
    updateTable () {
      // services.getTableData(nch.model.selectedCategories).then(this.renderTable).catch((message) => { console.log('DynamicTable, update table promise catch:' + message) })
    },
    renderTable (response) {
      // this.tableData = response
    }
  }
}
