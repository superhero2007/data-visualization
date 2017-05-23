import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import Geo from '../charts/Geo'
import DynamicTable from '../charts/DynamicTable'
import PageFooter from '../layout/PageFooter'
import Download from '../layout/Download'
import ViewHeader from '../layout/ViewHeader'

import services from 'src/modules/services'

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
      selected: 'Air Fresheners & Candles',
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
      nch.model.selectedCategories = val
    }
  },
  computed: {
    categories () {
      return this.model.categories
    }
  },
  mounted () {
    console.log('Dashboard mounted')
    // console.log( this.model.categories )
    services.loadCategories().then((categories) => {
      this.model.categories = categories
      this.options = categories
      this.value = nch.model.selectedCategories
    }).catch((message) => { console.log('Dashboard, loading categories promise catch:' + message) })
  },

  methods: {
    updateMultiSelect: function () {
      this.value = nch.model.selectedCategories
      this.selectedCategory = nch.model.selectedCategories
    }
  }
}
