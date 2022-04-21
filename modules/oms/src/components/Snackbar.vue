<template>
  <v-snackbar :color="color" :timeout="timer" v-model="showSnackbar" top>
    <v-icon left>{{ icon }}</v-icon
    >{{ message }}
  </v-snackbar>
</template>

<script>
export default {
  name: "snackbar",
  data() {
    return {
      showSnackbar: false,
      message: "",
      color: "success",
      icon: "mdi-check",
      timer: 3000,
    };
  },
  methods: {
    show(data) {
      switch (data.type) {
        case "success":
          this.color = "success";
          this.icon = "mdi-check";
          break;
        case "error":
          this.color = "error";
          this.icon = "mdi-close";
      }

      this.message = data.message || 'missing "message".';
      this.timer = data.timer || 3000;
      this.showSnackbar = true;
    },
  },
};
</script>
