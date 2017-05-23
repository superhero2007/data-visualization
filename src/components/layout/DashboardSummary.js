import FilterModal from 'src/components/charts/FilterModal'
import TimePeriod from '../layout/TimePeriod'
import services from 'src/modules/services'

export default {
  name: 'dashboard-summary',
  template: require('components/layout/DashboardSummary.html'),
  components: {
    FilterModal,
    TimePeriod
  },
  props: {
    callback: Function
  },
  data () {
    return {
      model: nch.model,
      showCategoriesModal: false,
      segment: false,
      sectorCategory: null,
      selectedSector: null,
      segmentNames: [
        'Other',
        'Food'
      ],
      timeperiodData: 0
    }
  },
  computed: {
    currentView () {
      return this.$router.currentRoute.name
    },
    segmentName () {
      if (this.segment) {
        return this.segmentNames[0]
      }

      return this.segmentNames[1]
    }
  },
  mounted () {
    console.log('current route: ' + this.$router.currentRoute.name)
    services.loadSectorCategories().then((sectorCategory) => {
      this.sectorCategory = sectorCategory
      nch.model.sectorCategory = sectorCategory
    }).catch((message) => { console.log('Dashboard, loading categories promise catch:' + message) })
  },
  methods: {
    hideModal: function () {
      this.showCategoriesModal = false
    },
    saveModal: function (lists) {
      nch.model.selectedCategories = lists
      this.showCategoriesModal = false
    }
  }
}
