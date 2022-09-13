<template>
  <wz-page
    top-title="Book your appoinment"
    title="Patient Information"
    :next="true"
    :prev="true"
    :nextValid="formChecker"
    desc="Tell us about who's being seen."
    @to-next="nextPage"
    @to-prev="prevPage"
  >
    <div class="max-w-screen-lg mx-auto">
      <wz-form
        class="grid grid-cols-1 md:grid-cols-2 items-start gap-4 mb-4"
        v-model="isDetailsValid"
        ref="patientDetailsForm"
      >
        <wz-input
          icon="user"
          v-model="firstName"
          type="text"
          class="my-0"
          placeholder="First name"
          label="First Name"
          required
          :rules="firstNameRules"
        />
        <wz-input
          icon="user"
          v-model="lastName"
          type="text"
          class="my-0"
          placeholder="Last name"
          label="Last Name"
          required
          :rules="lastNameRules"
        />
        <wz-input
          icon="phone"
          v-model="phone"
          type="text"
          class="my-0"
          placeholder="000-121-2323"
          label="Phone"
          required
          :rules="phoneRules"
          @keypress="onlyNumber"
        />
        <wz-input
          icon="email"
          v-model="email"
          type="text"
          class="my-0"
          placeholder="Email"
          label="Email"
          required
          :rules="emailRules"
        />
        <wz-date-picker
          v-model="dob"
          :inputForm="true"
          label="Date of Birth"
          placeholder="mm/dd/yyyy"
          required
        >
        </wz-date-picker>
        <div class="">
          <div class="flex gap-2 items-center">
            <span class="font-medium">Gender</span>
            <span>
              <wz-icon class="w-5 h-5 fill-primary" name="info" />
            </span>
          </div>
          <div class="grid grid-cols-3 gap-6">
            <div
              class="border text-center rounded-lg py-sm cursor-pointer"
              @click="gender = 'male'"
              :class="
                gender === 'male'
                  ? 'border-primary text-primary'
                  : 'border-stroke'
              "
            >
              Male
            </div>
            <div
              class="border text-center rounded-lg py-sm cursor-pointer"
              @click="gender = 'female'"
              :class="
                gender === 'female'
                  ? 'border-primary text-primary'
                  : 'border-stroke'
              "
            >
              Female
            </div>
            <div
              class="border text-center rounded-lg py-sm cursor-pointer"
              @click="gender = 'other'"
              :class="
                gender === 'other'
                  ? 'border-primary text-primary'
                  : 'border-stroke'
              "
            >
              Other
            </div>
          </div>
        </div>
      </wz-form>
      <p class="text-center py-10">
        By continuing, you agree to receive text messages, such as appointment
        reminders, to your phone number by SMS. Message and data rates may
        apply.
      </p>
    </div>
  </wz-page>
</template>

<script>
import phone from "phone";
import email from "email-validator";
export default {
  data() {
    return {
      firstNameRules: [(firstName) => !!firstName || "First name is required"],
      lastNameRules: [(lastName) => !!lastName || "Last name is required"],
      phoneRules: [
        (phoneNumber) => !!phoneNumber || "Phone number is required",
        (phoneNumber) =>
          (phoneNumber && phone(phoneNumber, { country: "USA" }).isValid) ||
          "Phone number is invalid",
      ],
      emailRules: [
        (emailAddress) => !!emailAddress || "Email is required",
        (emailAddress) =>
          (emailAddress && email.validate(emailAddress)) ||
          "Email address is invalid",
      ],
      isDetailsValid: false,
    };
  },
  computed: {
    formChecker() {
      let valid = false;
      if (this.isDetailsValid && this.gender) {
        valid = true;
      }
      return valid;
    },
    firstName: {
      get() {
        return this.$store.state.Appointment.patient.firstName;
      },
      set(val) {
        this.$store.commit("SET_PATIENT_FIRSTNAME", val);
      },
    },
    lastName: {
      get() {
        return this.$store.state.Appointment.patient.lastName;
      },
      set(val) {
        this.$store.commit("SET_PATIENT_LASTNAME", val);
      },
    },
    phone: {
      get() {
        return this.$store.state.Appointment.patient.phone;
      },
      set(val) {
        this.$store.commit("SET_PATIENT_PHONE", val);
      },
    },
    email: {
      get() {
        return this.$store.state.Appointment.patient.email;
      },
      set(val) {
        this.$store.commit("SET_PATIENT_EMAIL", val);
      },
    },
    dob: {
      get() {
        return this.$store.state.Appointment.patient.dob;
      },
      set(val) {
        this.$store.commit("SET_PATIENT_DOB", val);
      },
    },
    gender: {
      get() {
        return this.$store.state.Appointment.patient.gender;
      },
      set(val) {
        this.$store.commit("SET_PATIENT_GENDER", val);
      },
    },
  },
  methods: {
    onlyNumber(event) {
      const keyCode = event.keyCode ? event.keyCode : event.which;
      if (keyCode < 48 || keyCode > 57) {
        event.preventDefault();
      }
    },
    nextPage() {
      this.$router.push("/booking/payment");
    },
    prevPage() {
      this.$router.back();
    },
  },
};
</script>

<style lang="scss">
.vc-popover-content-wrapper {
  .vc-day {
    min-width: 32px !important;
  }
}
.vc-nav-popover-container {
  background: white;
}
.vc-nav-title:hover {
  color: white;
}
.vc-nav-title {
  color: inherit;
}
.vc-nav-arrow:hover {
  background-color: var(--gray-200);
}
</style>
