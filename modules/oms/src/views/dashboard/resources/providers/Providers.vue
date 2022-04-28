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
              <v-dialog v-model="addDialog" max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    block
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
                    Add Provider
                  </v-btn>
                </template>

                <template>
                  <v-stepper v-model="e1" class="pt-5">
                    <!-- stepper header -->
                    <v-stepper-header>
                      <v-stepper-step
                        :complete="e1 > 1"
                        step="1"
                      >
                        Provider Details
                      </v-stepper-step>

                      <v-divider></v-divider>

                      <v-stepper-step
                        :complete="e1 > 2"
                        step="2"
                      >
                        Address
                      </v-stepper-step>
                      <v-divider></v-divider>
                      <v-stepper-step step="3">
                        Services
                      </v-stepper-step>
                    </v-stepper-header>
                <!-- stepper contents -->
                <v-stepper-items>
                <!-- ONE -->
                <v-stepper-content step="1">
                  <v-card-text>
                    <v-form ref="addForm" v-model="valid" lazy-validation>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="newProvider.firstName"
                              label="First Name"
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
                              required
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-flex>
                              <v-menu
                                ref="menu1"
                                v-model="addDatePicker"
                                :close-on-content-click="false"
                                :nudge-right="40"
                                lazy
                                transition="scale-transition"
                                offset-y
                                full-width
                                max-width="290px"
                                min-width="290px"
                              >
                              <template v-slot:activator="{ on }">
                                <v-text-field
                                  :value="newProvider.dob"
                                  label="Date of Birth"
                                  hint="MM/DD/YYYY"
                                  persistent-hint
                                  @blur="date = parseDate(dateFormatted)"
                                  v-on="on"
                                ></v-text-field>
                              </template>
                              <v-date-picker v-model="newProvider.dob" no-title @input="addDatePicker = false"></v-date-picker>
                              </v-menu>
                            </v-flex>
                                  </v-col>
                                  <v-col cols="12" sm="12" md="12">
                                    <v-autocomplete
                                      v-model="newProvider.gender"
                                      :items="genderList"
                                      label="Gender"
                                      required
                                    ></v-autocomplete>
                                  </v-col>
                                  <v-col cols="12" sm="12" md="12">
                                    <v-text-field
                                      v-model="newProvider.phone"
                                      label="Phone Number"
                                      :rules="phoneRules"
                                      hint="xxx-xxx-xxxx"
                                      persistent-hint
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
                        <!-- Action to store provider  -->
                        <v-card-actions>
                        <v-btn
                          color="primary"
                          @click="addProvider"
                          :disabled="!valid"
                          :loading="saveLoading"
                        >
                          Continue
                        </v-btn>
                        <v-btn text @click="closeAddDialog">
                          Cancel
                        </v-btn>
                        </v-card-actions>
                      </v-stepper-content>
                      <!-- TWO -->
                      <v-stepper-content step="2">
                            <v-card-text>
                              <v-form ref="addAddressForm" v-model="validAddedAddress" lazy-validation>
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
                        <!-- action for adding address -->
                        <v-card-actions>
                          <v-btn
                            color="primary"
                            @click="addAddress"
                            :disabled="!validAddedAddress"
                            :loading="saveLoading"
                          >
                            Continue
                          </v-btn>
                          <v-btn text @click="closeAddDialog">
                          Cancel
                        </v-btn>
                        </v-card-actions>
                      </v-stepper-content>
                      <!-- THREE -->
                      <v-stepper-content step="3">
                        <v-card-text>
                              <v-form ref="addServiceForm" v-model="validAddedService" lazy-validation>
                                <v-container>
                                  <v-row>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-autocomplete
                                        v-model="newService.serviceId"
                                        :items="serviceList"
                                        label="Service"
                                        item-text="name"
                                        item-value="id"
                                        clearable
                                        dense
                                      />
                                    </v-col>
                                    <v-col cols="12" sm="12" md="12">
                                      <v-autocomplete
                                        v-model="newService.cityId"
                                        :items="cityList"
                                        label="City"
                                        item-text="name"
                                        item-value="id"
                                        clearable
                                        dense
                                      />
                                    </v-col>
                                  </v-row>
                                </v-container>
                              </v-form>
                            </v-card-text>
                      <!-- Action to add service -->
                        <v-card-actions>
                          <v-btn
                            color="primary"
                            @click="addService"
                          >
                            Submit
                          </v-btn>
                          <v-btn text @click="closeAddDialog">
                          Cancel
                        </v-btn>
                        </v-card-actions>
                      </v-stepper-content>
                    </v-stepper-items>
                  </v-stepper>
                </template>              
              </v-dialog>
              <!-- search button -->
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="4" class="">
              <v-text-field
                v-model="search"
                prepend-icon="mdi-magnify"
                label="Search"
                single-line
                hide-details
                clearable
              ></v-text-field>
            </v-col> 
          </v-row>
        </template>
        <template v-slot:[`item.actions`]="props">
          <v-btn
            depressed
             @click="details(props.item)"
            class="mr-2"
            color="secondary"
          >
            Details
          </v-btn>
          <v-dialog v-model="deletedProvider[props.item.id]" max-width="400px">
            <v-card>
              <v-card-text>
                <div class="text-h5 text-center py-4">
                  Are you sure you want to delete 
                  <strong>{{ deletedProvider.firstName }}</strong>?
                </div>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-btn
                      :loading="saveLoading"
                      depressed
                      block
                      color="error"
                      @click="deleteProvider()"
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
          <v-btn
            depressed
            @click.stop="setDelete(props.item)"
            color="error"
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
          color="red"
          text
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
      e1: 1,
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
          text: "Gender",
          value: "gender",
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
      addAddressDialog: false,
      validAddedAddress: false,
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
      addServiceDialog: false,
      validAddedService: false,
      newService: {
        serviceId: null,
        ciyId: null
      },
      serviceList: [],
      cityList: [],
      providerList: [],
      loading: true,
      saveLoading: false,
      addDialog: false,
      valid: false,
      newProvider: {
        firstName: null,
        middleName: null,
        lastName: null,
        dob: null,
        gender: null,
        phone: null,
        email: null,
      },
      genderList: [
        "male",
        "female"
      ],
      addDatePicker: false,
      phoneRules: [
        (phoneNumber) => !!phoneNumber || 'Phone number is required',
        (phoneNumber) =>
          (phoneNumber && phone(phoneNumber, { country: 'USA' }).isValid) || 'Phone number is invalid'
      ],
      emailRules: [
        (emailAddress) => !!emailAddress || 'Email is required',
        (emailAddress) => (emailAddress && email.validate(emailAddress)) || 'Email address is invalid'
      ],
      search: "",
      deletedProvider: {}
    }
  },
  async created() {
    await this.getProviders();
    await this.getServices();
    await this.getCities();
    this.loading = false;
  },
  methods: {

    async getProviders() {
      this.loading = true;
      try {
        const api = new OMSApi();
        const response = await api.getProviders();
        if (response.result.data.length > 0) {
          this.providerList = response.result.data;
          this.loading = false;
        }
      } catch (error) {
        this.loading = false;
      }
    },
    closeAddDialog() {
      this.addDialog = false;
    },
    async addProvider() {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        this.newProviderId = 0;
        const phone = '+1' + this.newProvider.phone;
        const response = await api.createProvider({...this.newProvider, phone});
        if (response) {
          this.newProviderId = response.result.id;
          this.saveLoading = false;
          this.e1 = 2;
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to add providers";
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
          await this.getProviders();
          this.snackbar.message = response.message;
          this.snackbar.active = true;
          this.$set(this.deletedProvider, this.deletedProvider.id, false);
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to delete provider";
        this.snackbar.active = true;
      }
    },

   getNewAddressData(addressData, placeResultData) {
      this.newAddress.street = addressData.name;
      this.newAddress.city = placeResultData.formatted_address.split(',')[1];
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
          ...this.newAddress,
          guardianId: null,
          patientId: null,
          providerId: this.newProviderId
        };
        const response = await api.createAddress(address);
        if (response) {
          this.saveLoading = false;
          this.e1 = 3;
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to add address";
        this.snackbar.active = true;
      }
    },

    async getCities() {
      try {
        const api = new OMSApi();
        const response = await api.getCities();
        if (response.result.data.length > 0) {
          this.cityList = response.result.data;
        }
      } catch (error) {
        console.error(error);
        this.snackbar.message = "Failed to get city list";
        this.snackbar.active = true;
      }
    },
    async getProviderServices() {
      try {
        const api = new OMSApi();
        const response = await api.getProviderServices(this.providerId);
        let services = [];
        if (response.result.length > 0) {
          response.result.map((item) => {
            services.push({
              id: item.id,
              cityId: item.city.id,
              cityName: item.city.name,
              serviceId: item.service.id,
              serviceName: item.service.name
            })
          })
          this.provider.services = services;
        }
      } catch (error) {
        console.error(error);
        this.snackbar.message = "Failed to get provider services list";
        this.snackbar.active = true;
      }
    },
    async getServices() {
      try {
        const api = new OMSApi();
        const response = await api.getServices();
        if (response.result.data.length > 0) {
          this.serviceList = response.result.data;
        }
      } catch (error) {
        console.error(error);
        this.snackbar.message = "Failed to get services list";
        this.snackbar.active = true;
      }
    },
    async addService() {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        const service = {
          providerId: this.newProviderId,
          serviceId: this.newService.serviceId,
          cityId: this.newService.cityId
        };
        const response = await api.createProviderService(service);
        if (response) {
          this.saveLoading = false;
          this.closeAddDialog();
          this.snackbar.message = "Provider added successfully"
          this.snackbar.active = true;
          await this.getProviders();
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to add Service";
        this.snackbar.active = true;
      }
    },

  },
  computed: {
      currentTitle () {
        switch (this.step) {
          case 1: return 'Add Provider Details'
          case 2: return 'Add Address'
          default: return 'Add Services'
        }
      },
    },
  watch: {
    addDialog(newVal) {
      if (!newVal) {
        this.$refs.addForm.reset();
      }
    },
     addServiceDialog(newVal) {
      if (!newVal) {
        this.$refs.addServiceForm.reset();
      }
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
