export default {
  name: 'sidebar',
  template: require('components/layout/Sidebar.html'),
  data () {
    return {
      model: nch.model
    }
  },
  mounted() {
    console.log ('current route: ' + this.$router.currentRoute.name );
  }
}
