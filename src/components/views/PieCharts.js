import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import Pie from '../charts/Pie'
import Bar from '../charts/Bar'
import DashboardSummary from '../layout/DashboardSummary'
import PageFooter from '../layout/PageFooter'

import services from 'src/modules/services';

export default {
  name: 'piecharts',
  template: require('components/views/PieCharts.html'),
  components: {
    Navbar,
    Sidebar,
    Pie,
    Bar,
    DashboardSummary,
    PageFooter
  },
  data () {
    return {
      model: nch.model,
      dataflag: false
    }
  },
  computed: {
    dataflag() {
      return this.dataflag;
    }
  },
  mounted() {
    console.log( "Pie Charts mounted" );
    services.getPieData().then( (response) => {
      for (var i = 0; i < response.length; i++) {
        for (var j = 0; j < this.model.selectedCategories.length; j++) {
          if(this.model.selectedCategories[j] == response[i].categoryname) {
            this.dataflag = true
            break
          }
        }
      }
      
    }).catch((message) => { console.log('Pie promise catch:' + message) })
  }
}
