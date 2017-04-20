import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import Bipartite from '../charts/Bipartite'
import DashboardSummary from '../layout/DashboardSummary'
import PageFooter from '../layout/PageFooter'

export default {
  name: 'home',
  template: require('components/views/BilateralData.html'),
  components: {
    Navbar,
    Sidebar,
    Bipartite,
    DashboardSummary,
    PageFooter
  },
  data () {
    return {
      model: nch.model
    }
  }
}
