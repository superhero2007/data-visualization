import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import Pie from '../charts/Pie'
import Bar from '../charts/Bar'
import DashboardSummary from '../layout/DashboardSummary'
import PageFooter from '../layout/PageFooter'

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
      model: nch.model
    }
  }
}
