// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './modules/router'

var d3 = require("d3");
require("imports-loader?d3=d3!./vendor/viz.js");

import services from 'src/modules/services';

Vue.config.productionTip = false

var nch = require('./modules/config');
window.nch = nch;
var utils = require('./modules/utils');
nch.utils = utils;

//services.loadCategories();
services.loadManufacturers();
services.loadClassOfTrade();

// ****************************************
// simple test data, will be removed
// ****************************************
nch.model.selectedCategories = ['Breakfast Foods', 'Crackers, Cookies  and  Snack Bars', 'Yogurt',
  'Breakfast Foods - Shelf Stable'];
nch.model.currentManufacturer = 'General Mills, Inc.'

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

console.log( nch.model.title + " app loaded." );
console.log( nch.model );
