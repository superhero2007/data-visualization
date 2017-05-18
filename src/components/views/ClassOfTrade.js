import Navbar from '../layout/Navbar'
import Sidebar from '../layout/Sidebar'
import DashboardSummary from '../layout/DashboardSummary'
import PageFooter from '../layout/PageFooter'
import ViewHeader from '../layout/ViewHeader'
import Download from '../layout/Download'
import Loader from '../layout/Loader'

import { mixin as clickaway } from 'vue-clickaway';

export default {
  name: 'classoftrade',
  mixins: [ clickaway ],
  template: require('components/views/ClassOfTrade.html'),
  components: {
    Navbar,
    Sidebar,
    DashboardSummary,
    PageFooter,
    ViewHeader,
    Download,
    Loader
  },
  data () {
    return {
      model: nch.model,
      showDownloadOptions: false,
      isLoading: false
    }
  },
  methods: {
    away: function() {
      this.showDownloadOptions = false;
    },
  },
}
