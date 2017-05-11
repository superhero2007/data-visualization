import * as d3 from 'd3'

import FilterModal from 'src/components/charts/FilterModal'
import TableContent from 'src/components/charts/TableContent'
import services from '../../modules/services';
import Download from '../layout/Download'

export default {
  name: 'dynamic-table',
  template: require('components/charts/DynamicTable.html'),
  components: {
    FilterModal,
    TableContent,
    Download
  },
  props: {
    categories: {
      type: Array,
      default: []
    }
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
        this.updateTable();
      }, deep: true
    }
  },
  mounted () {
    services.loadCombinedData()
    this.updateTable();
  },
  methods: {
    updateTable() {
      services.getTableData(nch.model.selectedCategories).then( this.renderTable ).catch( (message) => { console.log('DynamicTable, update table promise catch:' + message) })
    },
    renderTable (response) {
      this.tableData = response
    },
    hideModal: function () {
      this.isShow = false
    },
    saveModal: function (lists) {
      nch.model.selectedCategories = lists
      //services.getTableData(lists).then(this.renderTable).catch((message) => { console.log('DynamicTable promise catch:' + message) })
      this.isShow = false
    }
  }
}
