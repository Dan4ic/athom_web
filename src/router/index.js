import Vue from 'vue'
import Router from 'vue-router'
import Dashboard from '@/components/Dashboard'
import Settings from '@/components/Settings'
import ConfigHelper from '@/components/ConfigHelper'
import Apps from '../core/applications'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Dashboard',
      component: Dashboard
    },
    {
      path: '/config_helper',
      name: 'ConfigHelper',
      component: ConfigHelper
    },
    {
      path: '/settings',
      name: 'Settings',
      component: Settings
    },
    {
      path: '/lazyload',
      name: 'Lazyload',
      component: () => Apps.loadApplication('lucerna')
    },
  ]
})
