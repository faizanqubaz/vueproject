import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import './assets/style.css'
import welz from 'welzuicomponents'
import { Auth0Plugin } from './auth'
import VueMeta from 'vue-meta'
import VueTailwind from 'vue-tailwind'
import TTable from 'vue-tailwind/dist/t-table'
import TButton from 'vue-tailwind/dist/t-button'
import TModal from 'vue-tailwind/dist/t-modal'

const settings = {
  't-table': {
    component: TTable
  },
  't-modal': {
    component: TModal
  },
  't-button': {
    component: TButton,
    props: {
      fixedClasses: 'block px-4 py-2 transition duration-100 ease-in-out focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed',
      classes: 'text-white bg-blue-500 border border-transparent shadow-sm rounded hover:bg-blue-600',
      variants: {
        secondary: 'text-gray-800 bg-white border border-gray-300 shadow-sm hover:text-gray-600',
        error: 'text-white bg-red border border-transparent rounded shadow-sm hover:bg-red-600',
        success: 'text-white bg-green border border-transparent rounded shadow-sm hover:bg-green-600',
        link: 'text-blue-500 hover:text-blue-600'
      }
    }
  }
}

Vue.use(VueTailwind, settings)

Vue.use(welz)
Vue.use(VueMeta, {
  refreshOnceOnNavigation: true
})

Vue.use(Auth0Plugin, {
  domain: process.env.VUE_APP_WELZ_AUTH0_DOMAIN,
  clientId: process.env.VUE_APP_WELZ_PBF_AUTH0_CLIENT_ID,
  audience: process.env.VUE_APP_WELZ_OMS_AUTH0_AUDIENCE,
  onRedirectCallback: (appState: { targetUrl: string }) => {
    router.push(
      appState && appState.targetUrl
        ? appState.targetUrl
        : window.location.pathname
    )
  }
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: (h) => h(App)
}).$mount('#app')
