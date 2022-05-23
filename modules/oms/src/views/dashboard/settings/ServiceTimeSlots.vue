<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="timeSlotList"
        :loading="isLoading"
        loading-text="Loading Service Time Slots..."
        item-key="_id"
        class="elevation-1 pa-3"
        mobile-breakpoint="0"
        :options.sync="options"
        :server-items-length="timeSlotListParams.totalRecords"
        :footer-props="{
          'items-per-page-options': [10, 25, 50, 100],
        }"
      >
        <template v-slot:top>
          <v-row align="center">
            <v-col sm="6" md="2" lg="6" xl="1">
              <v-btn width="120px" color="primary" @click.stop="openFormDialog">
                Add
              </v-btn>
            </v-col>
          </v-row>
        </template>

        <template v-slot:[`item.time`]="props">
          <span style="white-space: nowrap">
            {{ formatTimeCustom(props.item.startTime) }} -
            {{ formatTimeCustom(props.item.endTime) }}
          </span>
        </template>

        <template v-slot:[`item.date`]="props">
          <span style="white-space: nowrap">
            {{ formatDate(props.item.startDate) }} -
            {{ formatDate(props.item.endDate) }}
          </span>
        </template>

        <template v-slot:[`item.city`]="props">
          <v-icon :color="statusColor[props.item.city.active]">
            mdi-circle-medium
          </v-icon>
          {{ props.item.city.name }}
        </template>

        <template v-slot:[`item.service`]="props">
          <v-icon :color="statusColor[props.item.service.active]">
            mdi-circle-medium
          </v-icon>
          {{ props.item.service.name }}
        </template>

        <template v-slot:[`item.enabled`]="props">
          <v-chip
            small
            outlined
            :color="props.item.enabled ? 'primary' : 'error'"
            style="
              margin: auto;
              width: 64px;
              display: flex;
              justify-content: center;
            "
          >
            {{ props.item.enabled === true ? "Yes" : "No" }}</v-chip
          >
        </template>

        <template v-slot:[`item.actions`]="props">
          <v-btn
            depressed
            class="mr-2"
            color="primary"
            @click.stop="openFormDialog(props.item)"
          >
            Update
          </v-btn>
          <v-btn
            depressed
            color="error"
            @click.stop="openDeleteDialog(props.item)"
          >
            Delete
          </v-btn>
        </template>
      </v-data-table>
    </v-card>

    <v-dialog v-model="formDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">
            {{ formId ? "Update Service Time Slot" : "Add Service Time Slot" }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-form ref="formDialog" v-model="isFormValid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    v-model="formValues.dayOfWeek"
                    :items="dayOfWeekList"
                    label="Day Of Week"
                    item-text="label"
                    item-value="value"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    v-model="formValues.startTime"
                    :items="hourOfDayList"
                    label="Start Time"
                    item-text="label"
                    item-value="value"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    v-model="formValues.endTime"
                    :items="hourOfDayList"
                    label="End Time"
                    item-text="label"
                    item-value="value"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-menu
                    v-model="pickerStartDate"
                    :close-on-content-click="false"
                    max-width="290"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="formValues.startDate"
                        clearable
                        label="Start Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        @click:clear="startDate = null"
                      />
                    </template>
                    <v-date-picker
                      v-model="formValues.startDate"
                      @input="pickerStartDate = startDate"
                    />
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-menu
                    v-model="pickerEndDate"
                    :close-on-content-click="false"
                    max-width="290"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="formValues.endDate"
                        clearable
                        label="End Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        @click:clear="endDate = null"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="formValues.endDate"
                      @input="pickerEndDate = endDate"
                    />
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="formValues.capacity"
                    label="Capacity"
                    required
                  />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    v-model="formValues.serviceId"
                    :items="serviceList"
                    label="Service"
                    item-text="name"
                    item-value="id"
                    :disabled="formId ? true : false"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    v-model="formValues.cityId"
                    :items="cityList"
                    label="City"
                    item-text="name"
                    item-value="id"
                    disabled
                  />
                </v-col>

                <v-col cols="12">
                  <v-radio-group v-model="formValues.enabled" row>
                    <template #label>
                      <p class="text-h6 mb-0 text-gray">Enabled</p>
                    </template>
                    <v-radio :label="`Yes`" :value="true" />
                    <v-radio :label="`No`" :value="false" />
                  </v-radio-group>
                </v-col>
              </v-row>
            </v-container>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="closeFormDialog">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            :disabled="!isFormValid"
            @click="handleSubmit"
            :loading="isSubmitting"
            large
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-text>
          <div class="text-h5 text-center py-4">
            Are you sure you want to delete
            <strong>this time slot</strong>?
          </div>

          <v-row>
            <v-col cols="12" sm="6">
              <v-btn
                :loading="isSubmitting"
                depressed
                block
                color="error"
                @click="submitDelete"
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
                @click="closeDeleteDialog"
              >
                Cancel
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import Vue from "vue";
import moment from "moment";
import OMSApi from "@/api/OMSApi";
import { DaysOfWeek, HoursOfDay } from "@/utils";

export default Vue.extend({
  data() {
    return {
      headers: [
        { text: "Time", value: "time", sortable: false },
        { text: "Date", value: "date", sortable: false },
        { text: "Capacity", value: "capacity", sortable: false },
        { text: "Service Name", value: "service", sortable: false },
        { text: "City Name", value: "city", sortable: false },
        { text: "Enabled", value: "enabled", sortable: false, align: "center" },
        {
          text: "Actions",
          value: "actions",
          align: "center",
          width: "240px",
          sortable: false,
        },
      ],
      options: {},
      timeSlotList: [],
      timeSlotListParams: {
        currentPage: null,
        limit: null,
        totalPages: null,
        totalRecords: null,
      },
      serviceList: [],
      cityList: [],
      dayOfWeekList: DaysOfWeek,
      hourOfDayList: HoursOfDay,
      formDialog: false,
      formValues: {},
      updateFormValues: {},
      formId: null,
      deleteDialog: false,
      deleteValues: {},
      deleteId: null,
      isFormValid: false,
      pickerStartDate: false,
      pickerEndDate: false,
      isLoading: false,
      isSubmitting: false,
      statusColor: {
        true: "success",
        false: "error",
      },
    };
  },
  async created() {
    this.isLoading = true;
    await this.getServices();
    await this.getCities();
    this.isLoading = false;
  },
  methods: {
    async getServiceTimeSlots() {
      const { page, itemsPerPage } = this.options;
      try {
        this.isLoading = true;
        const api = new OMSApi();
        const params = {
          page: page || 1,
          limit: itemsPerPage || 10,
          city: this.$route.params.cityId,
        };
        const response = await api.getServiceTimeSlots(params);
        if (response.result.data.length > 0) {
          this.timeSlotList = response.result.data;
          this.timeSlotListParams = response.result;
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to get service time slots list",
          type: "error",
        });
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async getServices() {
      try {
        this.isLoading = true;
        const api = new OMSApi();
        const response = await api.getServices();
        if (response.result.data.length > 0) {
          this.serviceList = response.result.data;
        }
      } catch (error) {
        console.error(error);
        this.$root.snackbar.show({
          message: "Failed to get service list",
          type: "error",
        });
      } finally {
        this.isLoading = false;
      }
    },
    async getCities() {
      try {
        this.isLoading = true;
        const api = new OMSApi();
        const response = await api.getCities();
        if (response.result.data.length > 0) {
          this.cityList = response.result.data;
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to get city list",
          type: "error",
        });
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async submitAdd() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const payload = {
          ...this.formValues,
          capacity: parseInt(this.formValues.capacity),
        };
        const response = await api.createServiceTimeSlot(payload);
        if (response) {
          this.$root.snackbar.show({
            message: response.message,
            type: "success",
          });
          this.getServiceTimeSlots();
          this.closeFormDialog();
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to add service time slot",
          type: "error",
        });
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    },
    async submitUpdate() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const payload = {
          dayOfWeek: this.formValues.dayOfWeek,
          startTime: this.formValues.startTime,
          endTime: this.formValues.endTime,
          capacity: parseInt(this.formValues.capacity),
          enabled: this.formValues.enabled,
          startDate:
            this.formValues.startDate &&
            this.formatDate(this.formValues.startDate),
          endDate:
            this.formValues.endDate && this.formatDate(this.formValues.endDate),
        };
        const response = await api.updateServiceTimeSlot(this.formId, payload);
        if (response) {
          this.getServiceTimeSlots();
          this.closeFormDialog();
          this.$root.snackbar.show({
            message: response.message,
            type: "success",
          });
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to update time slot",
          type: "error",
        });
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    },
    handleSubmit() {
      if (this.formId) {
        this.submitUpdate();
      } else {
        this.submitAdd();
      }
    },
    openFormDialog(props) {
      this.formDialog = true;
      if (props.id) {
        this.formValues.dayOfWeek = props.dayOfWeek;
        this.formValues.startTime = props.startTime;
        this.formValues.endTime = props.endTime;
        this.formValues.capacity = props.capacity;
        this.formValues.enabled = props.enabled;
        this.formValues.startDate =
          props.startDate && this.formatDate(props.startDate);
        this.formValues.endDate =
          props.endDate && this.formatDate(props.endDate);
        this.formValues.serviceId = props.service.id;
        this.formValues.cityId = props.city.id;
        this.formId = props.id;
      } else {
        this.formValues.cityId = parseInt(this.$route.params.cityId);
      }
    },
    async submitDelete() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const res = await api.deleteServiceTimeSlot(this.deleteId);
        if (res) {
          this.getServiceTimeSlots();
          this.closeDeleteDialog();
          this.$root.snackbar.show({
            message: res.message,
            type: "success",
          });
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to delete time slot",
          type: "error",
        });
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    },
    closeFormDialog() {
      this.formDialog = false;
    },
    formatDate(date) {
      return date ? moment(date).format("YYYY-MM-DD") : "";
    },
    formatTimeCustom(time) {
      return time ? moment(time, "HH:mm:ss").format("hh:mm A") : "";
    },
    openDeleteDialog(props) {
      this.deleteDialog = true;
      this.deleteId = props.id;
    },
    closeDeleteDialog() {
      this.deleteDialog = false;
    },
  },
  watch: {
    options: {
      handler() {
        this.getServiceTimeSlots();
      },
      deep: true,
    },
    formDialog(newVal) {
      if (!newVal) {
        this.$refs.formDialog.reset();
      }
    },
  },
});
</script>
