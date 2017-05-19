import * as d3 from 'd3'
import FilterModal from 'src/components/charts/FilterModal'
import TimePeriod from '../layout/TimePeriod'
import services from '../../modules/services'

export default {
  name: 'dashboard-summary',
  template: require('components/layout/DashboardSummary.html'),
  components: {
    FilterModal,
    TimePeriod
  },
  data () {
    return {
      model: nch.model,
      showCategoriesModal: false,
      segment: false,
      selectedSector: this.model,
      segmentNames: [
        'Other',
        'Food'
      ],
      timeperiodData: 0
    }
  },
  computed: {
    currentView() {
      return this.$router.currentRoute.name;
    },
    segmentName() {
      if (this.segment) {
        return this.segmentNames[0]
      }

      return this.segmentNames[1]
    }
  },
  watch: {
    selectedSector: {
      handler: 'updateCategories',
      immediate: true
    }
  },
  created: function() {
    if (this.model.sectors.length > 0){
      this.selectedSector = this.model.sectors[0]
    }
    else {
      services.loadSectors().then( (response) => {
        this.selectedSector = response[0]
      } ).catch( (message) => { console.log('Dashboard, loading sector promise catch:' + message) })
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
      this.showCategoriesModal = false
    },
    updateCategories: function () {
      nch.model.selectedSector = this.selectedSector
       if (nch.model.allSectorCategory) {
         nch.model.selectedSectorCategory = nch.model.allSectorCategory.filter(function(d) { return d.sectorcode == nch.model.selectedSector.sectorcode })
       }
       else {
         nch.model.selectedSectorCategory = []
       }
    }
  }
}
