<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :footer-props="{
          'items-per-page-options': [50, 100, 200, 500, 1000, 2000],
        }"
        :items="cities"
        :loading="loading"
        loading-text="Loading Cities..."
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
                    Add City
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title>
                    <span class="text-h5">Add City</span>
                  </v-card-title>

                  <v-card-text>
                    <v-form ref="addForm" v-model="valid" lazy-validation>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              v-model="editedItem.name"
                              label="Name"
                              required
                            />
                          </v-col>

                          <v-col cols="12" sm="12" md="12">
                            <v-autocomplete
                              v-model="editedItem.state"
                              :items="state"
                              label="State"
                            ></v-autocomplete>
                          </v-col>

                          <v-col cols="12" sm="12" md="12">
                            <v-autocomplete
                              v-model="editedItem.timeZone"
                              :items="timeZone"
                              label="Time Zone"
                            ></v-autocomplete>
                          </v-col>

                          <v-col cols="12" sm="12" md="12">
                            <v-radio-group v-model="editedItem.active" row>
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
                      @click="addNewCities"
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
                <span class="text-h5">Update City</span>
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
                        v-model="updateDialog.name"
                        placeholder="Name"
                        label="Name"
                        required
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="updateDialog.state"
                        :items="state"
                        label="State"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="updateDialog.timeZone"
                        :items="timeZone"
                        label="Time Zone"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12">
                      <v-radio-group v-model="updateDialog.active" row>
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
                        @click="updateCities(props.item)"
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
                  <strong>{{ deleteDialog.name }}</strong
                  >?
                </div>

                <v-row>
                  <v-col cols="12" sm="6">
                    <v-btn
                      :loading="saveLoading"
                      depressed
                      block
                      color="error"
                      @click="deleteCities()"
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

          <v-btn depressed @click.stop="setDelete(props.item)" color="error">
            Delete
          </v-btn>
        </template>
        <template v-slot:[`item.active`]="props">
          <v-chip
            small
            outlined
            style="width: 64px; display: flex; justify-content: center"
            :color="props.item.active === true ? 'primary' : 'error'"
            >{{ props.item.active === true ? "Yes" : "No" }}</v-chip
          >
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
import moment from "moment-timezone";
import OMSApi from "@/api/OMSApi";

export default Vue.extend({
  data() {
    return {
      headers: [
        {
          text: "Id",
          value: "id",
        },
        {
          text: "Name",
          value: "name",
        },
        {
          text: "State",
          value: "state",
        },
        {
          text: "Time Zone",
          value: "timeZone",
        },
        {
          text: "Active",
          value: "active",
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
      cities: [],
      loading: true,
      saveLoading: false,
      addDialog: false,
      valid: false,
      editedItem: {
        name: null,
        state: null,
        timeZone: null,
        active: true,
      },
      searchText: null,
      updateDialog: {},
      updateId: null,
      updateFormValid: false,
      deleteDialog: {},
      timeZone: moment.tz.names().filter((timeZone) => {
        return timeZone.startsWith("US");
      }),
      state: [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "District of Columbia",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virgin Island",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming",
      ],
    };
  },
  async created() {
    this.loading = true;
    await this.getCities();
    this.loading = false;
  },
  methods: {
    async getCities() {
      this.loading = true;
      try {
        const api = new OMSApi();
        const response = await api.getCities();
        if (response.result.data.length > 0) {
          this.cities = response.result.data;
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
    async addNewCities() {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        const response = await api.postCities(this.editedItem);
        if (response) {
          this.getCities();
          this.snackbar.message = response.message;
          this.saveLoading = false;
          this.closeAddDialog();
          this.snackbar.active = true;
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to add city";
        this.snackbar.active = true;
      }
    },
    setUpdate(props) {
      this.updateDialog.name = props.name;
      this.updateDialog.state = props.state;
      this.updateDialog.timeZone = props.timeZone;
      this.updateDialog.active = props.active;
      this.updateId = props.id;
      this.$set(this.updateDialog, props.id, true);
    },
    async updateCities() {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        const response = await api.updateCities(this.updateId, {
          name: this.updateDialog.name,
          state: this.updateDialog.state,
          timeZone: this.updateDialog.timeZone,
          active: this.updateDialog.active,
        });
        if (response) {
          this.getCities();
          this.snackbar.message = response.message;
          this.saveLoading = false;
          this.$set(this.updateDialog, this.updateId, false);
          this.snackbar.active = true;
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to update city";
        this.snackbar.active = true;
      }
    },
    setDelete(props) {
      this.deleteDialog.name = props.name;
      this.deleteDialog.id = props.id;
      this.$set(this.deleteDialog, props.id, true);
    },
    async deleteCities(props) {
      this.saveLoading = true;
      try {
        const api = new OMSApi();
        const response = await api.deleteCities(this.deleteDialog.id);
        if (response) {
          this.getCities();
          this.snackbar.message = response.message;
          this.saveLoading = false;
          this.$set(this.deleteDialog, this.deleteDialog.id, false);
          this.snackbar.active = true;
        }
      } catch (error) {
        this.saveLoading = false;
        this.snackbar.message = "Failed to delete city";
        this.snackbar.active = true;
      }
      // this.$set(this.deleteDialog, props.id, true);
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

<style></style>
