<script lang="ts">
import Vue from 'vue'
// Uncomment import and local "components" registration if library is not registered globally.
// import { WelzUicomponentsSample } from '@/entry.esm';

export default Vue.extend({
  name: 'ServeDev',
  // components: {
  //  WelzUicomponentsSample,
  // },
  data() {
    return {
      call: null
    }
  }
})
</script>

<template>
  <div id="app">
    <wz-date-picker v-model="call" />
  </div>
</template>
