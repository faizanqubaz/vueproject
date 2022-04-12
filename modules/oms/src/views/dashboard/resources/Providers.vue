<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :footer-props="{
          'items-per-page-options': [10, 25, 50, 100],
        }"
        :items="providerList"
        :loading="loading"
        loading-text="Loading Providers..."
        item-key="_id"
        class="elevation-1 pa-3"
        mobile-breakpoint="0"
      >
        <template v-slot:top>
          <v-row align="center">
            <v-col sm="6" md="2" lg="2" xl="1">
              <v-dialog v-model="addDialog" max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn block color="primary" dark v-bind="attrs" v-on="on">
                    Add Provider
                  </v-btn>
                </template>
                <v-card>
                  <v-card-title>
                    <span class="text-h5">Add Provider</span>
                  </v-card-title>
                  <v-card-text>
                    <v-form ref="addForm" v-model="valid" lazy-validation>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="editedItem.firstName"
                              label="First Name"
                              required
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="editedItem.middleName"
                              label="Middle Name"
                              required
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="editedItem.lastName"
                              label="Last Name"
                              required
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="editedItem.dob"
                              label="Date of Birth"
                              required
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-autocomplete
                              v-model="editedItem.gender"
                              :items="gender"
                              label="Gender"
                            ></v-autocomplete>
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="editedItem.phone"
                              label="Phone Number"
                              required
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="editedItem.email"
                              label="Email Address"
                              required
                            />
                          </v-col>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="editedItem.authId"
                              label="Auth ID"
                              required
                            />
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
                      @click="addNewProvider"
                      :disabled="!valid"
                      :loading="saveLoading"
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>
            <v-col cols="12" sm="12" md="6" lg="4" class="">
              <v-text-field
                v-model="searchText"
                prepend-icon="mdi-magnify"
                label="Search"
                clearable
              ></v-text-field>
            </v-col> 
          </v-row>
        </template>
        <template v-slot:[`item.actions`]="props">
          <v-dialog v-model="updateDialog[props.item.id]" max-width="600px">
            <v-card>
              <v-card-title>
                <span class="text-h5">Update Provider</span>
              </v-card-title>
              <v-card-text>
                <v-form
                  ref="updateForm"
                  v-model="updateFormValid"
                  lazy-validation
                >
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="updateDialog.firstName"
                        placeholder="First Name"
                        label="First Name"
                        required
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="updateDialog.middleName"
                        placeholder="Middle Name"
                        label="Middle Name"
                        required
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="updateDialog.lastName"
                        placeholder="Last Name"
                        label="Last Name"
                        required
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="updateDialog.dob"
                        placeholder="Date of Birth"
                        label="Date of Birth"
                        required
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="updateDialog.gender"
                        :items="gender"
                        label="Gender"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="updateDialog.phone"
                        placeholder="Phone Number"
                        label="Phone Number"
                        required
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="updateDialog.email"
                        placeholder="Email Address"
                        label="Email Address"
                        required
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-text-field
                        v-model="updateDialog.authId"
                        placeholder="Auth ID"
                        label="Auth ID"
                        required
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-btn
                        depressed
                        color="primary"
                        @click="updateProviders"
                        :disabled="!updateFormValid"
                        :loading="saveLoading"
                        block
                        >Update</v-btn
                      >
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-btn
            depressed
            @click.stop="setUpdate(props.item)"
            class="mr-2"
            color="secondary"
          >
            Update
          </v-btn>
           <v-dialog v-model="deleteDialog[props.item.id]" max-width="400px">
            <v-card>
              <v-card-text>
                <div class="text-h5 text-center py-4">
                  Are you sure you want to delete
                  <strong>{{ deleteDialog.firstName }}</strong
                  >?
                </div>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-btn
                      :loading="saveLoading"
                      depressed
                      block
                      color="error"
                      @click="deleteProviders()"
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
            @click.stop="setDelete(props.item)"
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
import Vue from 'vue'
import OMSApi from "../../../api/OMSApi";

export default Vue.extend({
  data() {
    return {
      headers: [
        {
          text: "Id",
          value: "id",
        },
        {
          text: "First Name",
          value: "firstName",
        },
        {
          text: "Last Name",
          value: "lastName",
        },
        {
          text: "Gender",
          value: "gender",
        },
        {
          text: "Phone Number",
          value: "phone",
        },
        {
          text: "Email",
          value: "email",
        },
        {
          text: "Actions",
          value: "actions",
        },
      ],
      snackbar: {
        message: null,
        active: false,
      },
       providerList: [],
       loading: true,
       saveLoading: false,
       addDialog: false,
       valid: false,
       editedItem: {
         firstName: null,
         middleName: null,
         lastName: null,
         dob: null,
         gender: null,
         phone: null,
         email: null,
         authId: null,
      },
      gender: [
        "male",
        "female"
        ],
      searchText: null,
      updateDialog: {},
      deleteDialog: {},
      updateId: null,
      updateFormValid: false
    }
  },
  async created() {
    this.loading = true;
    await this.getProviders();
    this.loading = false;
  },
  methods: {
    async getProviders() {
      this.loading = true;
      try {
        const api = new OMSApi();
        const response = await api.getProviders();
        console.log(response)
        if (response.result.data.length > 0) {
          this.providerList = response.result.data;
          this.loading = false;
        }
      } catch (error) {
        console.log(error);
        this.loading = false;
      }
    },
    closeAddDialog() {
      this.addDialog = false;
    },
    dialogToggle() {
      this.addDialog = true;
    },
    async addNewProvider() {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        const response = await api.postProviders(this.editedItem);
        if (response) {
          this.getProviders();
          this.snackbar.message = response.message;
          this.saveLoading = false;
          this.closeAddDialog();
          this.snackbar.active = true;
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to add providers";
        this.snackbar.active = true;
      }
    },
    setUpdate(props) {
      this.updateDialog.firstName = props.firstName;
      this.updateDialog.middleName = props.middleName;
      this.updateDialog.lastName = props.lastName;
      this.updateDialog.dob = props.dob;
      this.updateDialog.gender = props.gender;
      this.updateDialog.phone = props.phone;
      this.updateDialog.email = props.email;
      this.updateDialog.authId = props.authId;
      this.updateId = props.id;
      this.$set(this.updateDialog, props.id, true);
    },
    async updateProviders() {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        const response = await api.updateProviders(this.updateId, {
          firstName: this.updateDialog.firstName,
          middleName: this.updateDialog.middleName,
          lastName: this.updateDialog.lastName,
          dob: this.updateDialog.dob,
          gender: this.updateDialog.gender,
          phone: this.updateDialog.phone,
          email: this.updateDialog.email,
          authId: this.updateDialog.authId,
        });
        if (response) {
          this.getProviders();
          this.snackbar.message = response.message;
          this.saveLoading = false;
          this.$set(this.updateDialog, this.updateId, false);
          this.snackbar.active = true;
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to update providers";
        this.snackbar.active = true;
      }
    },
    setDelete(props) {
      this.deleteDialog.firstName = props.firstName;
      this.deleteDialog.id = props.id;
      this.$set(this.deleteDialog, props.id, true);
    },
    async deleteProviders() {
      try {
        this.saveLoading = true;
        const api = new OMSApi();
        const response = await api.deleteProviders(this.deleteDialog.id);
        if (response) {
          this.getProviders();
          this.snackbar.message = response.message;
          this.snackbar.active = true;
          this.$set(this.deleteDialog, this.deleteDialog.id, false);
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to delete provider";
        this.snackbar.active = true;
      }
    },
  },
  watch: {
    addDialog(newVal) {
      if (!newVal) {
        this.$refs.addForm.reset();
      }
    },
  },
})
</script>