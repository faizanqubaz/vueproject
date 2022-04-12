<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="visitList"
        :loading="isLoading"
        loading-text="Loading Visits..."
        item-key="_id"
        class="elevation-1 pa-3"
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
              <v-btn block color="primary" dark> Add Visit </v-btn>
            </v-col>

            <v-col sm="6" md="3">
              <v-menu
                v-model="menu"
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

        <template v-slot:[`item.date`]="props">
          <span style="white-space: nowrap">
            {{ formatDate(props.item.date) }}
          </span>
        </template>

        <template v-slot:[`item.scheduledStartTime`]="props">
          <span style="white-space: nowrap">
            {{ formatTimeCustom(props.item.scheduledStartTime) }}
          </span>
        </template>

        <template v-slot:[`item.scheduledEndTime`]="props">
          <span style="white-space: nowrap">
            {{ formatTimeCustom(props.item.scheduledEndTime) }}
          </span>
        </template>

        <template v-slot:[`item.startTime`]="props">
          <span style="white-space: nowrap">
            {{ formatTime(props.item.startTime) }}
          </span>
        </template>

        <template v-slot:[`item.checkInTime`]="props">
          <span style="white-space: nowrap">
            {{ formatTime(props.item.checkInTime) }}
          </span>
        </template>

        <template v-slot:[`item.checkOutTime`]="props">
          <span style="white-space: nowrap">
            {{ formatTime(props.item.checkOutTime) }}
          </span>
        </template>

        <template v-slot:[`item.patient`]="props">
          <span style="white-space: nowrap">
            {{ props.item.patient.firstName }}
            {{ props.item.patient.lastName }}
          </span>
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
            {{ props.item.address.city }},
            {{ props.item.address.state }}
          </v-btn>
        </template>

        <template v-slot:[`item.actions`]>
          <v-btn depressed class="mr-2" color="secondary"> Update </v-btn>
          <v-btn depressed color="error"> Delete </v-btn>
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
        { text: "Date", value: "date" },
        {
          text: "Scheduled Start Time",
          value: "scheduledStartTime",
          sortable: false,
        },
        {
          text: "Scheduled End Time",
          value: "scheduledEndTime",
          sortable: false,
        },
        { text: "Start Time", value: "startTime", sortable: false },
        { text: "Check In Time", value: "checkInTime", sortable: false },
        { text: "Check Out Time", value: "checkOutTime", sortable: false },
        { text: "Service", value: "service" },
        { text: "Patient", value: "patient" },
        { text: "Address", value: "address", sortable: false },
        { text: "Provider", value: "provider" },
        { text: "Actions", value: "actions", align: "center", width: "240px" },
      ],
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
      isLoading: false,
      addressDialog: {},
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
    this.getServices();
    this.getPatients();
    this.getProviders();
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
    formatDate(date) {
      return date ? moment(date).format("L") : "";
    },
    formatTime(date) {
      return date ? moment(date).format("hh:mm A") : "";
    },
    formatTimeCustom(time) {
      return time ? moment(time, "HH:mm:ss").format("hh:mm A") : "";
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
