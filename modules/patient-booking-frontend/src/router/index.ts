import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Appointment from '../views/Appointment.vue'
import Services from '../views/Services.vue'
import CovidTesting from '../views/CovidTestServices.vue'
import AtHomeCare from '../views/AtHomeServices.vue'
import IVDrips from '../views/IvDripServices.vue'
import Timepicker from '../views/Timepicker.vue'
import AdditionalNotes from '../views/AdditionalNotes.vue'
import Details from '../views/PatientDetails.vue'
import Insurance from '../views/Insurance.vue'
import Payment from '../views/Payment.vue'
import ReviewAppointment from '../views/ReviewAppointment.vue'
import Confirmation from '../views/Confirmation.vue'
import Main from '../views/dashboard/Main.vue'
import Results from '../views/dashboard/Results.vue'
import Upcoming from '../views/dashboard/Upcoming.vue'
import store from '../store'
import { authGuard } from '@/auth/authGuard'

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
    path: '/covid19-testing',
    name: 'CovidTesting',
    component: CovidTesting
  },
  {
    path: '/at-home-care',
    name: 'AtHomeCare',
    component: AtHomeCare
  },
  {
    path: '/iv-drips',
    name: 'IVDrips',
    component: IVDrips
  },
  {
    path: '/notes',
    name: 'AdditionalNotes',
    component: AdditionalNotes
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
    path: '/review-appointment',
    name: 'ReviewAppointment',
    component: ReviewAppointment
  },
  {
    path: '/confirmation',
    name: 'Confirmation',
    component: Confirmation
  },
  {
    path: '/dashboard',
    name: 'Main',
    component: Main,
    beforeEnter: authGuard
  },
  {
    path: '/results',
    name: 'Results',
    component: Results,
    beforeEnter: authGuard
  },
  {
    path: '/upcoming',
    name: 'Upcoming',
    component: Upcoming,
    beforeEnter: authGuard
  },
  {
    path: '/login',
    redirect: '/dashboard'
  },
  {
    path: '*',
    redirect: '/appointment'
  }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

router.beforeEach((to, from, next) => {
  const ignoreRoutes = ['/login', '/dashboard', '/upcoming', '/results']
  if (ignoreRoutes.includes(to.path)) {
    return next()
  } else if (to.path !== '/appointment' && (!store.getters.location.address || !store.getters.payment)) {
    return next('/appointment')
  }
  return next()
})

export default router
