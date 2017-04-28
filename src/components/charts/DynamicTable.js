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
    // services.getRedemptionsByMediaType().then( this.render ).catch( (message) => { console.log('DynamicTable promise catch:' + message) });
  },
  methods: {
    render (response) {
      console.log(response);
      this.tableData = response;
    },
    hideModal: function() {
      this.isShow = false;
    },
    saveModal: function(lists) {
      services.getRedemptionsByMediaType(lists).then( this.render ).catch( (message) => { console.log('DynamicTable promise catch:' + message) });
      this.isShow = false;
    }
  }
}


