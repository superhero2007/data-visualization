import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import PageFooter from '../layout/PageFooter'
import ViewHeader from '../layout/ViewHeader'
import Download from '../layout/Download'
import Pie from '../charts/Pie'
import StackedBar from '../charts/StackedBar'
import Loader from '../layout/Loader'

export default {
  name: 'facevalue',
  template: require('components/views/FaceValue.html'),
  components: {
    Navbar,
    Sidebar,
    DashboardSummary,
    PageFooter,
    ViewHeader,
    Download,
    Pie,
    StackedBar,
    Loader
  },
  data () {
    return {
      model: nch.model,
      showDownloadOptions: false,
      isLoading: false
    }
  }
}
