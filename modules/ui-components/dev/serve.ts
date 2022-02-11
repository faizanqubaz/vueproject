import Vue, { VNode } from 'vue'
import Dev from './serve.vue'
import './style.css'
// To register individual components where they are used (serve.vue) instead of using the
// library as a whole, comment/remove this import and it's corresponding "Vue.use" call
import WelzUicomponents from '@/entry.esm'
Vue.use(WelzUicomponents)

Vue.config.productionTip = false

new Vue({
  render: (h): VNode => h(Dev)
}).$mount('#app')
