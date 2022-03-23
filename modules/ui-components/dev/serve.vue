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
      // call: null
      name: null,
      gender: null,
      address: null,
      items: ['Male', 'Female', 'Others'],
      tnc: [],
      rad: 'Terms and conditions',
      times:null,
      valid: false
    }
  },
  watch: {
    rad(e) {
      console.log('ni rad', e)
    }
  }
})
</script>

<template>
  <div id="app">
    <div class="max-w-screen-md mx-auto py-10">
      <wz-loader borderStyle="dashed" size="24" />
      <wz-form v-model="valid" ref="forms">
        <wz-input
          v-model="name"
          label="Name"
          icon="home"
          class="mb-2"
          required
        />

        <wz-select
          v-model="gender"
          :items="items"
          label="Gender"
          icon="users"
          required
        />

        <wz-input v-model="address" label="address" icon="home" class="mb-2" />

        <wz-radio-button
          label="Terms and conditions"
          value="Terms and conditions"
          v-model="rad"
        >
        </wz-radio-button>
        <wz-radio-button
          label="Second choice"
          value="Second choice"
          v-model="rad"
        >
        </wz-radio-button>

        <!-- <wz-checkbox
          label="Terms and conditions"
          v-model="tnc"
          value="Terms and conditions"
        />
        <wz-checkbox label="Agreement" v-model="tnc" value="Agreement" />
        <wz-checkbox label="Other thing" v-model="tnc" value="Other thing" /> -->

        <wz-button
          type="button"
          :disabled="!valid"
          color="primary"
          @click="valid ? submit() : ''"
          block
        >
          <div class="flex items-center justify-center">
            <wz-loader color="white" />
            <div class="text-white">Proceed</div>
          </div>
        </wz-button>
        <wz-button type="button" block text>
          <div class="text-darkGray">← Go back</div>
        </wz-button>
      </wz-form>
       <wz-checkbox-card
          :itemKey="1"
          v-model="times"
          align="center"
          class=""
          
        >
          <template #icon>
            <wz-icon name="clock" />
          </template>
          <template #content>
          08.00 - 10.00
          </template>
        </wz-checkbox-card>
       <wz-checkbox-card
          :itemKey="2"
          v-model="times"
          align="center"
          class=""
          :disabled="true"
          
        >
          <template #icon>
            <wz-icon name="clock" />
          </template>
          <template #content>
          08.00 - 10.00
          </template>
        </wz-checkbox-card>
       <wz-checkbox-card
          :itemKey="3"
          v-model="times"
          align="center"
          class=""
          
        >
          <template #icon>
            <wz-icon name="clock" />
          </template>
          <template #content>
          08.00 - 10.00
          </template>
        </wz-checkbox-card>
    </div>
  </div>
</template>
