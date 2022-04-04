<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
      <div class="w-2/5">
        <wz-progress width="4/8" />
      </div>
      <div class="pt-7">
        <p class="text-xl font-bold">Anything else?</p>
      </div>
      <div class="pt-3 w-4/5">
        <p class="text-lg font-light">If you have notes for us or anything we should know, please write them here</p>
      </div>
      <div class="pt-5 text-lg h-20">
        <wz-textarea
          icon="home"
          label="Additional Notes"
          v-model="notes"
          :error="false"
          errorMessage=""
          class=""
          />
          <br>
        <div class="pt-0">
          <wz-button color="primary" block @click="proceed">
            <p class="text-white">Proceed</p>
          </wz-button>
        </div>
        <div class="pt-4 items-center">
          <wz-button type="button" block text  @click="$router.back()">
            <p class="text-darkGray">← Go back</p>
          </wz-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
  data () {
    return {
      notes: ''
    }
  },
  beforeMount () {
    this.notes = this.$store.getters.notes
  },
  methods: {
    proceed () {
      if (this.notes !== this.$store.getters.notes) {
        this.$store.commit('setNotes', this.notes)
      }

      this.$router.push('/timeslots')
    }
  }
})
</script>
