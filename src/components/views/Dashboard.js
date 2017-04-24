import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import Geo from '../charts/Geo'
import PageFooter from '../layout/PageFooter'

import services from 'src/modules/services';

export default {
  name: 'home',
  template: require('components/views/Dashboard.html'),
  components: {
    Navbar,
    Sidebar,
    Geo,
    DashboardSummary,
    PageFooter
  },
  data () {
    return {
      selected: 'Air Fresheners & Candles',
      model: nch.model
    }
  },
  computed: {
    categories() {
      return this.model.categories;
    }
  },
  mounted() {
    console.log( "Dashboard mounted" );
    // console.log( this.model.categories );
    services.loadCategories().then( (categories) => {
      this.model.categories = categories;
      console.log( "cats loaded" );
      console.log(categories);
    } ).catch( (message) => { console.log('Dashboard, loading categories promise catch:' + message) });
  },

  methods: {
    onCategorySelected: function (event) {
      console.log( "category selected: " + this.selected );
    }
  }
}
