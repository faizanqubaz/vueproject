<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="zipCodeList"
        :loading="isLoading"
        loading-text="Loading Service Zip Codes..."
        item-key="_id"
        class="elevation-1 pa-3"
        mobile-breakpoint="0"
        :options.sync="options"
        :server-items-length="zipCodeListParams.totalRecords"
        :footer-props="{
          'items-per-page-options': [10, 25, 50, 100],
        }"
      >
        <template v-slot:top>
          <v-row align="center">
            <v-col sm="6" md="2" lg="6" xl="1">
              <div class="d-flex">
                <v-btn
                  width="120px"
                  color="primary"
                  @click.stop="openFormDialog"
                  class="mr-2"
                >
                  Add
                </v-btn>
                <v-btn color="primary" @click="openUploadDialog">
                  <v-icon class="pr-2">mdi-cloud-upload</v-icon>
                  Upload
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </template>

        <template v-slot:[`item.city`]="props">
          <v-icon :color="statusColor[props.item.city.active]">
            mdi-circle-medium</v-icon
          >
          {{ props.item.city.name }}
        </template>

        <template v-slot:[`item.service`]="props">
          <v-icon :color="statusColor[props.item.service.active]">
            mdi-circle-medium</v-icon
          >
          {{ props.item.service.name }}
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

    <v-dialog v-model="uploadDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5"> Upload Data </span>
        </v-card-title>
        <v-card-text>
          <v-form ref="uploadDialog" v-model="isFormUploadValid">
            <v-col cols="12" sm="12" md="12">
              <v-file-input
                v-model="uploadFile"
                accept=".csv, text/csv"
                @change="onUpload"
                label="Upload File"
                :rules="[...inputRules.required]"
                prepend-icon=""
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
                :rules="[...inputRules.required]"
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
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="blue darken-1" text @click="closeUploadDialog">
            Cancel
          </v-btn>
          <v-btn
            color="primary"
            @click="submitUpload"
            :loading="isSubmitting"
            large
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="formDialog" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="text-h5">
            {{ formId ? "Update Service Zip Code" : "Add Service Zip Code" }}
          </span>
        </v-card-title>
        <v-card-text>
          <v-form ref="formDialog" v-model="isFormValid" lazy-validation>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="formValues.zipCode"
                    label="Zip Code"
                    required
                    :rules="[...inputRules.required]"
                    maxLength="5"
                    type="tel"
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
                    :rules="[...inputRules.required]"
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
            <strong>{{ deleteValues.zipCode }}</strong>
            ?
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
import OMSApi from "@/api/OMSApi";
import Papa from "papaparse";
import { FormRules } from "@/utils";

export default Vue.extend({
  data() {
    return {
      headers: [
        { text: "Zip Code", value: "zipCode" },
        { text: "Service Name", value: "service" },
        { text: "City Name", value: "city" },
        {
          text: "Actions",
          value: "actions",
          align: "center",
          width: "240px",
          sortable: false,
        },
      ],
      options: {},
      zipCodeList: [],
      zipCodeListParams: {
        currentPage: null,
        limit: null,
        totalPages: null,
        totalRecords: null,
      },
      serviceList: [],
      cityList: [],
      uploadDialog: false,
      uploadData: null,
      uploadFile: null,
      formDialog: false,
      formValues: {},
      formId: null,
      deleteDialog: false,
      deleteValues: {},
      deleteId: null,
      isFormValid: false,
      isFormUploadValid: false,
      isLoading: false,
      isSubmitting: false,
      inputRules: FormRules,
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
    async getServiceZipCodes() {
      const { page, itemsPerPage } = this.options;
      try {
        this.isLoading = true;
        const api = new OMSApi();
        const params = {
          page: page || 1,
          limit: itemsPerPage || 10,
          city: this.$route.params.cityId,
        };
        const res = await api.getServiceZipCodes(params);
        if (res.result.data.length > 0) {
          this.zipCodeList = res.result.data;
          this.zipCodeListParams = res.result;
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to get service zip codes list",
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
        const res = await api.getServices();
        if (res.result.data.length > 0) {
          this.serviceList = res.result.data;
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
          zipCodes: this.formDialog
            ? [`${this.formValues.zipCode}`]
            : this.uploadData,
          serviceId: this.formValues.serviceId,
          cityId: this.formValues.cityId,
        };
        const res = await api.createServiceZipCode(payload);
        if (res) {
          this.getServiceZipCodes();
          this.closeFormDialog();
          this.closeUploadDialog();
          this.$root.snackbar.show({
            message: res.message,
            type: "success",
          });
        }
      } catch (error) {
        const errMsg = error.response.data.error;
        this.$root.snackbar.show({
          message: errMsg || "Failed to add zip code",
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
          zipCode: this.formValues.zipCode,
        };
        const res = await api.updateServiceZipCode(this.formId, payload);
        if (res) {
          this.getServiceZipCodes();
          this.closeFormDialog();
          this.$root.snackbar.show({
            message: res.message,
            type: "success",
          });
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to update zip code",
          type: "error",
        });
        // console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    },
    async submitDelete() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const res = await api.deleteServiceZipCode(this.deleteId);
        if (res) {
          this.getServiceZipCodes();
          this.closeDeleteDialog();
          this.$root.snackbar.show({
            message: res.message,
            type: "success",
          });
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to delete zip code",
          type: "error",
        });
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    },
    async submitUpload() {
      await this.$refs.uploadDialog.validate();
      if (this.isFormUploadValid) {
        this.submitAdd();
      }
    },
    async handleSubmit() {
      await this.$refs.formDialog.validate();
      if (this.isFormValid) {
        if (this.formId) {
          this.submitUpdate();
        } else {
          this.submitAdd();
        }
      }
    },
    openUploadDialog() {
      this.uploadDialog = true;
      this.formValues.cityId = parseInt(this.$route.params.cityId);
    },
    closeUploadDialog() {
      this.uploadDialog = false;
    },
    onUpload(file) {
      if (file) {
        Papa.parse(file, {
          complete: function (results) {
            if (results.data.length > 0) {
              const joinData = results.data.map((val) => val.join(", "));
              const header = joinData.shift();
              if (header === "ZipCodes") {
                this.uploadFile = file;
                this.uploadData = joinData;
              } else {
                this.uploadFile = null;
                this.$root.snackbar.show({
                  message: "The file must contain 'ZipCodes' header",
                  type: "error",
                });
              }
            }
          }.bind(this),
        });
      } else {
        this.uploadData = null;
      }
    },
    openFormDialog(props) {
      this.formDialog = true;
      if (props.id) {
        this.formValues.zipCode = props.zipCode;
        this.formValues.serviceId = props.service.id;
        this.formValues.cityId = props.city.id;
        this.formId = props.id;
      } else {
        this.formValues.cityId = parseInt(this.$route.params.cityId);
      }
    },
    closeFormDialog() {
      this.formDialog = false;
    },
    openDeleteDialog(props) {
      this.deleteDialog = true;
      this.deleteId = props.id;
      this.deleteValues.zipCode = props.zipCode;
    },
    closeDeleteDialog() {
      this.deleteDialog = false;
    },
  },
  watch: {
    options: {
      handler() {
        this.getServiceZipCodes();
      },
      deep: true,
    },
    formDialog(newVal) {
      if (!newVal) {
        this.$refs.formDialog.reset();
        this.formId = null;
      }
    },
    uploadDialog(newVal) {
      if (!newVal) {
        this.$refs.uploadDialog.reset();
      }
    },
  },
});
</script>
