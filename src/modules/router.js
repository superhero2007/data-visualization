import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '../components/views/Dashboard'
import BilateralData from '../components/views/BilateralData'
import PieCharts from '../components/views/PieCharts'
import StateData from '../components/views/StateData'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
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
      path: '/state-data',
      name: 'StateData',
      component: StateData
    }
  ]
})
