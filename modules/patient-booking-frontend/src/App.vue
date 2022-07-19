<template>
  <div id="app">
    <wz-navbar>
      <template #logo>
        <a href="https://www.welz.com">
          <img src="@/assets/welz_logo.png" alt="logo" class="h-6" />
        </a>
      </template>
      <template #icon>
        <div class="inline-flex">
          <div v-if="$auth.isAuthenticated">
            <router-link
              class="p-2 mx-1 rounded inline-flex cursor-pointer wz-menu-hover"
              v-for="(menu, index) in navMenu"
              :key="index"
              :to="menu.to"
              exact
            >{{ menu.name }}</router-link>
            <div
              class="p-2 mx-1 rounded inline-flex cursor-pointer wz-menu-hover"
              @click="logout"
            >
              Logout
            </div>
          </div>
          <router-link v-else class="p-2 mx-1 rounded inline-flex cursor-pointer wz-menu-hover" to="/login">Login</router-link>
          <a href="tel:+16465568500" class="p-2">
            <wz-icon name="device"  />
          </a>
        </div>
      </template>
    </wz-navbar>
    <router-view />
    <div class="fixed inset-0 bg-black bg-opacity-50" v-show="$store.getters.loading">
      <div class="flex flex-col w-full h-full items-center justify-center">
          <wz-loader color="white" size="12" class="mb-4" />
          <div class="text-white text-lg">Loading...</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data () {
    return {
      navMenu: [
        { name: 'Results', to: '/results' },
        { name: 'Upcoming', to: '/upcoming' }
      ]
    }
  },
  created () {
    window.onbeforeunload = () => {
      return 'Are you sure you want to leave this page?'
    }
  },
  methods: {
    logout () {
      this.$auth.logout({
        returnTo: window.location.origin
      })
    }
  }
})
</script>

<style>
.wz-menu-hover:hover, .wz-menu-hover.router-link-active {
  background-color: rgba(56, 86, 246, var(--tw-bg-opacity));
  color: white;
}
</style>
