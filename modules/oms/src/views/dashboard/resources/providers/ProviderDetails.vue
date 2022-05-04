<template>
  <v-container fluid>
    <v-card>
      <template>
        <v-card>
          <v-overlay absolute :opacity="0.5" :value="loading">
            <v-progress-circular indeterminate size="64">
              Loading
            </v-progress-circular>
          </v-overlay>
          <v-tabs 
            v-model="activeTab"
          > 
            <v-tab>Details</v-tab>
            <v-tab>Addresses</v-tab>
            <v-tab>Services</v-tab>
            <v-tabs-items v-model="activeTab">
              <!-- Tab item 1: Profile -->
              <v-tab-item>
                <v-card-title>
                  <span class="text-h5">Update Provider</span>
                </v-card-title>
                <v-card-text>
                  <v-form
                    ref="updateProfileForm"
                    v-model="validUpdatedProfile"
                    lazy-validation
                  >
                   <v-card elevation="0" width="50%">
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="provider.firstName"
                          placeholder="First Name"
                          label="First Name"
                          required
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="provider.middleName"
                          placeholder="Middle Name"
                          label="Middle Name"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="provider.lastName"
                          placeholder="Last Name"
                          label="Last Name"
                          required
                        />
                      </v-col>
                      <v-col cols="12">

                        <!-- <v-menu
                          v-model="addDatePicker"
                          :close-on-content-click="false"
                          max-width="290"
                        >
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              :value="provider.dob"
                              clearable
                              label="Date of Birth"
                              readonly
                              v-bind="attrs"
                              v-on="on"
                              @click:clear="date = null"
                            />
                          </template>
                          <v-date-picker
                            v-model="provider.dob"
                            @input="addDatePicker = false"
                          />
                        </v-menu> -->

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
                                    :value="provider.dob"
                                    label="Date"
                                    hint="MM/DD/YYYY format"
                                    persistent-hint
                                    @blur="date = parseDate(dateFormatted)"
                                    v-on="on"
                                  ></v-text-field>
                                </template>
                                <v-date-picker v-model="provider.dob" no-title @input="addDatePicker = false"></v-date-picker>
                              </v-menu>
                            </v-flex>


                      </v-col>
                      <v-col cols="12">
                        <v-autocomplete
                          v-model="provider.gender"
                          :items="genderList"
                          label="Gender"
                          required
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="provider.phone"
                          placeholder="Phone Number"
                          label="Phone Number"
                          hint="xxx-xxx-xxxx"
                          persistent-hint
                          required
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="provider.email"
                          placeholder="Email Address"
                          label="Email Address"
                          required
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-btn
                          depressed
                          color="primary"
                          @click="updateProvider"
                          :disabled="!validUpdatedProfile"
                          :loading="saveLoading"
                          block
                        >
                          Update
                        </v-btn>
                      </v-col>
                    </v-row>
                    </v-card>
                  </v-form>
                </v-card-text>
              </v-tab-item>
              <!-- Tab item 2: Addresses -->
              <v-tab-item>
                <v-data-table
                  :headers="addressHeaders"
                  :footer-props="{
                    'items-per-page-options': [10, 25, 50, 100],
                  }"
                  :items="provider.addresses"
                  :loading="loading"
                  loading-text="Loading Addresses..."
                  item-key="_id"
                  class="elevation-1 pa-3"
                  mobile-breakpoint="0"
                >
                  <template v-slot:top>
                    <v-row align="center">
                      <v-col sm="6" md="2" lg="2" xl="1">
                        <v-dialog v-model="addAddressDialog" max-width="600px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              block
                              color="primary"
                              dark
                              v-bind="attrs"
                              v-on="on"
                            >
                              Add
                            </v-btn>
                          </template>
                          <v-card>
                            <v-card-title>
                              <span class="text-h5">Add Address</span>
                            </v-card-title>
                            
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
                            <v-card-actions>
                              <v-spacer />
                              <v-btn
                                color="blue darken-1"
                                text
                                @click="closeAddAddressDialog"
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                color="blue darken-1"
                                text
                                @click="addAddress"
                                :disabled="!validAddedAddress"
                                :loading="saveLoading"
                              >
                                Save
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:[`item.actions`]="props">
                    <v-dialog v-model="updatedAddress[props.item.id]" max-width="600px">
                      <v-card>
                        <v-card-title>
                          <span class="text-h5">Address #{{ props.item.id }}</span>
                        </v-card-title>
                        <v-card-text>
                          <v-form
                            ref="updateAddressForm"
                            v-model="validUpdatedAddress"
                            lazy-validation
                          >
                            <v-row>
                              <v-col cols="12" sm="12" md="12">
                                <vuetify-google-autocomplete
                                  ref="providerUpdateAddress"
                                  id="providerUpdateMap"
                                  label="Address"
                                  classname="form-control"
                                  :value= "updateAddressFull"
                                  v-on:placechanged="getUpdateAddressData"
                                  country="us"
                                  required
                                />
                              </v-col>
                              <v-col cols="12">
                                <v-text-field
                                  label="Apartment"
                                  v-model="updatedAddress.apartment"
                                />
                              </v-col>
                              <v-col cols="12" sm="12" md="12">
                                  <v-switch
                                    label="Primary"
                                    v-model="updatedAddress.primary"
                                    color="success"
                                  />
                                </v-col>
                              <v-col cols="12">
                                <v-btn
                                  depressed
                                  color="primary"
                                  @click="updateAddress"
                                  :disabled="!validUpdatedAddress"
                                  :loading="saveLoading"
                                  block
                                >
                                  Update
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-form>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                    <v-btn
                      depressed
                      @click.stop="setUpdateAddress(props.item)"
                      class="mr-2"
                      color="secondary"
                    >
                      Update
                    </v-btn>
                    <v-dialog v-model="deletedAddress[props.item.id]" max-width="400px">
                      <v-card>
                        <v-card-text>
                          <div class="text-h5 text-center py-4">
                            Are you sure you want to delete Address #
                            <strong>{{ props.item.id }}</strong
                            >?
                          </div>
                          <v-row>
                            <v-col cols="12" sm="6">
                              <v-btn
                                :loading="saveLoading"
                                depressed
                                block
                                color="error"
                                @click="deleteAddress()"
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
                                @click="$set(deletedAddress, props.item.id, false)"
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
                      @click.stop="setDeleteAddress(props.item)"
                      color="error"
                    >
                      Delete
                    </v-btn>
                  </template>
                </v-data-table>
              </v-tab-item>
              <!-- Tab item 3: Services  -->
              <v-tab-item>
                <v-data-table
                  :headers="serviceHeaders"
                  :footer-props="{
                    'items-per-page-options': [10, 25, 50, 100],
                  }"
                  :items="provider.services"
                  :loading="loading"
                  loading-text="Loading Services..."
                  item-key="_id"
                  class="elevation-1 pa-3"
                  mobile-breakpoint="0"
                >
                  <template v-slot:top>
                    <v-row align="center">
                      <v-col sm="6" md="2" lg="2" xl="1">
                        <v-dialog v-model="addServiceDialog" max-width="600px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              block
                              color="primary"
                              dark
                              v-bind="attrs"
                              v-on="on"
                            >
                              Add
                            </v-btn>
                          </template>
                          <v-card>
                            <v-card-title>
                              <span class="text-h5">Add Service</span>
                            </v-card-title>
                            
                            <v-card-text>
                              <v-form ref="addServiceForm" v-model="validAddedService" lazy-validation>
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
                              <v-spacer />
                              <v-btn
                                color="blue darken-1"
                                text
                                @click="closeAddServiceDialog"
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                color="blue darken-1"
                                text
                                @click="addService"
                                :disabled="!validAddedService"
                                :loading="saveLoading"
                              >
                                Save
                              </v-btn>
                            </v-card-actions>
                          </v-card>
                        </v-dialog>
                      </v-col>
                    </v-row>
                  </template>
                  <template v-slot:[`item.actions`]="props">
                    <v-dialog v-model="updatedService[props.item.id]" max-width="600px">
                      <v-card>
                        <v-card-title>
                          <span class="text-h5">Service #{{ props.item.id }}</span>
                        </v-card-title>
                        <v-card-text>
                          <v-form
                            ref="updateServiceForm"
                            v-model="validUpdatedService"
                            lazy-validation
                          >
                            <v-row>
                              <v-col cols="12" sm="12" md="12">
                                <v-autocomplete
                                  v-model="updatedService.serviceId"
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
                                  v-model="updatedService.cityId"
                                  :items="cityList"
                                  label="City"
                                  item-text="name"
                                  item-value="id"
                                  clearable
                                  dense
                                />
                              </v-col>
                              <v-col cols="12">
                                <v-btn
                                  depressed
                                  color="primary"
                                  @click="updateService"
                                  :disabled="!validUpdatedService"
                                  :loading="saveLoading"
                                  block
                                >
                                  Update
                                </v-btn>
                              </v-col>
                            </v-row>
                          </v-form>
                        </v-card-text>
                      </v-card>
                    </v-dialog>
                    <v-btn
                      depressed
                      @click.stop="setUpdateService(props.item)"
                      class="mr-2"
                      color="secondary"
                    >
                      Update
                    </v-btn>
                    <v-dialog v-model="deletedService[props.item.id]" max-width="400px">
                      <v-card>
                        <v-card-text>
                          <div class="text-h5 text-center py-4">
                            Are you sure you want to delete 
                            <strong>{{ deletedService.service }}</strong>?
                          </div>
                          <v-row>
                            <v-col cols="12" sm="6">
                              <v-btn
                                :loading="saveLoading"
                                depressed
                                block
                                color="error"
                                @click="deleteService()"
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
                                @click="$set(deletedService, props.item.id, false)"
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
                      @click.stop="setDeleteService(props.item)"
                      color="error"
                    >
                      Delete
                    </v-btn>
                  </template>
                </v-data-table>
              </v-tab-item>
            </v-tabs-items>
          </v-tabs>
        </v-card>
      </template>
    </v-card>
    <v-snackbar
      outlined color="success"
      top
      v-model="snackbar.active"
    >
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
import phone from 'phone';
import email from 'email-validator';
import VuetifyGoogleAutocomplete from 'vuetify-google-autocomplete';

Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: 'AIzaSyDna1EPIoMPadg3lEqLIzfsam1o0kN3zvw',
  version: 'weekly'
});

export default Vue.extend({
  data() {
    return {
      addressHeaders: [
        {
          text: "Id",
          value: "id",
        },
        {
          text: "Street",
          value: "street",
        },
        {
          text: "Apartment",
          value: "apartment",
        },
        {
          text: "City",
          value: "city",
        },
        {
          text: "State",
          value: "state",
        },
        {
          text: "Zip Code",
          value: "zipCode",
        },
        {
          text: "Actions",
          value: "actions",
        }
      ],
      serviceHeaders: [
        {
          text: "Id",
          value: "id",
        },
        {
          text: "Services",
          value: "serviceName",
        },
        {
          text: "City",
          value: "cityName",
        },
        {
          text: "Actions",
          value: "actions",
        }
      ],
      snackbar: {
        message: null,
        active: false,
      },
      activeTab: null,
      loading: true,
      saveLoading: false,
      providerId: this.$route.params.providerId,
      addDatePicker: false,
      validUpdatedProfile: false,
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
      validUpdatedAddress: false,
      updatedAddress: {},
      updateAddressId: null,
      updateAddressFull: null,
      deletedAddress: {},
      addServiceDialog: false,
      validAddedService: false,
      serviceList: [],
      cityList: [],
      newService: {
        serviceIds: [],
        ciyId: null
      },
      validUpdatedService: false,
      updatedService: {},
      updateServiceId: null,
      deletedService: {},
      genderList: ["male", "female"],
      phoneRules: [
        (phoneNumber) => !!phoneNumber || 'Phone number is required',
        (phoneNumber) =>
          (phoneNumber && phone(phoneNumber, { country: 'USA' }).isValid) || 'Phone number is invalid'
      ],
      emailRules: [
        (emailAddress) => !!emailAddress || 'Email is required',
        (emailAddress) => (emailAddress && email.validate(emailAddress)) || 'Email address is invalid'
      ],
      provider: {}
    }
  },
  async created() {
    this.loading = true;
    this.provider = this.$route.params.provider;
    await this.getProviderServices();
    await this.getServices();
    await this.getCities();
    this.loading = false;
  },
  methods: {
    async updateProvider() {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        const response = await api.updateProvider(
          this.provider.id,
          {
            firstName: this.provider.firstName,
            middleName: this.provider.middleName,
            lastName: this.provider.lastName,
            dob: this.provider.dob,
            gender: this.provider.gender,
            phone: this.provider.phone,
            email: this.provider.email
          });
        if (response) {
          this.snackbar.message = response.message;
          this.saveLoading = false;
          this.snackbar.active = true;
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to update providers";
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
    getNewAddressData(addressData, placeResultData) {
      this.newAddress.street = addressData.name;
      this.newAddress.city = placeResultData.formatted_address.split(',')[1];
      this.newAddress.state = addressData.administrative_area_level_1;
      this.newAddress.zipCode = addressData.postal_code;
      this.newAddress.longitude = addressData.longitude;
      this.newAddress.latitude = addressData.latitude;
    },
    closeAddAddressDialog() {
      this.addAddressDialog = false;
    },
    async addAddress() {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        const address = {
          ...this.newAddress,
          guardianId: null,
          patientId: null,
          providerId: this.providerId
        };
        const response = await api.createAddress(address);
        if (response) {
          this.provider.addresses.push({
            ...this.newAddress,
            id: response.result.id
          });
          this.snackbar.message = response.message;
          this.saveLoading = false;
          this.closeAddAddressDialog();
          this.snackbar.active = true;
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to add address";
        this.snackbar.active = true;
      }
    },
    setUpdateAddress(props) {
      this.updateAddressId = props.id;
      this.updateAddressFull = `${ props.street }, ${ props.city }, ${ props.state } ${ props.zipCode }, USA`;
      this.updatedAddress.street = props.street;
      this.updatedAddress.apartment = props.apartment;
      this.updatedAddress.city = props.city;
      this.updatedAddress.state = props.state;
      this.updatedAddress.zipCode = props.zipCode;
      this.updatedAddress.longitude = props.longitude;
      this.updatedAddress.latitude = props.latitude;
      this.updatedAddress.primary = props.primary;
      this.$set(this.updatedAddress, props.id, true);
    },
    getUpdateAddressData(addressData, placeResultData) {
      this.updatedAddress.street = addressData.name;
      this.updatedAddress.city = placeResultData.formatted_address.split(',')[1];
      this.updatedAddress.state = addressData.administrative_area_level_1;
      this.updatedAddress.zipCode = addressData.postal_code;
      this.updatedAddress.longitude = addressData.longitude;
      this.updatedAddress.latitude = addressData.latitude;
    },
    async updateAddress() {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        const address = {
          street: this.updatedAddress.street,
          apartment: this.updatedAddress.apartment,
          city: this.updatedAddress.city,
          state: this.updatedAddress.state,
          zipCode: this.updatedAddress.zipCode,
          primary: this.updatedAddress.primary,
          longitude: this.updatedAddress.longitude,
          latitude: this.updatedAddress.latitude
        };
        const response = await api.updateAddress(this.updateAddressId, address);
        if (response) {
          this.provider.addresses = this.provider.addresses.map(adrs => {
            return adrs.id == this.updateAddressId ? { ...address, id: this.updateAddressId } : adrs; 
          });
          this.snackbar.message = response.message;
          this.saveLoading = false;
          this.$set(this.updatedAddress, this.updateAddressId, false);
          this.snackbar.active = true;
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to update Address";
        this.snackbar.active = true;
      }
    },
    setDeleteAddress(props) {
      this.deletedAddress.id = props.id;
      this.$set(this.deletedAddress, props.id, true);
    },
    async deleteAddress() {
      try {
        this.saveLoading = true;
        const api = new OMSApi();
        const response = await api.deleteAddress(this.deletedAddress.id);
        if (response) {
           this.saveLoading = false;
           this.provider.addresses = this.provider.addresses.filter(address => address.id !== this.deletedAddress.id);
           this.snackbar.message = response.message;
           this.snackbar.active = true;
           this.$set(this.deletedAddress, this.deletedAddress.id, false);
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to delete Address";
        this.snackbar.active = true;
      }
    },
    closeAddServiceDialog() {
      this.addServiceDialog = false;
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
    async addService() {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        await Promise.all(this.newService.serviceIds.map(async (serviceId) => {
          const service = {
            providerId: this.providerId,
            serviceId,
            cityId: this.newService.cityId
          };
          await api.createProviderService(service);
        }));
        await this.getProviderServices();
        this.snackbar.message = "Service added successfully";
        this.saveLoading = false;
        this.closeAddServiceDialog();
        this.snackbar.active = true;
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to add Service";
        this.snackbar.active = true;
      }
    },
    setUpdateService(props) {
      this.updateServiceId = props.id;
      this.updatedService.serviceId = props.serviceId;
      this.updatedService.cityId = props.cityId;
      this.$set(this.updatedService, props.id, true);
    },
    async updateService() {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        const service = {
          providerId: this.providerId,
          serviceId: this.updatedService.serviceId,
          cityId: this.updatedService.cityId
        };
        const response = await api.updateProviderService(this.updateServiceId, service);
        if (response) {
          await this.getProviderServices();
          this.snackbar.message = response.message;
          this.saveLoading = false;
          this.$set(this.updatedService, this.updateServiceId, false);
          this.snackbar.active = true;
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to update Service";
        this.snackbar.active = true;
      }
    },
    setDeleteService(props) {
      this.deletedService.id = props.id;
      this.deletedService.service = props.service;
      this.$set(this.deletedService, props.id, true);
    },
    async deleteService() {
      try {
        this.saveLoading = true;
        const api = new OMSApi();
        const response = await api.deleteProviderService(this.deletedService.id);
        if (response) {
           this.saveLoading = false;
           this.provider.services = this.provider.services.filter(service => service.id !== this.deletedService.id);
           this.snackbar.message = response.message;
           this.snackbar.active = true;
           this.$set(this.deletedService, this.deletedService.id, false);
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to delete Service";
        this.snackbar.active = true;
      }
    }
  },
  watch: {
    addAddressDialog(newVal) {
      if (!newVal) {
        this.$refs.addAddressForm.reset();
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
