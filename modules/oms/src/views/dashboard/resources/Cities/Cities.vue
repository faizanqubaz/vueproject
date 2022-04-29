<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :footer-props="{
          'items-per-page-options': [50, 100, 200, 500, 1000, 2000],
        }"
        :items="cities"
        :loading="isLoading"
        loading-text="Loading Cities..."
        item-key="_id"
        class="elevation-1 pa-3"
        mobile-breakpoint="0"
      >
        <template v-slot:top>
          <v-row align="center">
            <v-col sm="6" md="2" lg="2" xl="1">
              <v-dialog v-model="formDialog" max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn block color="primary" dark v-bind="attrs" v-on="on">
                    Add
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title>
                    <span class="text-h5">Add City</span>
                  </v-card-title>

                  <v-card-text>
                    <v-form ref="formAdd" v-model="isFormValid" lazy-validation>
                      <v-row>
                        <v-col cols="12">
                          <v-text-field
                            v-model="formValues.name"
                            placeholder="Name"
                            label="Name"
                            required
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-autocomplete
                            v-model="formValues.state"
                            :items="stateList"
                            label="State"
                            item-text="name"
                            item-value="name"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-autocomplete
                            v-model="formValues.timeZone"
                            :items="timeZoneList"
                            label="Time Zone"
                          />
                        </v-col>
                        <v-col cols="12">
                          <v-radio-group v-model="formValues.active" row>
                            <template #label>
                              <p class="text-h6 mb-0 text-gray">Active</p>
                            </template>
                            <v-radio :label="`Yes`" :value="true" />
                            <v-radio :label="`No`" :value="false" />
                          </v-radio-group>
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue darken-1" text @click="closeFormDialog">
                      Cancel
                    </v-btn>
                    <v-btn
                      depressed
                      color="primary"
                      @click="handleSubmit"
                      :disabled="!isFormValid"
                      :loading="isSubmitting"
                      large
                    >
                      Save
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </v-col>

            <v-col cols="12" sm="12" md="6" lg="4" class="pa-0">
              <v-text-field
                v-model="searchText"
                prepend-icon="mdi-magnify"
                label="Search"
                clearable
              />
            </v-col>
          </v-row>
        </template>
        <template v-slot:[`item.actions`]="props">
          <v-btn
            :to="{ name: 'City Detail', params: { cityId: props.item.id } }"
            depressed
            class="mr-2"
            color="secondary"
          >
            Details
          </v-btn>

          <v-dialog v-model="deleteDialog[props.item.id]" max-width="400px">
            <v-card>
              <v-card-text>
                <div class="text-h5 text-center py-4">
                  Are you sure you want to delete
                  <strong>{{ deleteDialog.name }}</strong>
                  ?
                </div>

                <v-row>
                  <v-col cols="12" sm="6">
                    <v-btn
                      :loading="isSubmitting"
                      depressed
                      block
                      color="error"
                      @click="deleteCity"
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
                      @click="$set(deleteDialog, props.item.id, false)"
                    >
                      Cancel
                    </v-btn>
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
            style="
              width: 64px;
              display: flex;
              justify-content: center;
              margin: auto;
            "
            :color="props.item.active === true ? 'primary' : 'error'"
          >
            {{ props.item.active === true ? "Yes" : "No" }}
          </v-chip>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import Vue from "vue";
import momentTz from "moment-timezone";
import OMSApi from "@/api/OMSApi";
import { States } from "@/utils";

export default Vue.extend({
  data() {
    return {
      headers: [
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
          align: "center",
          sortable: false,
        },
        {
          text: "Actions",
          value: "actions",
          align: "center",
          width: "240px",
          sortable: false,
        },
      ],
      stateList: States,
      timeZoneList: momentTz.tz.names().filter((tz) => {
        return tz.startsWith("US");
      }),
      cities: [],
      searchText: null,
      formDialog: false,
      formValues: {},
      deleteDialog: {},
      isLoading: false,
      isSubmitting: false,
    };
  },
  async created() {
    this.isLoading = true;
    await this.getCities();
    this.isLoading = false;
  },
  methods: {
    async getCities() {
      try {
        this.isLoading = true;
        const api = new OMSApi();
        const response = await api.getCities();
        if (response.result.data.length > 0) {
          this.cities = response.result.data;
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to get cities list",
          type: "error",
        });
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
    async addCity() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const payload = {
          ...this.formValues,
        };
        const response = await api.createCity(payload);
        if (response) {
          this.getCities();
          this.closeFormDialog();
          this.$root.snackbar.show({
            message: response.message,
            type: "success",
          });
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to add city",
          type: "error",
        });
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    },
    async deleteCity() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const response = await api.deleteCity(this.deleteDialog.id);
        if (response) {
          this.getCities();
          this.$set(this.deleteDialog, this.deleteDialog.id, false);
          this.$root.snackbar.show({
            message: response.message,
            type: "success",
          });
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to delete city",
          type: "error",
        });
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    },
    handleSubmit() {
      this.addCity();
    },
    closeFormDialog() {
      this.formDialog = false;
    },
    setDelete(props) {
      this.deleteDialog.name = props.name;
      this.deleteDialog.id = props.id;
      this.$set(this.deleteDialog, props.id, true);
    },
  },

  watch: {
    formDialog(newVal) {
      if (!newVal) {
        this.$refs.formAdd.reset();
      }
    },
  },
});
</script>

<style></style>
