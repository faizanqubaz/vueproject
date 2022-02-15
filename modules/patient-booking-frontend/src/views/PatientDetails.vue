<template>
  <div class="max-w-screen-md mx-auto py-10 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
          <div class="w-2/5">
        <wz-progress width="4/8" />
      </div>
      <div class="pt-7">
          <p class="text-xl">Who's being seen today</p>
      </div>
      <div class="pt-4 grid md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 gap-x-5 gap-y-3">
           <wz-input
            icon="user"
            label="First name"
            v-model="$store.state.patient.firstname"
            type="text"
            :error="false"
            errorMessage=""
          />
          <wz-input
            icon="user"
            label="Last name"
            v-model="$store.state.patient.lastname"
            type="text"
            :error="false"
            errorMessage=""
          />
          <wz-input
            icon="phone"
            label="Phonenumber"
            v-model="$store.state.patient.phonenumber"
            type="tel"
            :error="false"
            errorMessage=""
          />
        <wz-select
          v-model="$store.state.patient.gender"
          :items="genders"
          icon="users"
          label="Gender"
          required
          :rules="genderRules"
        />
        <wz-input
            icon="calendar"
            label="Date of birth"
            v-model="$store.state.patient.dateofbirth"
            type="date"
            :error="false"
            errorMessage=""
          />
             <wz-input
            icon="email"
            label="Email"
            v-model="$store.state.patient.email"
            type="email"
            :error="false"
            errorMessage=""
          />
      </div>
      <div class="pt-5">
        <wz-button color="primary" block>
        <div class="text-white">Proceed</div>
      </wz-button>
      </div>
      <div class="pt-5">
          <p class="text-gray-400 text-center text-sm">By continuing, you agree to recieve text messages, such as appointment reminders, to your phone number via SMS. Message and data rates may apply.</p>
      </div>
      <div class="pt-4 items-center">
       <wz-button type="button" block text  @click="$router.back()">
         <div class="text-darkGray">← Go back</div>
        </wz-button>
      </div>
        </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      genderResults: [],
      genderRules: [(gender) => !!gender || 'Gender is required'],
      genders: ['male', 'female', 'rather not say']
    }
  },
  methods: {
    gender () {
      this.genderResults = this.$store.state.patient.gender
      console.log(this.genderResults)
    }
  }
}
</script>
