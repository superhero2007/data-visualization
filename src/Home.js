'use strict';
import FormLogin from 'components/layout/FormLogin'

import "./styles/home.scss";

export default {
  name: 'home',
  template: require('./Home.html'),
  data () {
    return {
      showLoginModal: false,
      hasError: false
    }
  },
  mounted () {
    console.log ('current route: ' + this.$router.currentRoute.name )
  },
  components: {
    FormLogin
  },
  methods: {
    toggleLogin() {
        this.showLoginModal = this.showLoginModal ? false : true;
    }
  }
}
