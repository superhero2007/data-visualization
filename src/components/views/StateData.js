import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import Geo from '../charts/Geo'
import PageFooter from '../layout/PageFooter'

export default {
  name: 'statedata',
  template: require('components/views/StateData.html'),
  components: {
    Navbar,
    Sidebar,
    DashboardSummary,
    Geo,
    PageFooter
  },
  data () {
    return {
      model: nch.model
    }
  }
}
