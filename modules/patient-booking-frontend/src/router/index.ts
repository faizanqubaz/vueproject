import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Appointment from '../views/Appointment.vue'
import Services from '../views/Services.vue'
import Timepicker from '../views/Timepicker.vue'
import Details from '../views/PatientDetails.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
  {
    path: '/appointment',
    name: 'Appointment',
    component: Appointment
  },
  {
    path: '/services',
    name: 'Services',
    component: Services
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
    path: '*',
    redirect: '/appointment'
  }
]

const router = new VueRouter({
  routes
})

export default router
