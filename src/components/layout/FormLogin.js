export default {
  name: 'form-login',
  template: require('components/layout/FormLogin.html'),
  data () {
    return {
      model: nch.model
    }
  },
  mounted() {
    console.log ('current route: ' + this.$router.currentRoute.name );
  }
}
