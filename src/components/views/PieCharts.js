import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'

export default {
  name: 'piecharts',
  template: require('components/views/PieCharts.html'),
  components: {
    Navbar,
    Sidebar
  },
  data () {
    return {
      model: nch.model
    }
  }
}
