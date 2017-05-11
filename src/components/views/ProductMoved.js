import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import PageFooter from '../layout/PageFooter'
import Pie from '../charts/Pie'
import StackedBar from '../charts/StackedBar'

export default {
  name: 'productmoved',
  template: require('components/views/ProductMoved.html'),
  components: {
    Navbar,
    Sidebar,
    DashboardSummary,
    PageFooter,
    Pie,
    StackedBar
  },
  data () {
    return {
      model: nch.model
    }
  }
}
