import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Appointment from '../views/Appointment.vue'
import ServiceGroups from '../views/ServiceGroups.vue'
import CovidTesting from '../views/CovidTestServices.vue'
import AtHomeCare from '../views/AtHomeServices.vue'
import IVDrips from '../views/AtHomeServices.vue'
import Timepicker from '../views/Timepicker.vue'
import Details from '../views/PatientDetails.vue'
import Insurance from '../views/Insurance.vue'
import Payment from '../views/Payment.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/appointment',
    name: 'Appointment',
    component: Appointment
  },
  {
    path: '/servicetypes',
    name: 'ServiceGroups',
    component: ServiceGroups
  },
  {
    path: '/covidtesting',
    name: 'CovidTesting',
    component: CovidTesting
  },
  {
    path: '/athomecare',
    name: 'AtHomeCare',
    component: AtHomeCare
  },
  {
    path: '/ivdrips',
    name: 'IVDrips',
    component: IVDrips
  },
  {
    path: '/timeslots',
    name: 'Timepicker',
    component: Timepicker
  },
  {
    path: '/details',
    name: 'Details',
    component: Details
  },
  {
    path: '/insurance',
    name: 'Insurance',
    component: Insurance
  },
  {
    path: '/payment',
    name: 'Payment',
    component: Payment
  },
  {
    path: '*',
    redirect: '/appointment'
  }
]

const router = new VueRouter({
  routes
})

export default router
