import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import Pie from '../charts/Pie'
import Bar from '../charts/Bar'
import DashboardSummary from '../layout/DashboardSummary'
import PageFooter from '../layout/PageFooter'
import Download from '../layout/Download'
import ViewHeader from '../layout/ViewHeader'

export default {
  name: 'piecharts',
  template: require('components/views/Media.html'),
  components: {
    Navbar,
    Sidebar,
    Pie,
    Bar,
    DashboardSummary,
    PageFooter,
    Download,
    ViewHeader
  },
  data () {
    return {
      model: nch.model
    }
  }
}
