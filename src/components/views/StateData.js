import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'

export default {
  name: 'statedata',
  template: require('components/views/StateData.html'),
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
