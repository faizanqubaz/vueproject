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
          <v-tabs v-model="activeTab">
            <v-tab>Provider</v-tab>
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
                    v-model="validUpdateProfileForm"
                    lazy-validation
                  >
                    <v-card elevation="0" width="50%">
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="provider.firstName"
                            label="First Name"
                            :rules="requiredRules"
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
                            label="Last Name"
                            :rules="requiredRules"
                            required
                          />
                        </v-col>
                        <v-col cols="12">
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
                                  @blur="
                                    provider.dob = parseDate(formattedDate)
                                  "
                                  v-on="on"
                                  :rules="requiredRules"
                                  required
                                />
                              </template>
                              <v-date-picker
                                v-model="provider.dob"
                                no-title
                                :active-picker.sync="activePicker"
                                :max="
                                  new Date(
                                    Date.now() -
                                      new Date().getTimezoneOffset() * 60000
                                  )
                                    .toISOString()
                                    .substr(0, 10)
                                "
                                min="1920-01-01"
                                @change="save"
                              />
                            </v-menu>
                          </v-flex>
                        </v-col>
                        <v-col cols="12">
                          <v-autocomplete
                            v-model="provider.gender"
                            :items="genderList"
                            label="Gender"
                            :rules="requiredRules"
                            required
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="provider.phone"
                            label="Phone Number"
                            :rules="phoneRules"
                            required
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-text-field
                            v-model="provider.email"
                            label="Email Address"
                            :rules="emailRules"
                            required
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-btn
                            depressed
                            color="primary"
                            @click="updateProvider"
                            :disabled="!isUpdateProfileValid"
                            :loading="saveLoading"
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
                      <v-col sm="6" md="2" lg="6" xl="1">
                        <v-dialog v-model="addAddressDialog" max-width="600px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              width="120px"
                              color="primary"
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
                              <v-form
                                ref="addAddressForm"
                                v-model="validAddAddressForm"
                                lazy-validation
                              >
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
                                        color="primary"
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
                                @click="closeAddAddressDialog"
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                depressed
                                color="primary"
                                @click="addAddress"
                                :loading="saveLoading"
                                large
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
                    <v-dialog
                      v-model="updatedAddress[props.item.id]"
                      max-width="600px"
                    >
                      <v-card>
                        <v-card-title>
                          <span class="text-h5"
                            >Address #{{ props.item.id }}</span
                          >
                        </v-card-title>
                        <v-card-text>
                          <v-form
                            ref="updateAddressForm"
                            v-model="validUpdateAddressForm"
                            lazy-validation
                          >
                            <v-container>
                              <v-row>
                                <v-col cols="12" sm="12" md="12">
                                  <vuetify-google-autocomplete
                                    ref="providerUpdateAddress"
                                    id="providerUpdateMap"
                                    label="Address"
                                    classname="form-control"
                                    :value="updatedAddressFull"
                                    v-on:placechanged="getUpdateAddressData"
                                    country="us"
                                    :rules="requiredRules"
                                    required
                                  />
                                </v-col>
                                <v-col cols="12">
                                  <v-text-field
                                    v-model="updatedAddress.apartment"
                                    label="Apartment"
                                  />
                                </v-col>
                                <v-col cols="12" sm="12" md="12">
                                  <v-switch
                                    v-model="updatedAddress.primary"
                                    label="Primary"
                                    color="primary"
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
                            @click="closeUpdateAddressDialog(props.item.id)"
                          >
                            Cancel
                          </v-btn>
                          <v-btn
                            depressed
                            color="primary"
                            @click="updateAddress"
                            :disabled="!isUpdateAddressValid"
                            :loading="saveLoading"
                            large
                          >
                            Update
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-dialog>
                    <v-btn
                      depressed
                      color="primary"
                      @click.stop="setUpdateAddress(props.item)"
                      class="mr-2"
                    >
                      Update
                    </v-btn>
                    <v-dialog
                      v-model="deletedAddress[props.item.id]"
                      max-width="400px"
                    >
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
                                depressed
                                color="error"
                                block
                                :loading="saveLoading"
                                @click="deleteAddress()"
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
                                @click="
                                  $set(deletedAddress, props.item.id, false)
                                "
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
                      @click.stop="setDeleteAddress(props.item)"
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
                      <v-col sm="6" md="2" lg="6" xl="1">
                        <v-dialog v-model="addServiceDialog" max-width="600px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              width="120px"
                              color="primary"
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
                              <v-form
                                ref="addServiceForm"
                                v-model="validAddServiceForm"
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
                                @click="closeAddServiceDialog"
                              >
                                Cancel
                              </v-btn>
                              <v-btn
                                depressed
                                color="primary"
                                @click="addService"
                                :disabled="!isAddServiceValid"
                                :loading="saveLoading"
                                large
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
                    <v-dialog
                      v-model="deletedService[props.item.id]"
                      max-width="400px"
                    >
                      <v-card>
                        <v-card-text>
                          <div class="text-h5 text-center py-4">
                            Are you sure you want to delete
                            <strong>{{ deletedService.service }}</strong
                            >?
                          </div>
                          <v-row>
                            <v-col cols="12" sm="6">
                              <v-btn
                                depressed
                                block
                                color="error"
                                :loading="saveLoading"
                                @click="deleteService()"
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
                                @click="
                                  $set(deletedService, props.item.id, false)
                                "
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
                      @click.stop="setDeleteService(props.item)"
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
  </v-container>
</template>

<script>
import Vue from "vue";
import OMSApi from "@/api/OMSApi";
import phone from "phone";
import email from "email-validator";
import VuetifyGoogleAutocomplete from "vuetify-google-autocomplete";
import _ from "lodash";

Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: "AIzaSyDna1EPIoMPadg3lEqLIzfsam1o0kN3zvw",
  version: "weekly",
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
          align: "center",
          width: "240px",
          sortable: false,
        },
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
          align: "center",
          width: "240px",
          sortable: false,
        },
      ],
      activeTab: null,
      loading: true,
      saveLoading: false,
      providerId: parseInt(this.$route.params.providerId),
      activePicker: null,
      datePicker: false,
      formattedDate: null,
      validUpdateProfileForm: false,
      addAddressDialog: false,
      validAddAddressForm: false,
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
      validUpdateAddressForm: false,
      updatedAddress: {},
      updatedAddressId: null,
      updatedAddressFull: null,
      deletedAddress: {},
      addServiceDialog: false,
      serviceListByCity: {},
      currentServiceListByCity: {},
      validAddServiceForm: false,
      serviceList: [],
      cityList: [],
      newService: {
        serviceIds: [],
        ciyId: null,
      },
      validUpdateServiceForm: false,
      updatedServiceId: null,
      deletedService: {},
      genderList: ["male", "female"],
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
      provider: {},
    };
  },
  async created() {
    this.loading = true;
    await this.getProviderDetail();
    await this.getServices();
    await this.getCities();
    await this.getProviderServices();
    this.loading = false;
  },
  methods: {
    async getProviderDetail() {
      try {
        this.isLoading = true;
        const api = new OMSApi();
        const providerId = this.$route.params.providerId;
        const response = await api.getProviderById(providerId);
        if (response.result) {
          this.provider = response.result;
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to get provider detail",
          type: "error",
        });
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async updateProvider() {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        const response = await api.updateProvider(this.provider.id, {
          firstName: this.provider.firstName,
          middleName: this.provider.middleName,
          lastName: this.provider.lastName,
          dob: this.provider.dob,
          gender: this.provider.gender,
          phone: this.provider.phone,
          email: this.provider.email,
        });
        if (response) {
          this.$root.snackbar.show({
            message: response.message,
            type: "success",
          });
          this.saveLoading = false;
        }
      } catch (error) {
        this.saveLoading = false;
        this.$root.snackbar.show({
          message: "Failed to update provider",
          type: "error",
        });
      }
    },
    async getProviderServices() {
      try {
        const api = new OMSApi();
        const response = await api.getProviderServices(this.providerId);
        let services = [];
        if (response.result) {
          response.result.map((item) => {
            services.push({
              id: item.id,
              cityId: item.city.id,
              cityName: item.city.name,
              serviceId: item.service.id,
              serviceName: item.service.name,
            });
          });
          this.provider = {
            ...this.provider,
            services,
          };
          this.populateServiceListByCity();
        }
      } catch (error) {
        console.error(error);
        this.$root.snackbar.show({
          message: "Failed to get provider services list",
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
          providerId: this.providerId,
        };
        const response = await api.createAddress(address);
        if (response) {
          this.provider.addresses.push({
            ...this.newAddress,
            id: response.result.id,
          });
          this.$root.snackbar.show({
            message: response.message,
            type: "success",
          });
          this.saveLoading = false;
          this.closeAddAddressDialog();
        }
      } catch (error) {
        this.saveLoading = false;
        this.$root.snackbar.show({
          message: "Failed to add address",
          type: "error",
        });
      }
    },
    closeUpdateAddressDialog(id) {
      this.updatedAddress[id] = false;
    },
    setUpdateAddress(props) {
      this.updatedAddressId = props.id;
      this.updatedAddressFull = `${props.street}, ${props.city}, ${props.state} ${props.zipCode}, USA`;
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
      this.updatedAddress.city =
        placeResultData.formatted_address.split(",")[1];
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
          latitude: this.updatedAddress.latitude,
        };
        const response = await api.updateAddress(
          this.updatedAddressId,
          address
        );
        if (response) {
          this.provider.addresses = this.provider.addresses.map((adrs) => {
            return adrs.id == this.updatedAddressId
              ? { ...address, id: this.updatedAddressId }
              : adrs;
          });
          this.$root.snackbar.show({
            message: response.message,
            type: "success",
          });
          this.saveLoading = false;
          this.$set(this.updatedAddress, this.updatedAddressId, false);
        }
      } catch (error) {
        this.saveLoading = false;
        this.$root.snackbar.show({
          message: "Failed to update address",
          type: "error",
        });
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
          this.provider.addresses = this.provider.addresses.filter(
            (address) => address.id !== this.deletedAddress.id
          );
          this.$root.snackbar.show({
            message: response.message,
            type: "success",
          });
          this.$set(this.deletedAddress, this.deletedAddress.id, false);
        }
      } catch (error) {
        this.saveLoading = false;
        this.$root.snackbar.show({
          message: "Failed to delete address",
          type: "error",
        });
      }
    },
    closeAddServiceDialog() {
      this.addServiceDialog = false;
    },
    async getServices() {
      try {
        const api = new OMSApi();
        const response = await api.getServices();
        if (response.result.data) {
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
        if (response.result.data) {
          this.cityList = response.result.data;
        }
      } catch (error) {
        console.error(error);
        this.$root.snackbar.show({
          message: "Failed to get cities list",
          type: "error",
        });
      }
    },
    populateServiceListByCity() {
      this.cityList.forEach((city) => {
        this.serviceListByCity[city.id] = [];
      });
      if (this.provider.services) {
        this.provider.services.forEach((service) => {
          this.serviceListByCity[service.cityId].push(service.serviceId);
        });
      }
      this.currentServiceListByCity = _.cloneDeep(this.serviceListByCity);
    },
    async addService() {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        const cityIds = Object.keys(this.serviceListByCity);
        await Promise.all(
          cityIds.map(async (cityId) => {
            const services = _.difference(
              this.serviceListByCity[cityId],
              this.currentServiceListByCity[cityId]
            );
            if (cityId && services.length > 0) {
              const service = {
                providerId: this.providerId,
                services,
                cityId: parseInt(cityId),
              };
              console.log("citi id", cityId, " service :", services);
              await api.createProviderService(service);
            }
          })
        );

        await this.getProviderServices();
        this.$root.snackbar.show({
          message: "Service added successfully",
          type: "success",
        });
        this.saveLoading = false;
        this.closeAddServiceDialog();
      } catch (error) {
        this.saveLoading = false;
        this.$root.snackbar.show({
          message: "Failed to add service",
          type: "error",
        });
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
        const response = await api.deleteProviderService(
          this.deletedService.id
        );
        if (response) {
          console.log("deleted");
          this.saveLoading = false;
          await this.getProviderServices();
          this.$root.snackbar.show({
            message: response.message,
            type: "success",
          });
          this.$set(this.deletedService, this.deletedService.id, false);
        }
      } catch (error) {
        this.saveLoading = false;
        this.$root.snackbar.show({
          message: "Failed to delete service",
          type: "error",
        });
      }
    },
    save(date) {
      this.$refs.datePicker.save(date);
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
    isUpdateProfileValid() {
      if (this.$refs.updateProfileForm) {
        this.$refs.updateProfileForm.validate();
      }
      return (
        this.provider.firstName &&
        this.provider.lastName &&
        this.provider.dob &&
        this.provider.gender &&
        this.provider.phone &&
        this.provider.email &&
        this.validUpdateProfileForm
      );
    },
    isAddAddressValid() {
      if (this.$refs.addAddressForm) {
        this.$refs.addAddressForm.validate();
      }
      return (
        this.newAddress.street &&
        this.newAddress.city &&
        this.newAddress.state &&
        this.newAddress.zipCode &&
        this.newAddress.longitude &&
        this.newAddress.latitude &&
        this.validAddAddressForm
      );
    },
    isUpdateAddressValid() {
      if (this.$refs.updateAddressForm) {
        this.$refs.updateAddressForm.validate();
      }
      return (
        this.updatedAddress.street &&
        this.updatedAddress.city &&
        this.updatedAddress.state &&
        this.updatedAddress.zipCode &&
        this.updatedAddress.longitude &&
        this.updatedAddress.latitude &&
        this.validUpdateAddressForm
      );
    },
    isAddServiceValid() {
      if (this.$refs.addServiceForm) {
        this.$refs.addServiceForm.validate();
      }
      return this.newService.cityId && this.validAddServiceForm;
    },
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
    },
    datePicker(newValue) {
      newValue && setTimeout(() => (this.activePicker = "YEAR"));
    },
    "provider.dob"(newValue) {
      if (newValue) {
        this.formattedDate = this.formatDate(this.provider.dob);
      }
    },
  },
});
</script>
