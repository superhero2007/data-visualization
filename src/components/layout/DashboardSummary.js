export default {
  name: 'dashboard-summary',
  template: require('components/layout/DashboardSummary.html'),
  data () {
    return {
      model: nch.model
    }
  },
  mounted() {
    console.log ('current route: ' + this.$router.currentRoute.name );
  }
}
