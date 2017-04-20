export default {
  name: 'page-footer',
  template: require('components/layout/PageFooter.html'),
  data () {
    return {
      model: nch.model
      // version: nch.version
    }
  },
  mounted() {
    console.log ('current route: ' + this.$router.currentRoute.name );
  }
}
