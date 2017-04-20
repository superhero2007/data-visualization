import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import Geo from '../charts/Geo'
import PageFooter from '../layout/PageFooter'

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
      model: nch.model
    }
  }
}
