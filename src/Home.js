'use strict';
import FormLogin from 'components/layout/FormLogin'

import "./styles/home.scss";

export default {
  name: 'home',
  template: require('./Home.html'),
  components: {
    FormLogin
  },
  methods: {
    toggleLogin() {
        // show/hide login
    }
  }
}
