export default {
  name: 'form-login',
  template: require('components/layout/FormLogin.html'),
  props: ['hasError', 'errorMessage', 'hideLoginModal'],
  data () {
    return {
      model: nch.model
    }
  },
  mounted() {
    console.log ('current route: ' + this.$router.currentRoute.name );
  },
  methods: {
    updateTermsStatus() {
      // update user if they agree to the terms and conditions
      // this should only happen if the user has never logged in before
    }
  }
}
