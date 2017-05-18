'use strict';
import FormLogin from 'components/layout/FormLogin'

import "./styles/home.scss";

export default {
  name: 'home',
  template: require('./Home.html'),
  data () {
    return {
      hasError: false,
      errorMessage: 'Sorry, we did not recognize that email address. Please check your entry and try again or call our customer support center.'
    }
  },
  mounted () {
    console.log ('current route: ' + this.$router.currentRoute.name )
  },
  components: {
    FormLogin
  },
  methods: {
    showLoginModal: function() {
      return this.hasError ? true : false
    },
    hideLoginModal: function() {
      this.hasError = false
    }
  }
}
