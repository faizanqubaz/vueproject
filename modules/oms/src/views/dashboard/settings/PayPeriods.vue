<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="payPeriodList"
        :loading="isLoading"
        loading-text="Loading Services..."
        item-key="_id"
        class="elevation-1 pa-3"
        mobile-breakpoint="0"
        :footer-props="{
          'items-per-page-options': [50, 100, 200, 500, 1000, 2000],
        }"
      >
        <template v-slot:top>
          <v-row align="center">
            <v-col sm="6" md="2" lg="6" xl="1">
              <v-btn
                width="120px"
                color="primary"
                @click.stop="openFormDialog"
              >
                Add
              </v-btn>
            </v-col>
          </v-row>
        </template>

        <!-- <template v-slot:[`item.price`]="props">
          $ {{ props.item.price }}
        </template> -->

        <template v-slot:[`item.startDate`]="props">
          {{ props.item.startDate | formatDate }}
        </template>

        <template v-slot:[`item.endDate`]="props">
          {{ props.item.endDate | formatDate }}
        </template>

        <template v-slot:[`item.payDate`]="props">
          {{ props.item.payDate | formatDate }}
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
        <v-form ref="formDialog" v-model="isFormValid" lazy-validation>
          <v-card-title>
            <span class="text-h5">
              {{ formId ? "Update Pay Period" : "Add Pay Period" }}
            </span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-menu
                    v-model="startDate"
                    :close-on-content-click="false"
                    max-width="290"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="addFormValues.startDate | formatDate"
                        clearable
                        label="Start Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        @click:clear="date = null"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="addFormValues.startDate"
                      @input="startDate = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                 <v-menu
                    v-model="endDate"
                    :close-on-content-click="false"
                    max-width="290"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="addFormValues.endDate | formatDate"
                        clearable
                        label="End Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        @click:clear="date = null"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="addFormValues.endDate"
                      @input="endDate = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-menu
                    v-model="payDate"
                    :close-on-content-click="false"
                    max-width="290"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        :value="addFormValues.payDate | formatDate"
                        clearable
                        label="Pay Date"
                        readonly
                        v-bind="attrs"
                        v-on="on"
                        @click:clear="date = null"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="addFormValues.payDate"
                      @input="payDate = false"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue-grey" text @click="closeFormDialog">
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
        </v-form>
      </v-card>
    </v-dialog>
    <v-dialog v-model="deleteDialog" max-width="400px">
      <v-card>
        <v-card-text>
          <div class="text-h5 text-center py-4">
            Are you sure you want to delete
            <strong>{{ deleteValues.name }}</strong>
            ?
          </div>
          <v-row>
            <v-col cols="12" sm="6">
              <v-btn
                :loading="isSubmitting"
                depressed
                block
                color="error"
                @click="submitPayPeriodDelete"
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
import { FormRules } from "@/utils";

export default Vue.extend({
  data() {
    return {
      activeTab: null,
      headers: [
        { text: "Id", value: "id" },
        { text: "Start Date", value: "startDate" },
        { text: "End Date", value: "endDate" },
        { text: "Pay Date", value: "payDate" },
        {
          text: "Actions",
          value: "actions",
          align: "center",
          width: "240px",
          sortable: false,
        },
      ],
      addFormValues: {},
      startDate: false,
      endDate: false,
      payDate: false,
      payPeriodList: [],
      formDialog: false,
      formId: null,
      deleteDialog: false,
      deleteValues: {},
      deleteId: null,
      isFormValid: false,
      inputRules: FormRules,
      isLoading: false,
      isSubmitting: false,
    };
  },
  created() {
    this.getPayPeriods();
  },
  filters: {
    formatDate(date) {
      return date ? moment(date).format('MM/DD/YYYY') : ''
    },
  },
  methods: {
    async getPayPeriods() {
      try {
        this.isLoading = true;
        const api = new OMSApi();
        const res = await api.getPayPeriods();
        if (res.result.data) {
          this.payPeriodList = res.result.data;
        }
      } catch (error) {
        console.error(error);
        this.$root.snackbar.show({
          message: "Failed to get pay periods list",
          type: "error",
        });
      } finally {
        this.isLoading = false;
      }
    },
    async submitPayPeriodAdd() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const payload = {
          startDate: moment(this.addFormValues.startDate).format(),
          endDate: moment(this.addFormValues.endDate).format(),
          payDate: moment(this.addFormValues.payDate).format()
        };
        const res = await api.createPayPeriod(payload);
        if (res) {
          this.getPayPeriods();
          this.closeFormDialog();
          this.$root.snackbar.show({
            message: res.message,
            type: "success",
          });
        }
      } catch (error) {
        console.error(error);
        this.$root.snackbar.show({
          message: "Failed to add pay period",
          type: "error",
        });
      } finally {
        this.isSubmitting = false;
      }
    },
    async submitPayPeriodUpdate() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const payload = {
          startDate: moment(this.addFormValues.startDate).format(),
          endDate: moment(this.addFormValues.endDate).format(),
          payDate: moment(this.addFormValues.payDate).format()
        };
        const res = await api.updatePayPeriod(this.formId, payload);
        if (res) {
          this.getPayPeriods();
          this.$root.snackbar.show({
            message: res.message,
            type: "success",
          });
          this.closeFormDialog();
        }
      } catch (error) {
        console.error(error);
        this.$root.snackbar.show({
          message: "Failed to update pay period",
          type: "error",
        });
      } finally {
        this.isSubmitting = false;
      }
    },
    async submitPayPeriodDelete() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const res = await api.deletePayPeriod(this.deleteId);
        if (res) {
          this.getPayPeriods();
          this.closeDeleteDialog();
          this.$root.snackbar.show({
            message: res.message,
            type: "success",
          });
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to delete pay period",
          type: "error",
        });
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    },
    async handleSubmit() {
      await this.$refs.formDialog.validate();
      if (this.isFormValid) {
        if (this.formId) {
          this.submitPayPeriodUpdate();
        } else {
          this.submitPayPeriodAdd();
        }
      }
    },
    openFormDialog(props) {
      this.formDialog = true;
      this.formId = null;
      if (props.id) {
        this.addFormValues.startDate = moment(props.startDate).format("YYYY-MM-DD");
        this.addFormValues.endDate = moment(props.endDate).format("YYYY-MM-DD");
        this.addFormValues.payDate = moment(props.payDate).format("YYYY-MM-DD");
        this.formId = props.id;
      }
    },
    closeFormDialog() {
      this.addFormValues = {}
      this.formDialog = false;
    },
    openDeleteDialog(props) {
      this.deleteDialog = true;
      this.deleteId = props.id;
      this.deleteValues.name = props.name;
    },
    closeDeleteDialog() {
      this.deleteDialog = false;
    },
  },
  watch: {
    formDialog(newVal) {
      if (!newVal) {
        this.$refs.formDialog.reset();
      }
    },
  },
});
</script>
