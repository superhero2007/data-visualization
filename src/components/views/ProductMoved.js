import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import Download from '../layout/Download'
import ViewHeader from '../layout/ViewHeader'
import PageFooter from '../layout/PageFooter'

export default {
  name: 'productmoved',
  template: require('components/views/ProductMoved.html'),
  components: {
    Navbar,
    Sidebar,
    DashboardSummary,
    ViewHeader,
    PageFooter,
    Download
  },
  data () {
    return {
      model: nch.model
    }
  }
}
