import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import PageFooter from '../layout/PageFooter'
import ViewHeader from '../layout/ViewHeader'
import Download from '../layout/Download'
import Pie from '../charts/Pie'
import StackedBar from '../charts/StackedBar'

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
    StackedBar
  },
  data () {
    return {
      model: nch.model,
      show: false
    }
  }
}
