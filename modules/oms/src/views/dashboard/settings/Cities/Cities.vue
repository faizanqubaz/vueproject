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
            <v-col sm="6" md="2" lg="6" xl="1">
              <v-dialog v-model="formDialog" max-width="600px">
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    width="120px"
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
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
                          <v-switch
                            v-model="formValues.active"
                            label="Active"
                            color="primary"
                            class="mt-0"
                          />
                        </v-col>
                      </v-row>
                    </v-form>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer />
                    <v-btn color="blue-grey" text @click="closeFormDialog">
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

            <v-col cols="12" sm="12" md="6" lg="4" offset-md="2">
              <v-spacer />
              <v-text-field
                v-model="searchText"
                prepend-icon="mdi-magnify"
                label="Search"
                clearable
                class="pa-0 ma-0"
                hide-details
              />
            </v-col>
          </v-row>
        </template>
        <template v-slot:[`item.actions`]="props">
          <v-btn
            :to="{ name: 'City Details', params: { cityId: props.item.id } }"
            depressed
            class="mr-2"
            color="primary"
          >
            Details
          </v-btn>

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

    <confirmation
      :loading="isSubmitting"
      @delete="deleteCity"
      :preventText="deleteDialog.name"
      v-model="deleteDialogModel"
    >
      <template>
        <div class="text-h5 text-center py-4">
          Are you sure you want to delete
          <strong>{{ deleteDialog.name }}</strong>
          ?
        </div>
      </template>
    </confirmation>
  </v-container>
</template>

<script>
import Vue from "vue";
import momentTz from "moment-timezone";
import OMSApi from "@/api/OMSApi";
import { States } from "@/utils";
import Confirmation from "@/components/Confirmation.vue";

export default Vue.extend({
  components: {
    Confirmation,
  },
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
      deleteDialog: {
        name: null,
        id: null,
      },
      deleteDialogModel: false,
      isFormValid: false,
      isLoading: false,
      isSubmitting: false,
    };
  },
  async created() {
    this.$store.commit("SET_LOADING", true);
    await this.getCities();
    this.$store.commit("SET_LOADING", false);
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
          this.deleteDialogModel = false;
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
      this.deleteDialogModel = true;
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
