import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import Geo from '../charts/Geo'
import DynamicTable from '../charts/DynamicTable'
import PageFooter from '../layout/PageFooter'
import Download from '../layout/Download'
import ViewHeader from '../layout/ViewHeader'
import vSelect from 'vue-select'
import MultiSelect from 'vue-multiselect'

export default {
  name: 'home',
  template: require('components/views/Dashboard.html'),
  components: {
    Navbar,
    Sidebar,
    Geo,
    DynamicTable,
    DashboardSummary,
    Download,
    ViewHeader,
    PageFooter,
    vSelect,
    MultiSelect
  },
  data () {
    return {
      model: nch.model,
      showDownloadOptions: false,
      options: [],
      value: []
    }
  },
  watch: {
    model: {
      handler: function () {
        this.updateMultiSelect()
      },
      deep: true
    },
    value: function (val) {
      console.log("Dashboard.value")
      console.log( val )
      this.model.selectedCategories = val
    }
  },
  computed: {
  },
  mounted () {
    console.log('Dashboard mounted')
    this.updateMultiSelect()
  },

  methods: {
    updateMultiSelect: function () {
      if (this.model.categories) {
        this.options = this.model.categories
      } else {
        this.options = []
      }
      this.value = this.model.selectedCategories
    }
  }
}
