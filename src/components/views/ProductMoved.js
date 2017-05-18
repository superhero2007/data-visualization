import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import Download from '../layout/Download'
import ViewHeader from '../layout/ViewHeader'
import PageFooter from '../layout/PageFooter'
import Pie from '../charts/Pie'
import StackedBar from '../charts/StackedBar'
import Loader from '../layout/Loader'

export default {
  name: 'productmoved',
  template: require('components/views/ProductMoved.html'),
  components: {
    Navbar,
    Sidebar,
    DashboardSummary,
    PageFooter,
    Pie,
    StackedBar,
    ViewHeader,
    PageFooter,
    Download,
    Loader
  },
  data () {
    return {
      model: nch.model,
      isLoading: false
    }
  }
}
