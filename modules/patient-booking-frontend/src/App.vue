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
