import FilterModal from 'src/components/charts/FilterModal'

export default {
  name: 'dashboard-summary',
  template: require('components/layout/DashboardSummary.html'),
  components: {
    FilterModal
  },
  data () {
    return {
      model: nch.model,
      showCategoriesModal: false
    }
  },
  computed: {
    currentView() {
      return this.$router.currentRoute.name;
    }
  },
  mounted() {
    console.log ('current route: ' + this.$router.currentRoute.name );
  },
  methods: {
    hideModal: function () {
      this.showCategoriesModal = false
    },
    saveModal: function (lists) {
      nch.model.selectedCategories = lists
      //services.getTableData(lists).then(this.renderTable).catch((message) => { console.log('DynamicTable promise catch:' + message) })
      this.showCategoriesModal = false
    }
  }
}
