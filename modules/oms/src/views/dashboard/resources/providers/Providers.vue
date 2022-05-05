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
            <v-col sm="6" md="2" lg="2" xl="1">
              <v-dialog v-model="addDialog" max-width="600px" persistent>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    block
                    color="primary"
                    v-bind="attrs"
                    v-on="on"
                  >
                    Add Provider
                  </v-btn>
                </template>
                <template>
                  <v-stepper v-model="stepNumber" class="pt-5">
                    <v-stepper-header>
                      <v-stepper-step
                        :complete="stepNumber > 1"
                        step="1"
                      >
                        Profile
                      </v-stepper-step>
                      <v-divider/>
                      <v-stepper-step
                        :complete="stepNumber > 2"
                        step="2"
                      >
                        Address
                      </v-stepper-step>
                      <v-divider/>
                      <v-stepper-step
                        step="3"
                      >
                        Service
                      </v-stepper-step>
                    </v-stepper-header>
                    <v-stepper-items>
                      <v-stepper-content step="1">
                        <v-card-text>
                          <v-form ref="providerForm" v-model="validProviderForm" lazy-validation>
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
                                  <v-flex>
                                    <v-menu
                                      ref="datePicker"
                                      v-model="datePicker"
                                      :close-on-content-click="false"
                                      transition="scale-transition"
                                      offset-y
                                      min-width="auto"
                                    >
                                      <template v-slot:activator="{ on, attrs }">
                                        <v-text-field
                                          v-model="formattedDate"
                                          label="Date of Birth"
                                          hint="MM/DD/YYYY"
                                          persistent-hint
                                          v-bind="attrs"
                                          @blur="newProvider.dob = parseDate(formattedDate)"
                                          v-on="on"
                                          :rules="requiredRules"
                                          required
                                        />
                                      </template>
                                      <v-date-picker
                                        v-model="newProvider.dob"
                                        no-title
                                        :active-picker.sync="activePicker"
                                        :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                                        min="1920-01-01"
                                        @change="save"
                                      />
                                    </v-menu>
                                  </v-flex>
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
                          <v-btn
                            depressed
                            color="primary"
                            @click="addProvider"
                            :disabled="!isProviderValid"
                            :loading="saveLoading"
                          >
                            Save &amp; Continue
                          </v-btn>
                          <v-btn
                            depressed
                            color="secondary"
                            @click="closeAddDialog(false)"
                          >
                            Cancel
                          </v-btn>
                        </v-card-actions>
                      </v-stepper-content>
                      <v-stepper-content step="2">
                        <v-card-text>
                          <v-form ref="providerAddressForm" v-model="validProviderAddressForm" lazy-validation>
                            <v-container>
                              <v-row>
                                <v-col cols="12" sm="12" md="12">
                                  <vuetify-google-autocomplete
                                    ref="providerNewAddress"
                                    id="providerNewMap"
                                    classname="form-control"
                                    placeholder="Address"
                                    v-on:placechanged="getNewAddressData"
                                    country="us"
                                    :rules="requiredRules"
                                    required
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
                          <v-btn
                            depressed
                            color="primary"
                            @click="addAddress"
                            :disabled="!isProviderAddressValid"
                            :loading="saveLoading"
                          >
                            Save &amp; Continue
                          </v-btn>
                          <v-btn
                            depressed
                            color="secondary"
                            @click="closeAddDialog(true)"
                          >
                            Cancel
                          </v-btn>
                        </v-card-actions>
                      </v-stepper-content>
                      <v-stepper-content step="3">
                        <v-card-text>
                          <v-form ref="providerServiceForm" v-model="validProviderServiceForm" lazy-validation>
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
                                  <v-checkbox
                                    v-model="newService.serviceIds"
                                    v-for="service in serviceList"
                                    :key="service.id"
                                    :label="service.name"
                                    :value="service.id"
                                  />
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-form>
                        </v-card-text>
                        <v-card-actions>
                          <v-btn
                            depressed
                            color="primary"
                            @click="addService"
                            :disabled="!isProviderServiceValid"
                            :loading="saveLoading"
                          >
                            Save &amp; Exit
                          </v-btn>
                          <v-btn
                            depressed
                            color="secondary"
                            @click="closeAddDialog(true)"
                          >
                            Cancel
                          </v-btn>
                        </v-card-actions>
                      </v-stepper-content>
                    </v-stepper-items>
                  </v-stepper>
                </template>              
              </v-dialog>
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="4" class="mx-10">
              <v-text-field
                v-model="search"
                prepend-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                clearable
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
                  Are you sure you want to delete <strong>{{ deletedProvider.firstName }}</strong>?
                </div>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-btn
                      depressed
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
                      color="secondary"
                      @click="$set(deletedProvider, props.item.id, false)"
                    >
                      Cancel
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-btn
            depressed
            color="error"
            @click.stop="setDelete(props.item)"
          >
            Delete
          </v-btn>
        </template>
      </v-data-table>
    </v-card>
    <v-snackbar outlined color="success" top v-model="snackbar.active">
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          depressed
          color="secondary"
          v-bind="attrs"
          @click="snackbar.active = false"
        >
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script>
import Vue from 'vue'
import OMSApi from "@/api/OMSApi";
import phone from 'phone'
import email from 'email-validator'
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete';

Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: 'AIzaSyDna1EPIoMPadg3lEqLIzfsam1o0kN3zvw',
  version: 'weekly'
});

export default Vue.extend({
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
        },
      ],
      snackbar: {
        message: null,
        active: false,
      },
      validProviderAddressForm: false,
      newAddress: {
        street: "",
        apartment: "",
        city: "",
        state: "",
        zipCode: "",
        primary: false,
        longitude: 0,
        latitude: 0
      },
      validProviderServiceForm: false,
      newService: {
        serviceIds: [],
        ciyId: null
      },
      serviceList: [],
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
        email: null
      },
      genderList: [
        "male",
        "female"
      ],
      activePicker: null,
      datePicker: false,
      formattedDate: null,
      requiredRules: [(v) => !!v || 'Required'],
      phoneRules: [
        (phoneNumber) => !!phoneNumber || 'Phone number is required',
        (phoneNumber) => (phoneNumber && phone(phoneNumber, { country: 'USA' }).isValid) || 'Phone number is invalid'
      ],
      emailRules: [
        (emailAddress) => !!emailAddress || 'Email is required',
        (emailAddress) => (emailAddress && email.validate(emailAddress)) || 'Email address is invalid'
      ],
      search: "",
      deletedProvider: {}
    }
  },
  async created () {
    this.loading = true;
    await this.getProviders();
    await this.getServices();
    await this.getCities();
    this.loading = false;
  },
  methods: {
    async getProviders () {
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
    async getServices () {
      try {
        const api = new OMSApi();
        const response = await api.getServices();
        if (response.result.data.length) {
          this.serviceList = response.result.data;
        }
      } catch (error) {
        console.error(error);
        this.snackbar.message = "Failed to get services list";
        this.snackbar.active = true;
      }
    },
    async getCities () {
      try {
        const api = new OMSApi();
        const response = await api.getCities();
        if (response.result.data.length) {
          this.cityList = response.result.data;
        }
      } catch (error) {
        console.error(error);
        this.snackbar.message = "Failed to get city list";
        this.snackbar.active = true;
      }
    },
    async closeAddDialog (isRefresh) {
      this.addDialog = false;
      this.stepNumber = 1;
      if(isRefresh) {
        this.loading = true;
        await this.getProviders();
        this.loading = false;
      }
    },
    async addProvider () {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        this.newProviderId = 0;
        const phone = '+1' + this.newProvider.phone;
        const response = await api.createProvider({...this.newProvider, phone});
        if (response && response.result) {
          this.newProviderId = response.result.id;
          this.saveLoading = false;
          this.stepNumber = 2;
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to add providers";
        this.snackbar.active = true;
      }
    },
    getNewAddressData (addressData, placeResultData) {
      this.newAddress.street = addressData.name;
      this.newAddress.city = placeResultData.formatted_address.split(',')[1];
      this.newAddress.state = addressData.administrative_area_level_1;
      this.newAddress.zipCode = addressData.postal_code;
      this.newAddress.longitude = addressData.longitude;
      this.newAddress.latitude = addressData.latitude;
    },
    async addAddress () {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        const address = {
          ...this.newAddress,
          guardianId: null,
          patientId: null,
          providerId: this.newProviderId
        };
        const response = await api.createAddress(address);
        if (response) {
          this.saveLoading = false;
          this.stepNumber = 3;
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to add address";
        this.snackbar.active = true;
      }
    },
    async addService () {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        await Promise.all(this.newService.serviceIds.map(async (serviceId) => {
          const service = {
            providerId: this.newProviderId,
            serviceId,
            cityId: this.newService.cityId
          };
          await api.createProviderService(service);
        }));
        this.saveLoading = false;
        this.closeAddDialog(true);
        this.snackbar.message = "Provider added successfully"
        this.snackbar.active = true;
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to add Service";
        this.snackbar.active = true;
      }
    },
    details (provider) {
      this.$router.push({
        name: "Provider Details",
        params: {
          provider,
          providerId: provider.id
        }
      });
    },
    setDelete (props) {
      this.deletedProvider.firstName = props.firstName;
      this.deletedProvider.id = props.id;
      this.$set(this.deletedProvider, props.id, true);
    },
    async deleteProvider () {
      try {
        this.saveLoading = true;
        const api = new OMSApi();
        const response = await api.deleteProvider(this.deletedProvider.id);
        if (response) {
          this.saveLoading = false;
          this.snackbar.message = response.message;
          this.snackbar.active = true;
          this.$set(this.deletedProvider, this.deletedProvider.id, false);
          this.loading = true;
          await this.getProviders();
          this.loading = false;
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to delete provider";
        this.snackbar.active = true;
      }
    },
    save (date) {
      this.$refs.datePicker.save(date)
    },
    formatDate (date) {
      if (!date) {
        return null;
      }
      const [year, month, day] = date.split('-');
      return `${month}/${day}/${year}`;
    },
    parseDate (date) {
      if (!date) {
        return null;
      }
      const [month, day, year] = date.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
  },
  computed: {
    isProviderValid () {
      if(this.$refs.providerForm) {
        this.$refs.providerForm.validate();
      }
      return this.newProvider.firstName &&
        this.newProvider.lastName &&
        this.newProvider.dob &&
        this.newProvider.gender &&
        this.newProvider.phone &&
        this.newProvider.email &&
        this.validProviderForm;
    },
    isProviderAddressValid () {
      if(this.$refs.providerAddressForm) {
        this.$refs.providerAddressForm.validate();
      }
      return this.newAddress.street &&
        this.newAddress.city &&
        this.newAddress.state &&
        this.newAddress.zipCode &&
        this.newAddress.longitude &&
        this.newAddress.latitude &&
        this.validProviderAddressForm;  
    },
    isProviderServiceValid () {
      if(this.$refs.providerServiceForm) {
        this.$refs.providerServiceForm.validate();
      }
      return this.newService.cityId &&
        this.newService.serviceIds.length &&
        this.validProviderServiceForm;  
    }
  },
  watch: {
    addDialog (newVal) {
      if (!newVal) {
        this.$refs.providerForm.reset();
        this.$refs.providerAddressForm.reset();
        this.newAddress.primary = false;
        this.newAddress.apartment = "";
        this.$refs.providerServiceForm.reset();
      }
    },
    datePicker (newValue) {
      newValue && setTimeout(() => (this.activePicker = 'YEAR'))
    },
    'newProvider.dob' (newValue) {
      this.formattedDate = this.formatDate(this.newProvider.dob);
    }
  }
})
</script>

<style scoped>
  .v-stepper__header {
    box-shadow: none;
  }
  .v-stepper__content {
    padding-top: 0px;
  }
</style>