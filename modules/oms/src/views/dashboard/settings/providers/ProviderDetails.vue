<template>
  <v-container fluid>
    <v-card>
      <template>
        <v-card>
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
                            <date-picker
                              v-if="provider.dob"
                              v-model="provider.dob"
                              label="Date of birth"
                            />
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
                                  <google-autocomplete
                                    :tempVal="updatedAddressFull"
                                    v-model="autocompleteAddress"
                                    label="Address"
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
    <confirmation
      :loading="saveLoading"
      @delete="setDelete"
      :preventText="deleteData.text"
      v-model="deleteData.active"
    >
      <template>
        <div class="text-h5 text-center py-4">
          Are you sure you want to delete
          <strong>{{ deleteData.text }}</strong
          >?
        </div>
      </template>
    </confirmation>
  </v-container>
</template>

<script>
import Vue from "vue";
import OMSApi from "@/api/OMSApi";
import phone from "phone";
import email from "email-validator";
import _ from "lodash";
import GoogleAutocomplete from "@/components/GoogleAutocomplete.vue";
import DatePicker from "@/components/DatePicker.vue";
import moment from "moment";
import Confirmation from "@/components/Confirmation.vue";

export default Vue.extend({
  components: {
    GoogleAutocomplete,
    DatePicker,
    Confirmation,
  },
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
      validUpdateProfileForm: false,
      addAddressDialog: false,
      validAddAddressForm: false,
      autocompleteAddress: {
        address: "",
        street: "",
        apartment: "",
        city: "",
        state: "",
        zipCode: "",
        primary: false,
        longitude: 0,
        latitude: 0,
      },
      newAddress: {
        address: "",
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
      provider: {
        firstName: null,
        middleName: null,
        lastName: null,
        dob: null,
        gender: null,
        phone: null,
        email: null,
        addresses: null,
      },
      deleteData: {
        actions: null,
        service: null,
        active: false,
        text: null,
      },
    };
  },
  async created() {
    this.$store.commit("SET_LOADING", true);
    this.loading = true;
    await this.getProviderDetail();
    await this.getServices();
    await this.getCities();
    await this.getProviderServices();
    this.loading = false;
    this.$store.commit("SET_LOADING", false);
  },
  methods: {
    async getProviderDetail() {
      try {
        this.isLoading = true;
        const api = new OMSApi();
        const providerId = this.$route.params.providerId;
        const response = await api.getProviderById(providerId);
        if (response.result) {
          this.provider = {
            ...response.result,
            dob: this.formatDate(response.result.dob),
          };
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
          dob: moment(this.provider.dob).format(),
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
    closeAddAddressDialog() {
      this.addAddressDialog = false;
    },
    async addAddress() {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        const address = {
          ...this.autocompleteAddress,
          apartment: this.newAddress.apartment ? this.newAddress.apartment : "",
          primary: this.newAddress.primary || false,
          guardianId: null,
          patientId: null,
          providerId: this.providerId,
        };
        const response = await api.createAddress(address);
        if (response) {
          this.provider.addresses.push({
            ...response.result,
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
      this.autocompleteAddress = {}
      this.newAddress = {}
      this.updatedAddress[id] = false;
    },
    setDelete() {
      if (this.deleteData.actions === "address") {
        this.deleteAddress();
      }
      if (this.deleteData.actions === "services") {
        this.deleteService();
      }
    },
    setUpdateAddress(props) {
      this.updatedAddressId = props.id;
      this.updatedAddressFull = `${props.street}, ${props.city}, ${props.state} ${props.zipCode}, USA`;
      this.autocompleteAddress.street = props.street;
      this.autocompleteAddress.city = props.city;
      this.autocompleteAddress.state = props.state;
      this.autocompleteAddress.zipCode = props.zipCode;
      this.autocompleteAddress.longitude = props.longitude;
      this.autocompleteAddress.latitude = props.latitude;
      this.updatedAddress.apartment = props.apartment;
      this.updatedAddress.primary = props.primary;
      this.$set(this.updatedAddress, props.id, true);
    },
    async updateAddress() {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        const address = {
          ...this.autocompleteAddress,
          apartment: this.updatedAddress.apartment,
          primary: this.updatedAddress.primary,
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
      this.deleteData.text = "#" + props.id;
      this.deleteData.actions = "address";
      this.deleteData.active = true;
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
          this.deleteData.active = false;
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
      console.log("Hereee", props);
      this.deletedService.id = props.id;
      this.deletedService.service = props.serviceName;
      this.deleteData.text = props.serviceName;
      this.deleteData.actions = "services";
      this.deleteData.active = true;
    },
    async deleteService() {
      try {
        this.saveLoading = true;
        const api = new OMSApi();
        const response = await api.deleteProviderService(
          this.deletedService.id
        );
        if (response) {
          this.saveLoading = false;
          await this.getProviderServices();
          this.$root.snackbar.show({
            message: response.message,
            type: "success",
          });
          this.deleteData.active = false;
        }
      } catch (error) {
        this.saveLoading = false;
        this.$root.snackbar.show({
          message: "Failed to delete service",
          type: "error",
        });
      }
    },
    formatDate(date) {
      return moment(date).format("MM/DD/YYYY");
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
      return this.autocompleteAddress.street && this.validUpdateAddressForm;
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
    }
  },
});
</script>
