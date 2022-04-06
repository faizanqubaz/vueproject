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
            <v-col sm="6" md="2" lg="2" xl="1">
              <v-dialog v-model="addDialog" max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn block color="primary" dark v-bind="attrs" v-on="on">
                    Add Service
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title>
                    <span class="text-h5">Add Service</span>
                  </v-card-title>

                  <v-card-text>
                    <v-form
                      ref="addForm"
                      v-model="isAddFormValid"
                      lazy-validation
                    >
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="addFormValues.name"
                              label="Name"
                              required
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="addFormValues.description"
                              label="Description"
                              required
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="addFormValues.price"
                              label="Price"
                              required
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-autocomplete
                              v-model="addFormValues.groupId"
                              :items="serviceGroupList"
                              label="Service Group"
                              item-text="name"
                              item-value="id"
                            >
                            </v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-radio-group v-model="addFormValues.active" row>
                              <template #label>
                                <p class="text-h6 mb-0 text-gray">Active</p>
                              </template>
                              <v-radio :label="`Yes`" :value="true"></v-radio>
                              <v-radio :label="`No`" :value="false"></v-radio>
                            </v-radio-group>
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
                      @click="submitServiceAdd"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
          </v-row>
        </template>

        <template v-slot:[`item.active`]="props">
          <v-chip
            small
            outlined
            :color="props.item.active ? 'primary' : 'error'"
            style="width: 64px; display: flex; justify-content: center"
          >
            {{ props.item.active === true ? "Yes" : "No" }}</v-chip
          >
        </template>

        <template v-slot:[`item.actions`]="props">
          <v-dialog v-model="updateFormValues[props.item.id]" max-width="600px">
            <v-card>
              <v-card-title>
                <span class="text-h5">Update Service</span>
              </v-card-title>
              <v-card-text>
                <v-form
                  ref="updateForm"
                  v-model="isUpdateFormValid"
                  lazy-validation
                >
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="updateFormValues.name"
                          label="Name"
                          required
                        />
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="updateFormValues.description"
                          label="Description"
                          required
                        />
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-text-field
                          v-model="updateFormValues.price"
                          label="Price"
                          required
                        />
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-autocomplete
                          v-model="updateFormValues.groupId"
                          :items="serviceGroupList"
                          label="Service Group"
                          item-text="name"
                          item-value="id"
                        >
                        </v-autocomplete>
                      </v-col>
                      <v-col cols="12" sm="12" md="12">
                        <v-radio-group v-model="updateFormValues.active" row>
                          <template #label>
                            <p class="text-h6 mb-0 text-gray">Active</p>
                          </template>
                          <v-radio :label="`Yes`" :value="true"></v-radio>
                          <v-radio :label="`No`" :value="false"></v-radio>
                        </v-radio-group>
                      </v-col>
                      <v-col cols="12">
                        <v-btn
                          depressed
                          color="primary"
                          @click="submitServiceUpdate"
                          :disabled="!isUpdateFormValid"
                          :loading="isSubmitting"
                          block
                          >Update
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-form>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-btn
            depressed
            class="mr-2"
            color="secondary"
            @click.stop="setUpdateData(props.item)"
          >
            Update
          </v-btn>
          <v-dialog v-model="deleteDialog[props.item.id]" max-width="400px">
            <v-card>
              <v-card-text>
                <div class="text-h5 text-center py-4">
                  Are you sure you want to delete
                  <strong>{{ deleteDialog.name }}</strong
                  >?
                </div>

                <v-row>
                  <v-col cols="12" sm="6">
                    <v-btn
                      :loading="isSubmitting"
                      depressed
                      block
                      color="error"
                      @click="submitServiceDelete"
                      >Delete</v-btn
                    >
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-btn
                      depressed
                      block
                      text
                      color="blue-grey"
                      @click="$set(deleteDialog, props.item.id, false)"
                      >Cancel</v-btn
                    >
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-btn
            depressed
            @click.stop="setDeleteData(props.item)"
            color="error"
          >
            Delete
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
  </v-container>
</template>

<script>
import Vue from "vue";
import OMSApi from "@/api/OMSApi";

export default Vue.extend({
  data() {
    return {
      headers: [
        { text: "Id", value: "id" },
        { text: "Name", value: "name" },
        { text: "Description", value: "description" },
        { text: "Price", value: "price" },
        { text: "Group", value: "group.name" },
        { text: "Active", value: "active" },
        { text: "Actions", value: "actions", align: "center", width: "240px" },
      ],
      serviceList: [],
      serviceGroupList: [],
      addDialog: false,
      addForm: false,
      addFormValues: {
        name: null,
        description: null,
        price: null,
        groupId: null,
        active: true,
      },
      updateFormValues: {},
      updateId: null,
      deleteDialog: {},
      isAddFormValid: false,
      isUpdateFormValid: false,
      isLoading: false,
      isSubmitting: false,
      snackbar: {
        message: null,
        active: false,
      },
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
        if (res.result.data.length > 0) {
          this.serviceList = res.result.data;
        }
      } catch (error) {
        console.error(error);
        this.snackbar.message = "Failed to get service list";
        this.snackbar.active = true;
      } finally {
        this.isLoading = false;
      }
    },
    async getServiceGroups() {
      try {
        this.isLoading = true;
        const api = new OMSApi();
        const res = await api.getServiceGroups();
        if (res.result.data.length > 0) {
          this.serviceGroupList = res.result.data;
        }
      } catch (error) {
        console.error(error);
        this.snackbar.message = "Failed to get service group list";
        this.snackbar.active = true;
      } finally {
        this.isLoading = false;
      }
    },
    async submitServiceAdd() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const res = await api.postServices(this.addFormValues);
        if (res) {
          this.getServices();
          this.closeAddDialog();
          this.snackbar.message = res.message;
          this.snackbar.active = true;
        }
      } catch (error) {
        console.error(error);
        this.snackbar.message = "Failed to add service";
        this.snackbar.active = true;
      } finally {
        this.isSubmitting = false;
      }
    },
    async submitServiceUpdate() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const res = await api.updateServices(this.updateId, {
          name: this.updateFormValues.name,
          description: this.updateFormValues.description,
          price: this.updateFormValues.price.toString(),
          active: this.updateFormValues.active,
          groupId: this.updateFormValues.groupId,
          //   (this.updateFormValues.group && this.updateFormValues.group.id) ||
          //   null,
        });
        if (res) {
          this.getServices();
          this.snackbar.message = res.message;
          this.snackbar.active = true;
          this.$set(this.updateFormValues, this.updateId, false);
        }
      } catch (error) {
        console.error(error);
        this.snackbar.message = "Failed to update service";
        this.snackbar.active = true;
      } finally {
        this.isSubmitting = false;
      }
    },
    async submitServiceDelete() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const res = await api.deleteServices(this.deleteDialog.id);
        if (res) {
          this.getServices();
          this.snackbar.message = res.message;
          this.snackbar.active = true;
          this.$set(this.deleteDialog, this.deleteDialog.id, false);
        }
      } catch (error) {
        this.snackbar.message = "Failed to delete service";
        this.snackbar.active = true;
      } finally {
        this.isSubmitting = false;
      }
    },
    closeAddDialog() {
      this.addDialog = false;
    },
    setUpdateData(props) {
      this.updateFormValues.name = props.name;
      this.updateFormValues.description = props.description;
      this.updateFormValues.price = props.price;
      this.updateFormValues.active = props.active;
      this.updateFormValues.groupId = props.group.id;
      this.updateId = props.id;
      this.$set(this.updateFormValues, props.id, true);
    },
    setDeleteData(props) {
      this.deleteDialog.name = props.name;
      this.deleteDialog.id = props.id;
      this.$set(this.deleteDialog, props.id, true);
    },
  },
  watch: {
    addDialog(newVal) {
      if (!newVal) {
        this.$refs.addForm.reset();
      }
    },
  },
});
</script>
