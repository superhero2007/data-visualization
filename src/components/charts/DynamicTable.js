import * as d3 from 'd3'

import FilterModal from 'src/components/charts/FilterModal'
import TableContent from 'src/components/charts/TableContent'
import services from '../../modules/services';

export default {
  name: 'dynamic-table',
  template: require('components/charts/DynamicTable.html'),
  components: {
    FilterModal,
    TableContent
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
      tableData: {}
    }
  },
  mounted() {
    services.loadCombinedData();
  },
  methods: {
    renderTable (response) {
      this.tableData = response;
    },
    hideModal: function() {
      this.isShow = false;
    },
    saveModal: function(lists) {
      nch.model.selectedCategories = lists;
      services.getTableData(lists).then( this.renderTable ).catch( (message) => { console.log('DynamicTable promise catch:' + message) });
      this.isShow = false;
    }
  }
}


