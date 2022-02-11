<script lang="ts">
import Vue from 'vue'
// Uncomment import and local "components" registration if library is not registered globally.
// import { WelzUicomponentsSample } from '@/entry.esm';

export default Vue.extend({
  name: 'ServeDev'
  // components: {
  //  WelzUicomponentsSample,
  // }
})
</script>

<template>
  <div id="app">
    <wzi-calendar />
    <wz-icon name="calendar" color="primary" />
  </div>
</template>
