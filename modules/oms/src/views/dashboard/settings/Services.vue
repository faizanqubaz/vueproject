<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="serviceList"
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
              <v-btn width="120px" color="primary" @click.stop="openFormDialog">
                Add
              </v-btn>
            </v-col>
          </v-row>
        </template>

        <template v-slot:[`item.price`]="props">
          $ {{ props.item.price }}
        </template>

        <template v-slot:[`item.payment`]="props">
          $ {{ props.item.payment }}
        </template>

        <template v-slot:[`item.active`]="props">
          <v-chip
            small
            outlined
            :color="props.item.active ? 'primary' : 'error'"
            style="width: 64px; display: flex; justify-content: center"
          >
            {{ props.item.active === true ? "Yes" : "No" }}
          </v-chip>
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
              {{ formId ? "Update Service" : "Add Service" }}
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
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="formValues.description"
                    label="Description"
                    required
                    :rules="[...inputRules.required]"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="formValues.price"
                    label="Patient Cost"
                    type="number"
                    required
                    :rules="[...inputRules.required]"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-text-field
                    v-model="formValues.payment"
                    label="Provider Payment"
                    type="number"
                    require
                    :rules="[...inputRules.required]"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-autocomplete
                    v-model="formValues.groupId"
                    :items="serviceGroupList"
                    label="Service Group"
                    item-text="name"
                    item-value="id"
                    :rules="[...inputRules.required]"
                  />
                </v-col>
                <v-col cols="12" sm="12" md="12">
                  <v-switch 
                    v-model="formValues.active"
                    label="Active"
                    color="primary"
                    class="mt-0"
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
                @click="submitServiceDelete"
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
import { FormRules } from "@/utils";

export default Vue.extend({
  data() {
    return {
      headers: [
        { text: "Id", value: "id" },
        { text: "Name", value: "name" },
        { text: "Description", value: "description" },
        { text: "Patient Cost", value: "price" },
        { text: "Provider Payment", value: "payment" },
        { text: "Group", value: "group.name" },
        { text: "Active", value: "active" },
        {
          text: "Actions",
          value: "actions",
          align: "center",
          width: "240px",
          sortable: false,
        },
      ],
      serviceList: [],
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
    this.getServices();
    this.getServiceGroups();
  },
  methods: {
    async getServices() {
      try {
        this.isLoading = true;
        const api = new OMSApi();
        const res = await api.getServices();
        if (res.result.data) {
          this.serviceList = res.result.data;
        }
      } catch (error) {
        console.error(error);
        this.$root.snackbar.show({
          message: "Failed to get services list",
          type: "error",
        });
      } finally {
        this.isLoading = false;
      }
    },
    async getServiceGroups() {
      try {
        this.isLoading = true;
        const api = new OMSApi();
        const res = await api.getServiceGroups();
        if (res.result.data) {
          this.serviceGroupList = res.result.data;
        }
      } catch (error) {
        console.error(error);
        this.$root.snackbar.show({
          message: "Failed to get service groups list",
          type: "error",
        });
      } finally {
        this.isLoading = false;
      }
    },
    async submitServiceAdd() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const payload = {
          ...this.formValues,
          payment: this.formValues.payment
            ? parseFloat(this.formValues.payment)
            : undefined,
        };
        const res = await api.createService(payload);
        if (res) {
          this.getServices();
          this.closeFormDialog();
          this.$root.snackbar.show({
            message: res.message,
            type: "success",
          });
        }
      } catch (error) {
        console.error(error);
        this.$root.snackbar.show({
          message: "Failed to add service",
          type: "error",
        });
      } finally {
        this.isSubmitting = false;
      }
    },
    async submitServiceUpdate() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const payload = {
          name: this.formValues.name,
          description: this.formValues.description,
          price: this.formValues.price ? this.formValues.price.toString() : "0",
          payment: this.formValues.payment
            ? parseFloat(this.formValues.payment)
            : null,
          active: this.formValues.active,
          groupId: this.formValues.groupId,
          //   (this.formValues.group && this.formValues.group.id) ||
          //   null,
        };
        const res = await api.updateService(this.formId, payload);
        if (res) {
          this.getServices();
          this.$root.snackbar.show({
            message: res.message,
            type: "success",
          });
          this.closeFormDialog();
        }
      } catch (error) {
        console.error(error);
        this.$root.snackbar.show({
          message: "Failed to update service",
          type: "error",
        });
      } finally {
        this.isSubmitting = false;
      }
    },
    async submitServiceDelete() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const res = await api.deleteService(this.deleteId);
        if (res) {
          this.getServices();
          this.closeDeleteDialog();
          this.$root.snackbar.show({
            message: res.message,
            type: "success",
          });
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to delete service",
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
          this.submitServiceUpdate();
        } else {
          this.submitServiceAdd();
        }
      }
    },
    openFormDialog(props) {
      this.formDialog = true;
      this.formId = null;
      if (props.id) {
        this.formValues.name = props.name;
        this.formValues.description = props.description;
        this.formValues.price = props.price;
        this.formValues.payment = props.payment;
        this.formValues.active = props.active;
        this.formValues.groupId = props.group.id;
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
    renderFormatUSD(string) {
      return string ? `$ ${string}` : "0";
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
