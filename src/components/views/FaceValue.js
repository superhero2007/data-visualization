import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import PageFooter from '../layout/PageFooter'
import ViewHeader from '../layout/ViewHeader'
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
    Pie,
    StackedBar
  },
  data () {
    return {
      model: nch.model,
      headerTitle: 'Face Value Range: General Mills, Inc. vs. Comparables'
    }
  }
}
