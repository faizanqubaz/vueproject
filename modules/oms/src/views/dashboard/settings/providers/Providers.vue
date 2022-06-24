<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :footer-props="{
          'items-per-page-options': [10, 25, 50, 100],
        }"
        :items="providerList"
        :search="search"
        :loading="loading"
        loading-text="Loading Providers..."
        item-key="_id"
        class="elevation-1 pa-3"
        mobile-breakpoint="0"
      >
        <template v-slot:top>
          <v-row align="center">
            <v-col sm="6" md="2" lg="6" xl="1">
              <v-dialog v-model="addDialog" max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn width="120px" color="primary" v-bind="attrs" v-on="on">
                    Add
                  </v-btn>
                </template>
                <template>
                  <v-stepper v-model="stepNumber" class="pt-5">
                    <v-stepper-header>
                      <v-stepper-step :complete="stepNumber > 1" step="1">
                        Profile
                      </v-stepper-step>
                      <v-divider />
                      <v-stepper-step :complete="stepNumber > 2" step="2">
                        Address
                      </v-stepper-step>
                      <v-divider />
                      <v-stepper-step step="3"> Service </v-stepper-step>
                    </v-stepper-header>
                    <v-stepper-items>
                      <v-stepper-content step="1">
                        <v-card-text>
                          <v-form
                            ref="providerForm"
                            v-model="validProviderForm"
                            lazy-validation
                          >
                            <v-container>
                              <v-row>
                                <v-col cols="12" sm="12" md="12">
                                  <v-text-field
                                    v-model="newProvider.firstName"
                                    label="First Name"
                                    :rules="requiredRules"
                                    required
                                  />
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                  <v-text-field
                                    v-model="newProvider.middleName"
                                    label="Middle Name"
                                  />
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                  <v-text-field
                                    v-model="newProvider.lastName"
                                    label="Last Name"
                                    :rules="requiredRules"
                                    required
                                  />
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                  <date-picker
                                    v-model="newProvider.dob"
                                    label="Date of birth"
                                  />
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                  <v-autocomplete
                                    v-model="newProvider.gender"
                                    :items="genderList"
                                    label="Gender"
                                    :rules="requiredRules"
                                    required
                                  />
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                  <v-text-field
                                    v-model="newProvider.phone"
                                    label="Phone Number"
                                    :rules="phoneRules"
                                    required
                                  />
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                  <v-text-field
                                    v-model="newProvider.email"
                                    label="Email Address"
                                    :rules="emailRules"
                                    required
                                  />
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-form>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer />
                          <v-btn
                            depressed
                            color="blue-grey"
                            text
                            @click="closeAddDialog(false)"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            depressed
                            color="primary"
                            @click="addProvider"
                            :loading="saveLoading"
                          >
                            Continue
                          </v-btn>
                        </v-card-actions>
                      </v-stepper-content>
                      <v-stepper-content step="2">
                        <v-card-text>
                          <v-form
                            ref="providerAddressForm"
                            v-model="validProviderAddressForm"
                            lazy-validation
                          >
                            <v-container>
                              <v-row>
                                <v-col cols="12" sm="12" md="12">
                                  <google-autocomplete
                                    v-model="autocompleteAddress"
                                    label="Address"
                                  />
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                  <v-text-field
                                    v-model="newAddress.apartment"
                                    placeholder="Apartment"
                                  />
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                  <v-switch
                                    v-model="newAddress.primary"
                                    label="Primary"
                                    color="success"
                                  />
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-form>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer />
                          <v-btn
                            depressed
                            color="blue-grey"
                            text
                            @click="closeAddDialog(true)"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            depressed
                            color="primary"
                            @click="addAddress"
                            :loading="saveLoading"
                          >
                            Continue
                          </v-btn>
                        </v-card-actions>
                      </v-stepper-content>
                      <v-stepper-content step="3">
                        <v-card-text>
                          <v-form
                            ref="providerServiceForm"
                            v-model="validProviderServiceForm"
                            lazy-validation
                          >
                            <v-container>
                              <v-row>
                                <v-col cols="12" sm="12" md="12">
                                  <v-autocomplete
                                    v-model="newService.cityId"
                                    :items="cityList"
                                    label="City"
                                    item-text="name"
                                    item-value="id"
                                    clearable
                                    dense
                                    :rules="requiredRules"
                                    required
                                  />
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                  <v-select
                                    v-model="
                                      serviceListByCity[newService.cityId]
                                    "
                                    :items="serviceList"
                                    item-text="name"
                                    item-value="id"
                                    label="Services"
                                    multiple
                                    chips
                                  />
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-form>
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer />
                          <v-btn
                            depressed
                            color="blue-grey"
                            text
                            @click="closeAddDialog(true)"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            depressed
                            color="primary"
                            @click="addService"
                            :loading="saveLoading"
                          >
                            Save
                          </v-btn>
                        </v-card-actions>
                      </v-stepper-content>
                    </v-stepper-items>
                  </v-stepper>
                </template>
              </v-dialog>
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="4" offset-md="2">
              <v-text-field
                v-model="search"
                prepend-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                clearable
                class="pa-0 ma-0"
              />
            </v-col>
          </v-row>
        </template>
        <template v-slot:[`item.actions`]="props">
          <v-btn
            depressed
            color="primary"
            @click="details(props.item)"
            class="mr-2"
          >
            Details
          </v-btn>
          <v-dialog v-model="deletedProvider[props.item.id]" max-width="400px">
            <v-card>
              <v-card-text>
                <div class="text-h5 text-center py-4">
                  Are you sure you want to delete
                  <strong>{{ deletedProvider.firstName }}</strong
                  >?
                </div>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-btn
                      depressed
                      block
                      color="error"
                      :loading="saveLoading"
                      @click="deleteProvider"
                    >
                      Delete
                    </v-btn>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-btn
                      depressed
                      block
                      text
                      color="blue-grey"
                      @click="$set(deletedProvider, props.item.id, false)"
                    >
                      Cancel
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-btn depressed color="error" @click.stop="setDelete(props.item)">
            Delete
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import Vue from "vue";
import OMSApi from "@/api/OMSApi";
import phone from "phone";
import email from "email-validator";
import GoogleAutocomplete from "@/components/GoogleAutocomplete.vue";
import DatePicker from "@/components/DatePicker.vue";

export default Vue.extend({
  components: { GoogleAutocomplete, DatePicker },
  data() {
    return {
      stepNumber: 1,
      newProviderId: 0,
      headers: [
        {
          text: "Id",
          value: "id",
        },
        {
          text: "First Name",
          value: "firstName",
        },
        {
          text: "Last Name",
          value: "lastName",
        },
        {
          text: "Email",
          value: "email",
        },
        {
          text: "Phone",
          value: "phone",
        },
        {
          text: "Actions",
          value: "actions",
          align: "center",
          width: "240px",
          sortable: false,
        },
      ],
      validProviderAddressForm: false,
      autocompleteAddress: {},
      newAddress: {
        street: "",
        apartment: "",
        city: "",
        state: "",
        zipCode: "",
        primary: false,
        longitude: 0,
        latitude: 0,
      },
      validProviderServiceForm: false,
      newService: {
        serviceIds: [],
        ciyId: null,
      },
      serviceList: [],
      serviceListByCity: {},
      cityList: [],
      providerList: [],
      loading: true,
      saveLoading: false,
      addDialog: false,
      validProviderForm: false,
      newProvider: {
        firstName: null,
        middleName: null,
        lastName: null,
        dob: null,
        gender: null,
        phone: null,
        email: null,
      },
      genderList: ["male", "female"],
      activePicker: null,
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
      search: "",
      deletedProvider: {},
    };
  },
  async created() {
    this.loading = true;
    await this.getProviders();
    await this.getServices();
    await this.getCities();
    this.populateServiceListByCity();
    this.loading = false;
  },
  methods: {
    async getProviders() {
      this.loading = true;
      try {
        const api = new OMSApi();
        const response = await api.getProviders();
        if (response.result.data.length) {
          this.providerList = response.result.data;
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
      }
    },
    async getServices() {
      try {
        const api = new OMSApi();
        const response = await api.getServices();
        if (response.result.data.length) {
          this.serviceList = response.result.data;
        }
      } catch (error) {
        console.error(error);
        this.$root.snackbar.show({
          message: "Failed to get services list",
          type: "error",
        });
      }
    },
    async getCities() {
      try {
        const api = new OMSApi();
        const response = await api.getCities();
        if (response.result.data.length) {
          this.cityList = response.result.data;
        }
      } catch (error) {
        console.error(error);
        this.$root.snackbar.show({
          message: "Failed to get city list",
          type: "error",
        });
      }
    },
    async closeAddDialog(isRefresh) {
      this.addDialog = false;
      this.stepNumber = 1;
      if (isRefresh) {
        this.loading = true;
        await this.getProviders();
        this.loading = false;
      }
    },
    async addProvider() {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        this.newProviderId = 0;
        const phone = "+1" + this.newProvider.phone;
        const response = await api.createProvider({
          ...this.newProvider,
          phone,
        });
        if (response && response.result) {
          this.newProviderId = response.result.id;
          this.saveLoading = false;
          this.stepNumber = 2;
        }
      } catch (error) {
        this.saveLoading = false;
        this.$root.snackbar.show({
          message: "Failed to add provider",
          type: "error",
        });
      }
    },
    getNewAddressData(addressData, placeResultData) {
      this.newAddress.street = addressData.name;
      this.newAddress.city = placeResultData.formatted_address.split(",")[1];
      this.newAddress.state = addressData.administrative_area_level_1;
      this.newAddress.zipCode = addressData.postal_code;
      this.newAddress.longitude = addressData.longitude;
      this.newAddress.latitude = addressData.latitude;
    },
    async addAddress() {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        const address = {
          ...this.autocompleteAddress,
          apartment: this.newAddress.apartment,
          primary: this.newAddress.primary || false,
          guardianId: null,
          patientId: null,
          providerId: this.newProviderId,
        };
        const response = await api.createAddress(address);
        if (response) {
          this.saveLoading = false;
          this.stepNumber = 3;
        }
      } catch (error) {
        this.saveLoading = false;
        this.$root.snackbar.show({
          message: "Failed to add address",
          type: "error",
        });
      }
    },
    populateServiceListByCity() {
      this.cityList.forEach((city) => {
        this.serviceListByCity[city.id] = [];
      });
    },
    async addService() {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        const cityIds = Object.keys(this.serviceListByCity);
        await Promise.all(
          cityIds.map(async (cityId) => {
            const services = this.serviceListByCity[cityId];
            if (cityId && services.length > 0) {
              const service = {
                providerId: this.newProviderId,
                services,
                cityId: parseInt(cityId),
              };
              await api.createProviderService(service);
            }
          })
        );

        this.saveLoading = false;
        this.closeAddDialog(true);
        this.$root.snackbar.show({
          message: "Service added successfully",
          type: "success",
        });
      } catch (error) {
        this.saveLoading = false;
        this.$root.snackbar.show({
          message: "Failed to add service",
          type: "error",
        });
      }
    },
    details(provider) {
      this.$router.push({
        name: "Provider Details",
        params: {
          provider,
          providerId: provider.id,
        },
      });
    },
    setDelete(props) {
      this.deletedProvider.firstName = props.firstName;
      this.deletedProvider.id = props.id;
      this.$set(this.deletedProvider, props.id, true);
    },
    async deleteProvider() {
      try {
        this.saveLoading = true;
        const api = new OMSApi();
        const response = await api.deleteProvider(this.deletedProvider.id);
        if (response) {
          this.saveLoading = false;
          this.$root.snackbar.show({
            message: response.message,
            type: "success",
          });
          this.$set(this.deletedProvider, this.deletedProvider.id, false);
          this.loading = true;
          await this.getProviders();
          this.loading = false;
        }
      } catch (error) {
        this.saveLoading = false;
        this.$root.snackbar.show({
          message: "Failed to delete provider",
          type: "error",
        });
      }
    },
    formatDate(date) {
      if (!date) {
        return null;
      }
      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) {
        return null;
      }
      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
    },
  },
  computed: {
    isProviderValid() {
      if (this.$refs.providerForm) {
        this.$refs.providerForm.validate();
      }
      return (
        this.newProvider.firstName &&
        this.newProvider.lastName &&
        this.newProvider.dob &&
        this.newProvider.gender &&
        this.newProvider.phone &&
        this.newProvider.email &&
        this.validProviderForm
      );
    },
    isProviderAddressValid() {
      if (this.$refs.providerAddressForm) {
        this.$refs.providerAddressForm.validate();
      }
      return (
        this.newAddress.street &&
        this.newAddress.city &&
        this.newAddress.state &&
        this.newAddress.zipCode &&
        this.newAddress.longitude &&
        this.newAddress.latitude &&
        this.validProviderAddressForm
      );
    },
    isProviderServiceValid() {
      if (this.$refs.providerServiceForm) {
        this.$refs.providerServiceForm.validate();
      }
      return this.newService.cityId && this.validProviderServiceForm;
    },
  },
  watch: {
    addDialog(newVal) {
      if (!newVal) {
        this.$refs.providerForm.reset();
        this.$refs.providerAddressForm.reset();
        this.newAddress.primary = false;
        this.newAddress.apartment = "";
        this.$refs.providerServiceForm.reset();
      }
    },
  },
});
</script>

<style scoped>
.v-stepper__header {
  box-shadow: none;
}
.v-stepper__content {
  padding-top: 0px;
}
</style>
