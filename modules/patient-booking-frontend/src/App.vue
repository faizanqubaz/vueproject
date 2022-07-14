<template>
  <div id="app">
    <wz-navbar>
      <template #logo>
        <a href="https://www.welz.com">
          <img src="@/assets/welz_logo.png" alt="logo" class="h-6" />
        </a>
      </template>
      <template #icon>
        <a href="tel:+16465568500">
          <wz-icon name="device"  />
        </a>
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
  created () {
    window.onbeforeunload = () => {
      return 'Are you sure you want to leave this page?'
    }
  }
})
</script>

<style lang="scss"></style>
