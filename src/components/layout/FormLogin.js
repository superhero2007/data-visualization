export default {
  name: 'form-login',
  template: require('components/layout/FormLogin.html'),
  data () {
    return {
      model: nch.model,
      hasError: false
    }
  },
  mounted() {
    console.log ('current route: ' + this.$router.currentRoute.name );
  },
  methods: {
    hideLogin() {
      this.$emit('hideLoginModal', this.showLoginModal)
    }
  }
}
