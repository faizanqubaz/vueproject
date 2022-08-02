<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        @click:row="handleRow"
        :headers="headers"
        :items="visitList"
        :loading="isLoading"
        loading-text="Loading Visits..."
        item-key="_id"
        class="elevation-1 pa-3 row-pointer"
        mobile-breakpoint="0"
        fixed-header
        height="70vh"
        :options.sync="options"
        :server-items-length="visitListParams.totalRecords"
        :footer-props="{
          'items-per-page-options': [50, 100, 200, 500, 1000, 2000],
        }"
      >
        <template v-slot:top>
          <v-row align="center" class="mb-2">
            <v-col sm="6" md="6" lg="6" xl="1">
              <div class="d-flex">
                <v-btn
                  width="120px"
                  color="primary"
                  @click="visitDialog = true"
                  dark
                  class="mr-4"
                >
                  Add
                </v-btn>

                <v-menu
                  v-model="menuFilter"
                  :close-on-content-click="false"
                  :nudge-width="200"
                  offset-x
                  v-if="page !== 'open'"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-bind="attrs" v-on="on">
                      <v-progress-circular
                        v-if="isLoadingFilter"
                        indeterminate
                        width="2"
                        size="20"
                        class="mr-2"
                      />
                      <v-icon v-else class="mr-2">mdi-filter-variant</v-icon>
                      Filters
                    </v-btn>
                  </template>

                  <v-card>
                    <v-card-title> Filter Options </v-card-title>
                    <v-card-text class="pb-0">
                      <v-autocomplete
                        v-model="listParams.service"
                        :items="serviceList"
                        label="Service"
                        item-text="name"
                        item-value="id"
                        clearable
                        dense
                      />
                      <v-autocomplete
                        v-model="listParams.provider"
                        :items="providerList"
                        label="Provider"
                        item-text="email"
                        item-value="id"
                        clearable
                        dense
                      />
                      <v-autocomplete
                        v-model="listParams.status"
                        :items="statusList"
                        label="Status"
                        item-text="label"
                        item-value="value"
                        clearable
                        dense
                      />
                    </v-card-text>
                    <v-card-actions>
                      <v-spacer />
                      <v-btn
                        v-if="renderFilterBtn()"
                        text
                        width="72px"
                        @click="clearFilters"
                      >
                        Clear
                      </v-btn>
                      <v-btn
                        text
                        color="primary"
                        width="72px"
                        @click="applyFilters"
                      >
                        Apply
                      </v-btn>
                    </v-card-actions>
                  </v-card>
                </v-menu>
              </div>
            </v-col>

            <v-col sm="12" md="4" offset-md="2" lg="4">
              <v-spacer />
              <v-text-field
                v-model="listParams.search"
                prepend-icon="mdi-magnify"
                label="Search"
                placeholder="Search by Patient Name"
                clearable
                class="pa-0 ma-0"
                hide-details
                @keydown.enter.prevent="getVisits()"
                @blur="getVisits()"
              />
            </v-col>
          </v-row>
        </template>

        <template v-slot:[`item.id`]="props">
          {{ props.item.id }}
        </template>

        <template v-slot:[`item.date`]="props">
          <span style="white-space: nowrap">
            {{ formatDate(props.item.date) }}
          </span>
        </template>

        <template v-slot:[`item.scheduledTime`]="props">
          <span style="white-space: nowrap">
            {{ formatTimeCustom(props.item.scheduledStartTime) }} -
            {{ formatTimeCustom(props.item.scheduledEndTime) }}
          </span>
        </template>

        <template v-slot:[`item.patient`]="props">
          <span style="white-space: nowrap">
            {{ props.item.patient.firstName }}
            {{ props.item.patient.lastName }}
          </span>
        </template>
        <template v-slot:[`item.status`]="props">
          <v-chip
            small
            outlined
            class="text-center text-uppercase font-weight-medium chipMiddle"
            :color="colorStatus(props.item.status)"
          >
            {{ props.item.status }}
          </v-chip>
        </template>

        <template v-slot:[`item.service`]="props">
          <span style="white-space: nowrap" v-if="props.item.service">
            <v-icon :color="statusColor[props.item.service.active]">
              mdi-circle-medium
            </v-icon>
            {{ props.item.service.name }}
          </span>
        </template>

        <template v-slot:[`item.provider`]="props">
          <span style="white-space: nowrap">
            {{ props.item.provider && props.item.provider.firstName }}
            {{ props.item.provider && props.item.provider.lastName }}
          </span>
        </template>

        <template v-slot:[`item.address`]="props">
          {{ renderAddress(props.item) }}
        </template>
      </v-data-table>
    </v-card>

    <v-snackbar outlined color="success" top v-model="snackbar.active">
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn color="red" text v-bind="attrs" @click="snackbar.active = false">
          Close
        </v-btn>
      </template>
    </v-snackbar>

    <v-dialog v-model="visitDialog" max-width="600px">
      <v-card>
        <v-stepper v-model="stepNumber" class="stepper">
          <v-stepper-header class="stepperHeader">
            <v-stepper-step :complete="stepNumber > 1" step="1">
              Address
            </v-stepper-step>
            <v-divider />
            <v-stepper-step :complete="stepNumber > 2" step="2">
              Patient
            </v-stepper-step>
            <v-divider />
            <v-stepper-step :complete="stepNumber > 3" step="3">
              Service
            </v-stepper-step>
            <v-divider />
            <v-stepper-step step="4"> Visit </v-stepper-step>
          </v-stepper-header>
          <v-stepper-items>
            <!-- step 1 -->
            <v-stepper-content step="1">
              <v-form ref="addForm" v-model="addressForm" lazy-validation>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <google-autocomplete
                        v-model="autocompleteAddress"
                        label="Address"
                      />
                      <v-text-field
                        v-model="newAddress.apartment"
                        placeholder="Apartment"
                        label="Apartment"
                        required
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-switch
                        v-model="newAddress.primary"
                        label="Primary"
                        color="success"
                      />
                    </v-col>

                    <v-col cols="12" class="text-right">
                      <v-btn
                        color="blue-grey"
                        depressed
                        text
                        @click="closeAddDialog()"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary"
                        :loading="visitLoading"
                        @click="newAddress.street ? (stepNumber = 2) : ''"
                      >
                        Continue
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-stepper-content>
            <!-- end step 1 -->
            <!-- step 2 -->
            <v-stepper-content step="2">
              <v-form
                ref="addPatientForm"
                v-model="isAddPatientValid"
                lazy-validation
              >
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="patientForm.firstName"
                        placeholder="First Name"
                        label="First Name"
                        :rules="requiredRules"
                        required
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="patientForm.lastName"
                        placeholder="Last Name"
                        label="Last Name"
                        :rules="requiredRules"
                        required
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <date-picker
                        v-model="patientForm.dob"
                        label="Date of birth"
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="patientForm.phone"
                        placeholder="Phone Number"
                        label="Phone Number"
                        :rules="phoneRules"
                        required
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-autocomplete
                        v-model="patientForm.gender"
                        :items="genderItems"
                        item-text="label"
                        item-value="value"
                        :rules="requiredRules"
                        label="Gender"
                      />
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field
                        v-model="patientForm.email"
                        placeholder="Email"
                        label="Email"
                        :rules="emailRules"
                        required
                      />
                    </v-col>

                    <v-col cols="12" class="text-right">
                      <v-btn
                        color="blue-grey"
                        depressed
                        text
                        @click="closeAddDialog()"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary"
                        :loading="visitLoading"
                        @click="
                          $refs.addPatientForm.validate()
                            ? (stepNumber = 3)
                            : ''
                        "
                      >
                        Continue
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-stepper-content>
            <!-- end step 2 -->
            <!-- step 3 -->
            <v-stepper-content step="3">
              <v-form
                ref="addServiceForm"
                v-model="isAddFormValid"
                lazy-validation
              >
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <v-autocomplete
                        v-model="addFormValues.serviceId"
                        :items="serviceList"
                        label="Service"
                        item-text="name"
                        :rules="requiredRules"
                        return-object
                      />
                    </v-col>
                    <v-col cols="12" class="text-right">
                      <v-btn
                        color="blue-grey"
                        depressed
                        text
                        @click="closeAddDialog()"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary"
                        :loading="visitLoading"
                        @click="addService"
                      >
                        Continue
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-stepper-content>
            <!-- end step 3 -->
            <!-- step 4 -->
            <v-stepper-content step="4">
              <v-form ref="addForm" v-model="isAddFormValid" lazy-validation>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="12" md="12">
                      <date-picker v-model="visitDate" label="Visit Date" />
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-radio-group v-model="visitTime" class="ma-0">
                        <v-row>
                          <v-col
                            cols="6"
                            v-for="(time, index) in availableDates"
                            :key="index"
                          >
                            <v-radio
                              :label="
                                formatTimeCustom(time.startTime) +
                                ' - ' +
                                formatTimeCustom(time.endTime)
                              "
                              :value="time.startTime + ' - ' + time.endTime"
                            ></v-radio>
                          </v-col>
                        </v-row>
                      </v-radio-group>
                    </v-col>
                    <v-col cols="12" class="text-right">
                      <v-btn
                        color="blue-grey"
                        depressed
                        text
                        @click="closeAddDialog()"
                      >
                        Cancel
                      </v-btn>
                      <v-btn
                        color="primary"
                        :loading="isSubmitting"
                        @click="addVisit"
                      >
                        Save
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-container>
              </v-form>
            </v-stepper-content>
            <!-- end step 4 -->
          </v-stepper-items>
        </v-stepper>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Vue from "vue";
import OMSApi from "@/api/OMSApi";
import email from "email-validator";
import phone from "phone";
import moment from "moment";
import GoogleAutocomplete from "@/components/GoogleAutocomplete.vue";
import { VisitStatuses, ToISODateString } from "@/utils";
import DatePicker from "@/components/DatePicker.vue";

export default Vue.extend({
  name: "visits-page",
  components: {
    GoogleAutocomplete,
    DatePicker,
  },
  props: {
    page: null,
  },
  data() {
    return {
      headers: [
        { text: "ID", value: "id" },
        { text: "Date", value: "date" },
        {
          text: "Scheduled Time",
          value: "scheduledTime",
          sortable: false,
        },
        { text: "Service", value: "service" },
        { text: "Patient", value: "patient" },
        { text: "Status", value: "status", align: "center", sortable: false },
        { text: "Provider", value: "provider" },
        { text: "Address", value: "address", sortable: false },
      ],
      menuFilter: false,
      options: {},
      listParams: {
        service: null,
        provider: null,
        status: null,
        search: null,
      },
      visitList: [],
      visitListParams: {
        currentPage: null,
        limit: null,
        totalPages: null,
        totalRecords: null,
      },
      serviceList: [],
      providerList: [],
      statusList: VisitStatuses,
      visitDialog: false,
      addFormValues: {
        serviceId: null,
        addressId: 282,
        patientId: 186,
      },
      patientForm: {
        firstName: null,
        lastName: null,
        dob: null,
        gender: null,
        phone: null,
        email: null,
      },
      isAddFormValid: false,
      isAddPatientValid: false,
      addPickerDate: false,
      isLoading: false,
      isLoadingFilter: false,
      isSubmitting: false,
      statusColor: {
        true: "success",
        false: "error",
      },
      snackbar: {
        message: null,
        active: false,
      },
      stepNumber: 1,
      address: null,
      addressForm: false,
      newAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        primary: false,
        longitude: 0,
        latitude: 0,
        apartment: "",
      },
      autocompleteAddress: {},
      visitLoading: false,
      stateCheck: null,
      serviceTimeSlots: null,
      visitDate: null,
      visitTime: null,
      genderItems: [
        { label: "Male", value: "male" },
        { label: "Female", value: "female" },
        { label: "Other", value: "other" },
      ],
      availableDates: null,
      requiredRules: [(v) => !!v || "Required"],
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
    };
  },
  async created() {
    this.$store.commit("SET_LOADING", true);
    await this.getServices();
    await this.getProviders();
    await this.getServiceTimeSlots();
    this.$store.commit("SET_LOADING", false);
  },
  methods: {
    async getVisits() {
      const { page, itemsPerPage } = this.options;
      try {
        this.isLoading = true;
        const api = new OMSApi();
        const params = {
          page: page || 1,
          limit: itemsPerPage || 50,
          service: this.listParams.service,
          provider: this.listParams.provider,
          status: this.page === "open" ? "booked" : this.listParams.status,
          search: this.listParams.search,
          sortOrder: this.page === "open" ? "ASC" : null,
        };
        const res = await api.getVisits(params);
        if (res.result) {
          this.visitList = res.result.data;
          this.visitListParams = res.result;
        }
      } catch (error) {
        console.error(error);
        this.snackbar.message = "Failed to get visits list";
        this.snackbar.active = true;
      } finally {
        this.isLoading = false;
      }
    },
    async getServices() {
      try {
        this.isLoadingFilter = true;
        const api = new OMSApi();
        const res = await api.getServices();
        if (res.result) {
          this.serviceList = res.result.data;
        }
      } catch (error) {
        console.error(error);
        this.snackbar.message = "Failed to get services list";
        this.snackbar.active = true;
      } finally {
        this.isLoadingFilter = false;
      }
    },
    async getServiceTimeSlots() {
      try {
        this.isLoadingFilter = true;
        const api = new OMSApi();
        const res = await api.getServiceTimeSlots();
        if (res.result) {
          this.serviceTimeSlots = res.result.data;
        }
      } catch (error) {
        console.error(error);
        this.snackbar.message = "Failed to get services time slots";
        this.snackbar.active = true;
      } finally {
        this.isLoadingFilter = false;
      }
    },
    getPatientItemText(item) {
      return `${item.firstName} ${item.lastName}`;
    },
    async getProviders() {
      try {
        this.isLoadingFilter = true;
        const api = new OMSApi();
        const res = await api.getProviders();
        if (res.result) {
          this.providerList = res.result.data;
        }
      } catch (error) {
        console.error(error);
      } finally {
        this.isLoadingFilter = false;
      }
    },
    async addVisit() {
      try {
        this.isSubmitting = true;
        this.$store.commit("SET_LOADING", true);
        await this.addAddress();
        await this.addPatient();

        const api = new OMSApi();
        let params = {
          date: moment(this.visitDate).format("YYYY-MM-DD"),
          scheduledStartTime: this.visitTime.split(" - ")[0],
          scheduledEndTime: this.visitTime.split(" - ")[1],
          serviceId: this.addFormValues.serviceId.id,
          patientId: this.addFormValues.patientId,
          addressId: this.addFormValues.addressId,
        };
        const res = await api.postVisit(params);
        if (res) {
          this.getVisits();
          this.closeAddDialog();
          this.snackbar.message = res.message;
          this.snackbar.active = true;
        }
      } catch (error) {
        console.error(error);
        this.snackbar.message = "Failed to add visit";
        this.snackbar.active = true;
      } finally {
        this.isSubmitting = false;
        this.$store.commit("SET_LOADING", false);
      }
    },
    async checkAddress() {
      this.visitLoading = true;
      try {
        const api = new OMSApi();
        const response = await api.getServiceByZipcode(this.newAddress.zipCode);
        if (response.result.serviceGroups.length === 0) {
          this.newAddress.street = null;
          this.newAddress.city = null;
          this.newAddress.state = null;
          this.newAddress.zipCode = null;
          this.newAddress.longitude = null;
          this.newAddress.latitude = null;
          this.$root.snackbar.show({
            message:
              "Sorry! We do not have services in your location at this moment",
            type: "error",
          });
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Sorry, something went wrong. Please try again",
          type: "error",
        });
      } finally {
        this.visitLoading = false;
      }
    },
    getNewAddressData(addressData) {
      this.newAddress.street = addressData.street;
      this.newAddress.city = addressData.city;
      this.newAddress.state = addressData.state;
      this.newAddress.zipCode = addressData.zipCode;
      this.newAddress.longitude = addressData.longitude;
      this.newAddress.latitude = addressData.latitude;
      this.stateCheck = this.serviceTimeSlots.filter((res) => {
        return res.city.state == this.newAddress.city;
      });
      this.checkAddress();
    },
    async addAddress() {
      try {
        const api = new OMSApi();
        const response = await api.createAddress(this.newAddress);
        if (response) {
          this.addFormValues.addressId = response.result.id;
          // this.stepNumber = 2;
        }
      } catch (error) {
        this.saveLoading = false;
        this.$root.snackbar.show({
          message: "Failed to add address",
          type: "error",
        });
      }
    },
    async addPatient() {
      try {
        const api = new OMSApi();
        const phone = "+1" + this.patientForm.phone;
        const patientForm = {
          ...this.patientForm,
          phone,
          dob: ToISODateString(this.patientForm.dob),
        };
        const response = await api.addPatients(patientForm);
        if (response) {
          this.addFormValues.patientId = response.result.id;
        }
      } catch (error) {
        this.saveLoading = false;
        this.$root.snackbar.show({
          message: "Failed to add patient",
          type: "error",
        });
      }
    },
    addService() {
      if (!this.$refs.addServiceForm.validate()) {
        return;
      }
      this.serviceTimeSlots = this.serviceTimeSlots.filter((res) => {
        return res.service.id == this.addFormValues.serviceId.id;
      });
      this.stepNumber = 4;
    },
    closeAddDialog() {
      this.visitDialog = false;
    },
    formatDate(date) {
      return date ? moment(date).format("L") : "";
    },
    formatTimeCustom(time) {
      return time ? moment(time, "HH:mm:ss").format("hh:mm A") : "";
    },
    handleRow(value) {
      this.$router.push("/visits/" + value.id);
    },
    colorStatus(val) {
      let color;
      switch (val) {
        case "enroute":
          color = "orange";
          break;
        case "completed":
          color = "green";
          break;
        case "started":
          color = "light-blue darken-4";
          break;
        case "canceled":
          color = "error";
          break;

        default:
          color = "primary";
          break;
      }
      return color;
    },
    applyFilters() {
      this.getVisits();
      this.menuFilter = false;
    },
    clearFilters() {
      this.listParams = {
        service: null,
        provider: null,
        status: null,
      };
      this.getVisits();
    },
    renderAddress(item) {
      return `${item.address.city}${item.address.city ? ", " : " "}
          ${item.address.state}`;
    },
    renderFilterBtn() {
      const isFilterActive = Object.keys(this.listParams).find(
        (key) => this.listParams[key] !== null
      );
      return isFilterActive;
    },
  },
  watch: {
    options: {
      handler() {
        this.getVisits();
      },
      deep: true,
    },
    visitDate(val) {
      let newDate = moment(val).day();
      let newService = this.serviceTimeSlots.filter((res) => {
        return res.dayOfWeek == newDate;
      });
      this.availableDates = newService;
    },
    autocompleteAddress(val) {
      this.getNewAddressData(val);
    },
  },
});
</script>
<style lang="css" scoped>
.row-pointer >>> tbody tr :hover {
  cursor: pointer;
}
.chipMiddle {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.stepper {
  overflow: visible;
}
.stepperHeader {
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
}
</style>
