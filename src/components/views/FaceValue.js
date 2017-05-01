import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import PageFooter from '../layout/PageFooter'

export default {
  name: 'facevalue',
  template: require('components/views/FaceValue.html'),
  components: {
    Navbar,
    Sidebar,
    DashboardSummary,
    PageFooter
  },
  data () {
    return {
      model: nch.model
    }
  }
}
