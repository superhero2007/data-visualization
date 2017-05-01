import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '../components/views/Dashboard'
import FaceValue from '../components/views/FaceValue'
import ProductMoved from '../components/views/ProductMoved'
import BilateralData from '../components/views/BilateralData'
import PieCharts from '../components/views/PieCharts'
import Geographic from '../components/views/Geographic'

import Home from '../Home'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/face-value',
      name: 'FaceValue',
      component: FaceValue
    },
    {
      path: '/product-moved',
      name: 'ProductMoved',
      component: ProductMoved
    },
    {
      path: '/bilateral-data',
      name: 'BilateralData',
      component: BilateralData
    },
    {
      path: '/pie-charts',
      name: 'PieCharts',
      component: PieCharts
    },
    {
      path: '/geographic/:view',
      name: 'Geographic',
      component: Geographic,
      props: true
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    }
  ]
})
