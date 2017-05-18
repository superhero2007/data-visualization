import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import Geo from '../charts/Geo'
import Bipartite from '../charts/Bipartite'
import PageFooter from '../layout/PageFooter'
import Download from '../layout/Download'
import ViewHeader from '../layout/ViewHeader'
import Loader from '../layout/Loader'

export default {
  name: 'geographic',
  template: require('components/views/Geographic.html'),
  props: ['view'],
  components: {
    Navbar,
    Sidebar,
    DashboardSummary,
    Geo,
    Bipartite,
    PageFooter,
    Download,
    ViewHeader,
    Loader
  },
  data () {
    return {
      model: nch.model,
      isLoading: false
    }
  },
  mounted() {
    console.log( "Geographic view: " + this.view );
  }
}
