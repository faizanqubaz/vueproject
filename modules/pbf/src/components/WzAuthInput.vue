<template>
  <div class="my-4">
    <div class="mb-1">
      <label class="font-medium text-[#233071]">{{ label }}</label>
    </div>
    <div
      class="flex items-center w-full border-2 px-lg py-3 rounded-full cursor-text"
      :class="[
        focus && !errorMessage ? 'border-primary' : '',
        !focus && !errorMessage ? 'border-stroke' : '',
        errorMessage ? 'border-red' : '',
      ]"
      @click="$refs.refInput.focus(), (focus = true)"
    >
      <wz-icon
        v-if="type === 'email'"
        name="auth-email"
        class="pt-1 mr-4 text-center mx-auto w-6 h-6 fill-tetriary"
      />
      <wz-icon
        v-if="type === 'password'"
        name="auth-password"
        class="mr-4 text-center mx-auto w-5 h-5 fill-tetriary"
      />
      <!-- <div v-if="icon">
        <wz-icon
          :name="icon"
          class="mr-4 text-center mx-auto w-5 h-5 fill-tetriary"
        />
      </div> -->
      <input
        :type="type"
        class="w-full bg-transparent p-0 m-0 border-none focus:ring-transparent"
        ref="refInput"
        @blur="focus = false"
        v-model="inputVal"
        @keyup="rulesChecker"
        @keypress="$emit('keypress', $event)"
        :placeholder="placeholder"
      />
    </div>
    <div class="bodySmall text-red" v-show="errorMessage">
      {{ errorMessage }}
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: "text",
    },
    icon: {
      type: String,
      default: "",
    },
    label: {
      type: String,
      default: "",
    },
    placeholder: {
      type: String,
      default: "",
    },
    rules: {
      type: Array,
      default: () => [],
    },
    required: {
      type: Boolean,
      default: false,
    },
    value: null,
  },
  data() {
    return {
      focus: false,
      errorMessage: null,
    };
  },
  methods: {
    rulesChecker() {
      if (this.rules && this.rules.length > 0) {
        for (let i = 0; i < this.rules.length; i++) {
          if (this.rules[i](this.inputVal) !== true) {
            this.errorMessage = this.rules[i](this.inputVal);
            return;
          } else {
            this.errorMessage = null;
          }
        }
      }
    },
  },

  computed: {
    inputVal: {
      get() {
        return this.value;
      },
      set(val) {
        if (this.required && this.rules.length === 0) {
          val ? (this.errorMessage = false) : (this.errorMessage = "Required");
        }
        this.$emit("input", val);
      },
    },
  },
};
</script>
