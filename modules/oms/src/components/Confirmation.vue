<template>
  <v-dialog v-model="confirmationDialog" max-width="400px">
    <v-card>
      <v-card-text>
        <slot>
          <div class="text-h5 text-center py-4">
            Are you sure you want to deletee ?
          </div>
        </slot>
        <div class="" v-if="preventText">
          <div class="">
            Please type
            <span class="font-weight-bold">{{ preventText }}</span> to confirm.
          </div>
          <div class="">
            <v-text-field v-model="preventType" />
          </div>
        </div>
        <v-row>
          <v-col cols="12" sm="6">
            <v-btn
              depressed
              block
              color="error"
              :disabled="disabled"
              :loading="loading"
              @click="$emit('delete')"
            >
              Delete
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6">
            <v-btn
              depressed
              text
              block
              color="blue-grey"
              @click="$emit('input', false)"
            >
              Cancel
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: null,
    loading: {
      type: Boolean,
      default: false,
    },
    preventText: null,
  },
  data() {
    return {
      disabled: false,
      preventType: null,
    };
  },
  mounted() {
    if (this.preventText) {
      this.disabled = true;
    }
  },
  watch: {
    preventType(val) {
      if (val === this.preventText) {
        this.disabled = false;
      } else {
        this.disabled = true;
      }
    },
    preventText(val) {
      if (val && this.preventType !== val) {
        this.disabled = true;
      }
    },
    confirmationDialog(val) {
      if (!val) {
        this.preventType = null;
      }
    },
  },
  computed: {
    confirmationDialog: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
};
</script>

<style></style>
