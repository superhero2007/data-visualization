import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import Bipartite from '../charts/Bipartite'

export default {
  name: 'home',
  template: require('components/views/BilateralData.html'),
  components: {
    Navbar,
    Sidebar,
    Bipartite
  },
  data () {
    return {
      model: nch.model
    }
  }
}
