<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="serviceGroupList"
      :loading="isLoading"
      loading-text="Loading Service Groups..."
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
            <v-btn color="primary" width="120px" @click.stop="openFormDialog">
              Add
            </v-btn>
          </v-col>
        </v-row>
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

    <v-dialog v-model="formDialog" max-width="600px">
      <v-card>
        <v-form ref="formDialog" v-model="isFormValid" lazy-validation>
          <v-card-title>
            <span class="text-h5">
              {{ formId ? "Update Service Group" : "Add Service Group" }}
            </span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="formValues.name"
                    label="Name"
                    required
                    :rules="[...inputRules.required]"
                  />
                </v-col>
              </v-row>
            </v-container>
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
                @click="submitServiceGroupDelete"
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
  </div>
</template>

<script>
import Vue from "vue";
import OMSApi from "@/api/OMSApi";
import { FormRules } from "@/utils";

export default Vue.extend({
  data() {
    return {
      headers: [
        { text: "Id", value: "id" },
        { text: "Name", value: "name" },
        {
          text: "Actions",
          value: "actions",
          align: "center",
          width: "240px",
          sortable: false,
        },
      ],
      serviceGroupList: [],
      formDialog: false,
      formValues: {},
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
    this.getServiceGroups();
  },
  methods: {
    async getServiceGroups() {
      try {
        this.isLoading = true;
        const api = new OMSApi();
        const res = await api.getServiceGroups();
        if (res.result.data.length > 0) {
          this.serviceGroupList = res.result.data;
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
    async submitServiceGroupAdd() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const payload = {
          ...this.formValues,
        };
        const res = await api.createServiceGroup(payload);
        if (res) {
          this.getServiceGroups();
          this.closeFormDialog();
          this.$root.snackbar.show({
            message: res.message,
            type: "success",
          });
        }
      } catch (error) {
        console.error(error);
        this.$root.snackbar.show({
          message: "Failed to add service group",
          type: "error",
        });
      } finally {
        this.isSubmitting = false;
      }
    },
    async submitServiceGroupUpdate() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const payload = {
          ...this.formValues,
        };
        const res = await api.updateServiceGroup(this.formId, payload);
        if (res) {
          this.getServiceGroups();
          this.closeFormDialog();
          this.$root.snackbar.show({
            message: res.message,
            type: "success",
          });
        }
      } catch (error) {
        console.error(error);
        this.$root.snackbar.show({
          message: "Failed to update service group",
          type: "error",
        });
      } finally {
        this.isSubmitting = false;
      }
    },
    async submitServiceGroupDelete() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const res = await api.deleteServiceGroup(this.deleteId);
        if (res) {
          this.getServiceGroups();
          this.closeDeleteDialog();
          this.$root.snackbar.show({
            message: res.message,
            type: "success",
          });
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to delete service group",
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
          this.submitServiceGroupUpdate();
        } else {
          this.submitServiceGroupAdd();
        }
      }
    },
    openFormDialog(props) {
      this.formDialog = true;
      this.formId = null;
      if (props.id) {
        this.formValues.name = props.name;
        this.formId = props.id;
      }
    },
    closeFormDialog() {
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
