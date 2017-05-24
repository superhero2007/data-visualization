// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './modules/router'

import ServiceFactory from './components/services/ServiceFactory'

require('imports-loader?d3=d3!./vendor/viz.js')

import services from 'src/modules/services'

Vue.config.productionTip = false

const nch = require('./modules/config')
window.nch = nch
const utils = require('./modules/utils')
nch.utils = utils


const serviceFactory = new ServiceFactory()
nch.services.dataService = serviceFactory.getDataService()
console.log('Data service loaded: ' + nch.services.dataService.getType())
// services.loadCategories()
nch.services.periodService = serviceFactory.getPeriodService();
nch.services.sectorCategoryService = serviceFactory.getSectorCategoryService();
services.loadManufacturers()
services.loadClassOfTrades()


// ****************************************
// simple test data, will be removed
// ****************************************
nch.model.currentManufacturer = 'General Mills, Inc.'
nch.model.timeperiodData = 1

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

console.log(nch.model.title + ' app loaded.')
console.log(nch.model)
