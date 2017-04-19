import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import Geo from '../charts/Geo'

export default {
  name: 'statedata',
  template: require('components/views/StateData.html'),
  components: {
    Navbar,
    Sidebar,
    Geo
  },
  data () {
    return {
      model: nch.model
    }
  }
}
