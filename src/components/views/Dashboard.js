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
    vSelect
  },
  data () {
    return {
      selected: 'Air Fresheners & Candles',
      model: nch.model,
      showDownloadOptions: false
    }
  },
  computed: {
    categories() {
      return this.model.categories
    },
    categorynames() {
      let names = []
      for(let i = 0; i< this.model.categories.length; i++)
      {
        names.push(this.model.categories[i].categoryname)
      }
      return names
    }
  },
  mounted() {
    console.log( 'Dashboard mounted' )

    this.consoleCallback()
    // console.log( this.model.categories )
    services.loadCategories().then( (categories) => {
      this.model.categories = categories
      // console.log( 'cats loaded' )
      // console.log(categories)
    } ).catch( (message) => { console.log('Dashboard, loading categories promise catch:' + message) })
  },

  methods: {
    onCategorySelected: function (event) {
      console.log( 'category selected: ' + this.selected )
    },
    consoleCallback: function(val) {
      var element = document.getElementsByClassName('close')
      for (var i = 0; i < element.length; i++) {
        element[i].innerHTML = "<span class='fa-stack'>  <i class='fa fa-circle fa-stack-2x'></i>    <i class='fa fa-times fa-stack-1x fa-inverse'></i>   </span>"
      }
    }
  }
}
