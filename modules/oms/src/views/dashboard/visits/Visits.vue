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
            <v-col sm="6" md="2" lg="2" xl="1">
              <v-btn block color="primary" @click="visitDialog = true" dark>
                Add Visit
              </v-btn>
            </v-col>

            <v-col sm="6" md="3">
              <v-menu
                v-model="menuFilter"
                :close-on-content-click="false"
                :nudge-width="200"
                offset-x
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn v-bind="attrs" v-on="on">
                    <v-icon>mdi-filter-variant</v-icon>
                    Filters
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title> Filter Options </v-card-title>
                  <v-card-text>
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
                      v-model="listParams.patient"
                      :items="patientList"
                      label="Patient"
                      item-text="email"
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
                  </v-card-text>
                </v-card>
              </v-menu>
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
            class="text-center chipMiddle"
            :color="colorStatus(props.item.status)"
            >{{ props.item.status }}</v-chip
          >
        </template>

        <template v-slot:[`item.service`]="props">
          <span style="white-space: nowrap">
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
          <v-dialog v-model="addressDialog[props.item.id]" max-width="400px">
            <v-card>
              <v-card-title>
                <span class="text-h5">Address Detail</span>
              </v-card-title>
              <v-card-text>
                <div>
                  <v-list>
                    <template v-for="(val, key, index) in addressDialog">
                      <span v-if="index === 0" :key="index" />
                      <v-list-item v-else :key="key">
                        <v-list-item-content>
                          <v-list-item-title
                            v-html="key"
                            class="text-capitalize"
                          />
                          <v-list-item-subtitle v-html="val" />
                        </v-list-item-content>
                      </v-list-item>
                    </template>
                  </v-list>
                </div>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-btn
            color="primary"
            text
            depressed
            @click.stop="setAddressDialog(props.item.address)"
          >
            {{ props.item.address.city
            }}{{ props.item.address.city ? ", " : " " }}
            {{ props.item.address.state }}
          </v-btn>
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
        <v-card-title>
          <span class="text-h5">Add Visit</span>
        </v-card-title>

        <v-card-text>
          <v-form ref="addForm" v-model="isAddFormValid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-menu
                    v-model="addPickerDate"
                    :close-on-content-click="false"
                    max-width="290"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="addFormValues.date"
                        clearable
                        label="Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        @click:clear="date = null"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="addFormValues.date"
                      @input="addPickerDate = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-menu
                    ref="pickerTime1"
                    v-model="addPickerScheduledStartTime"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="addFormValues.scheduledStartTime"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="addFormValues.scheduledStartTime"
                        label="Scheduled Start Time"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      />
                    </template>
                    <v-time-picker
                      v-if="addPickerScheduledStartTime"
                      v-model="addFormValues.scheduledStartTime"
                      full-width
                      format="ampm"
                      @click:minute="
                        $refs.pickerTime1.save(addFormValues.scheduledStartTime)
                      "
                    />
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-menu
                    ref="pickerTime2"
                    v-model="addPickerScheduledEndTime"
                    :close-on-content-click="false"
                    :nudge-right="40"
                    :return-value.sync="addFormValues.scheduledEndTime"
                    transition="scale-transition"
                    offset-y
                    max-width="290px"
                    min-width="290px"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="addFormValues.scheduledEndTime"
                        label="Scheduled End Time"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                      />
                    </template>
                    <v-time-picker
                      v-if="addPickerScheduledEndTime"
                      v-model="addFormValues.scheduledEndTime"
                      full-width
                      format="ampm"
                      @click:minute="
                        $refs.pickerTime2.save(addFormValues.scheduledEndTime)
                      "
                    />
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    v-model="addFormValues.serviceId"
                    :items="serviceList"
                    label="Service"
                    item-text="name"
                    item-value="id"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    v-model="addFormValues.patientId"
                    :items="patientList"
                    label="Patient"
                    :item-text="getPatientItemText"
                    item-value="id"
                  >
                  </v-autocomplete>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    v-model="addFormValues.addressId"
                    :items="addressList"
                    label="Address"
                    item-text="street"
                    item-value="id"
                  >
                  </v-autocomplete>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="closeAddDialog">
            Cancel
          </v-btn>
          <v-btn
            color="blue darken-1"
            text
            :disabled="!isAddFormValid"
            @click="submitVisitAdd"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Vue from "vue";
import OMSApi from "@/api/OMSApi";
import moment from "moment";

export default Vue.extend({
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
        // { text: "Start Time", value: "startTime", sortable: false },
        // { text: "Check In Time", value: "checkInTime", sortable: false },
        // { text: "Check Out Time", value: "checkOutTime", sortable: false },
        { text: "Service", value: "service" },
        { text: "Patient", value: "patient" },
        { text: "Status", value: "status" },
        { text: "Provider", value: "provider" },
        { text: "Address", value: "address", sortable: false },
        // { text: "Actions", value: "actions", align: "center", width: "240px" },
      ],
      menuFilter: false,
      options: {},
      listParams: {
        date: null,
        service: null,
        provider: null,
        patient: null,
      },
      visitList: [],
      visitListParams: {
        currentPage: null,
        limit: null,
        totalPages: null,
        totalRecords: null,
      },
      serviceList: [],
      patientList: [],
      providerList: [],
      addressList: [],
      addressDialog: {},
      visitDialog: false,
      addFormValues: {},
      isAddFormValid: false,
      updateFormValues: {},
      updateId: null,
      isUpdateFormValid: false,
      addPickerDate: false,
      addPickerScheduledStartTime: false,
      addPickerScheduledEndTime: false,
      updatePickerDate: false,
      updatePickerScheduledStartTime: false,
      updatePickerScheduledEndTime: false,
      isLoading: false,
      isSubmitting: false,
      statusColor: {
        true: "success",
        false: "error",
      },
      snackbar: {
        message: null,
        active: false,
      },
    };
  },
  async created() {
    await this.getServices();
    await this.getPatients();
    await this.getProviders();
    await this.getAddresses();
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
          patient: this.listParams.patient,
          date: this.listParams.date,
        };
        const res = await api.getVisits(params);
        if (res.result.data.length > 0) {
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
        this.isLoading = true;
        const api = new OMSApi();
        const res = await api.getServices();
        if (res.result.data.length > 0) {
          this.serviceList = res.result.data;
        }
      } catch (error) {
        console.error(error);
        this.snackbar.message = "Failed to get services list";
        this.snackbar.active = true;
      } finally {
        this.isLoading = false;
      }
    },
    async getPatients() {
      try {
        this.isLoading = true;
        const api = new OMSApi();
        const res = await api.getPatients();
        if (res.result.data.length > 0) {
          this.patientList = res.result.data;
        }
      } catch (error) {
        console.error(error);
        this.snackbar.message = "Failed to get patients list";
        this.snackbar.active = true;
      } finally {
        this.isLoading = false;
      }
    },
    getPatientItemText(item) {
      return `${item.firstName} ${item.lastName}`;
    },
    async getProviders() {
      try {
        this.isLoading = true;
        const api = new OMSApi();
        const res = await api.getProviders();
        if (res.result.data.length > 0) {
          this.providerList = res.result.data;
        }
      } catch (error) {
        console.error(error);
        this.snackbar.message = "Failed to get providers list";
        this.snackbar.active = true;
      } finally {
        this.isLoading = false;
      }
    },
    async getAddresses() {
      try {
        this.isLoading = true;
        const api = new OMSApi();
        const res = await api.getAddresses();
        if (res.result.data.length > 0) {
          this.addressList = res.result.data;
        }
      } catch (error) {
        console.error(error);
        this.snackbar.message = "Failed to get addresses list";
        this.snackbar.active = true;
      } finally {
        this.isLoading = false;
      }
    },
    async submitVisitAdd() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const res = await api.postVisit(this.addFormValues);
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
      }
    },
    async submitVisitUpdate() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const res = await api.updateVisit(this.updateId, this.updateFormValues);
        if (res) {
          this.getVisits();
          this.snackbar.message = res.message;
          this.snackbar.active = true;
          this.$set(this.updateFormValues, this.updateId, false);
        }
      } catch (error) {
        console.error(error);
        this.snackbar.message = "Failed to update visit";
        this.snackbar.active = true;
      } finally {
        this.isSubmitting = false;
      }
    },
    setAddressDialog(props) {
      this.addressDialog = {
        street: props.street || "&#8212;",
        apartment: props.apartment || "&#8212;",
        city: props.city || "&#8212;",
        state: props.state || "&#8212;",
        zipCode: props.zipCode || "&#8212;",
        longitude: props.longitude || "&#8212;",
        latitude: props.latitude || "&#8212;",
        primary: props.primary ? "Yes" : "No",
      };
      this.$set(this.addressDialog, props.id, true);
    },
    closeAddDialog() {
      this.addDialog = false;
    },
    setUpdateData(props) {
      this.updateFormValues.date = moment(props.date).format("YYYY-MM-DD");
      this.updateFormValues.scheduledStartTime = props.scheduledStartTime;
      this.updateFormValues.scheduledEndTime = props.scheduledEndTime;
      this.updateFormValues.serviceId = props.service && props.service.id;
      this.updateFormValues.patientId = props.patient && props.patient.id;
      this.updateFormValues.addressId = props.address && props.address.id;
      this.updateId = props.id;
      this.$set(this.updateFormValues, props.id, true);
    },
    formatDate(date) {
      return date ? moment(date).format("L") : "";
    },
    formatTime(date) {
      return date ? moment(date).format("hh:mm A") : "";
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
  },
  watch: {
    options: {
      handler() {
        this.getVisits();
      },
      deep: true,
    },
    listParams: {
      handler() {
        this.getVisits();
      },
      deep: true,
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
</style>