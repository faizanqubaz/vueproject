<template>
  <v-menu
    v-model="datePicker"
    :close-on-content-click="false"
    :nudge-right="40"
    transition="scale-transition"
    offset-y
    max-width="290px"
    min-width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-text-field
        v-model="inputVal"
        :label="label ? label : 'Date'"
        hint="MM/DD/YYYY"
        persistent-hint
        v-bind="attrs"
        v-on="on"
        @input="dateVisitFormat('input')"
      />
    </template>
    <v-date-picker
      v-model="date"
      no-title
      @input="dateVisitFormat('click')"
    ></v-date-picker>
  </v-menu>
</template>

<script>
import moment from "moment";
export default {
  props: {
    value: null,
    label: null,
  },
  data() {
    return {
      datePicker: false,
      date: null,
    };
  },
  computed: {
    inputVal: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("input", val);
      },
    },
  },
  mounted() {
    if (this.value) {
      this.dateVisitFormat("input");
    }
  },
  methods: {
    dateVisitFormat(condition) {
      this.$nextTick(() => {
        if (
          condition === "input" &&
          moment(this.inputVal, "MM/DD/YYYY", true).isValid()
        ) {
          this.date = moment(this.inputVal).format("YYYY-MM-DD");
        } else if (condition === "click") {
          this.inputVal = this.dateFormat(this.date);
        }
        this.datePicker = false;
      });
    },
    dateFormat(date) {
      return moment(date).format("MM/DD/YYYY");
    },
  },
};
</script>

<style></style>
