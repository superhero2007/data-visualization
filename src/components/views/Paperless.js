import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import PageFooter from '../layout/PageFooter'
import ViewHeader from '../layout/ViewHeader'
import Loader from '../layout/Loader'

export default {
  name: 'Paperless',
  template: require('components/views/Paperless.html'),
  components: {
    Navbar,
    Sidebar,
    DashboardSummary,
    PageFooter,
    ViewHeader,
    Loader
  },
  data () {
    return {
      model: nch.model,
      isLoading: false
    }
  }
}
