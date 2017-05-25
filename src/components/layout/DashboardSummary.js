import FilterModal from 'src/components/charts/FilterModal'
import TimePeriod from '../layout/TimePeriod'

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
      services: nch.services,
      showCategoriesModal: false,
      segment: false,
      sectors: null,
      categories: null,
      selectedSector: null,
      segmentNames: [
        'Other',
        'Food'
      ],
      timeperiodData: nch.model.timeperiodData
    }
  },

   watch: {
    timeperiodData: {
      handler:function(val, oldVal) {
        nch.model.timeperiodData = this.timeperiodData
      },
      deep: true
    },
     services: {
      handler: function () {
        this.initSectorCategory()
      },
      deep: true
    },
     selectedSector: {
       handler: function () {
         this.updateSectorCategory()
       },
       deep: true
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
    this.sectors = this.services.sectorCategoryService.sectors
    this.selectedSector = this.model.selectedSector
    this.updateSectorCategory()
  },
  methods: {
    initSectorCategory: function () {
      this.sectors = nch.services.sectorCategoryService.sectors
      if (this.sectors && this.sectors.length > 0 && !this.selectedSector) {
        this.selectedSector = this.sectors[1]
      }

      this.updateSectorCategory()
    },
    updateSectorCategory: function () {
      this.categories = nch.services.sectorCategoryService.getCategories(this.selectedSector)
      this.model.selectedSector = this.selectedSector
      this.model.categories = this.categories
      this.model.selectedCategories = this.categories
    },
    hideModal: function () {
      this.showCategoriesModal = false
    },
    saveModal: function (lists) {
      this.model.selectedCategories = lists
      this.showCategoriesModal = false
    }
  }
}
