import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '../components/views/Dashboard'
import FaceValue from '../components/views/FaceValue'
import ProductMoved from '../components/views/ProductMoved'
import BilateralData from '../components/views/BilateralData'
import Media from '../components/views/Media'
import Geographic from '../components/views/Geographic'
import Help from '../components/views/Help'
import Settings from '../components/views/Settings'
import ClassOfTrade from '../components/views/ClassOfTrade'

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
      path: '/media',
      name: 'Media',
      component: Media
    },
    {
      path: '/geographic/:view',
      name: 'Geographic',
      component: Geographic,
      props: true
    },
    {
      path: '/class-of-trade',
      name: 'ClassOfTrade',
      component: ClassOfTrade
    },
    {
      path: '/home',
      name: 'Home',
      component: Home
    },
    {
      path: '/help',
      name: 'Help',
      component: Help
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    }
  ]
})
