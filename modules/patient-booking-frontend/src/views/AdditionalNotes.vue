<template>
  <div class="max-w-screen-md mx-auto py-14 gap sm:gap-y-10">
    <div class="pl-4 pr-4 pt-0">
      <div class="w-2/5">
        <wz-progress width="4/8" />
      </div>
      <div class="pt-7">
        <p class="text-xl font-bold">Anything Else?</p>
      </div>
      <div class="pt-3 w-4/5">
        <p class="text-lg font-light">If you have note for us or anything we should know please write it</p>
      </div>
      <div class="pt-5 text-lg h-20">
        <wz-textarea
          icon="home"
          label="Additional notes"
          v-model="$store.state.appointment.notes"
          :error="false"
          errorMessage=""
          class=""
          />
          <br>
        <div class="pt-0">
          <wz-button color="primary" block @click="$router.push('/timeslots')">
            <div class="text-white">Proceed</div>
          </wz-button>
        </div>
        <div class="pt-4 items-center">
         <wz-button type="button" block text  @click="$router.back()">
           <div class="text-darkGray">← Go back</div>
        </wz-button>
      </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
})
</script>
