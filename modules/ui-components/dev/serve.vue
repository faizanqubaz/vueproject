<script lang="ts">
import Vue from 'vue'
import WzServiceCard from '../src/components/WzServiceCard/WzServiceCard.vue'
// Uncomment import and local "components" registration if library is not registered globally.
// import { WelzUicomponentsSample } from '@/entry.esm';

export default Vue.extend({
  components: { WzServiceCard },
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
      items: [
        {
          id: 1,
          name: 'Male'
        },
        {
          id: 2,
          name: 'Female'
        },
        {
          id: 3,
          name: 'Others'
        }
      ],
      tnc: [],
      rad: 'Terms and conditions',
      times: null,
      valid: false,
      service: null,
      date: null
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
  <div id="app" class="bg-lightGray">
    <div class="max-w-screen-md mx-auto py-10">
      <wz-menu >
        <template #activator=" { on }">
            <div class="text-primary cursor-pointer" v-on="on">Button</div>
        </template>
        <template>
          <div class="bg-red">Lorem, ipsum dolor.</div>
          <div class="">Lorem, ipsum dolor.</div>
          <div class="">Lorem, ipsum dolor.</div>
          <div class="">Lorem, ipsum dolor.</div>
        </template>

      </wz-menu>
      <div class="grid grid-cols-2 gap-4 my-4">
        <wz-service-card color="gray-300" v-model="service" itemKey="satu">
          <template>
            <h2>Coba satu</h2>
          </template>
        </wz-service-card>
        <wz-service-card color="blue-300" v-model="service" itemKey="dua">
          <template>
            <h2>Coba dua</h2>
          </template>
        </wz-service-card>
        <wz-service-card color="pink-300" v-model="service" itemKey="tiga">
          <template>
            <h2>Coba tiga</h2>
          </template>
        </wz-service-card>
        <wz-service-card color="green-300" v-model="service" itemKey="empat">
          <template>
            <h2>Coba empat</h2>
          </template>
        </wz-service-card>
      </div>
      <!-- <div class="">
        <wz-upload v-model="service">
          <h4>Add image</h4>
          <p class="font-normal text-gray-700 antialiased">Front of card</p>
        </wz-upload>
      </div> -->
      <!-- <div class="">
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
          icon="users"
          label="Gender"
          placeholder="Select"
          required
        />
      </div> -->

      <wz-form v-model="valid" ref="forms">
        <div class="">
          <wz-date-picker
            v-model="date"
            :inputForm="true"
            label="Date of birth"
            placeholder="mm/dd/yyyy"
            required
          >
          </wz-date-picker>
          <!-- <wz-date-picker v-model="date" :minDate="new Date()">
          </wz-date-picker> -->
        </div>
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
          itemText="name"
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

        <wz-button type="button" color="primary" :disabled="!valid" block>
          <div class="flex items-center justify-center">
            <!-- <wz-loader color="white" /> -->
            <div class="text-white">Proceed</div>
          </div>
        </wz-button>
        <wz-button type="button" block text>
          <div class="text-darkGray">← Go back</div>
        </wz-button>
      </wz-form>
      <wz-checkbox-card :itemKey="1" v-model="times" align="center" class="">
        <template #icon>
          <wz-icon name="clock" />
        </template>
        <template #content> 08.00 - 10.00 </template>
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
        <template #content> 08.00 - 10.00 </template>
      </wz-checkbox-card>
      <wz-checkbox-card :itemKey="3" v-model="times" align="center" class="">
        <template #icon>
          <wz-icon name="clock" />
        </template>
        <template #content> 08.00 - 10.00 </template>
      </wz-checkbox-card>
    </div>
  </div>
</template>
