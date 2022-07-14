<template>
  <v-container fluid>
    <v-card>
      <v-tabs v-model="activeTab">
        <v-tab>City</v-tab>
        <v-tab>Zip Codes</v-tab>
        <v-tab>Time Slots</v-tab>
        <v-tabs-items v-model="activeTab">
          <v-tab-item>
            <v-card-title>
              <span class="text-h5"> Update City </span>
            </v-card-title>
            <v-card-text>
              <v-form ref="updateForm" v-model="isFormValid" lazy-validation>
                <v-row>
                  <v-col md="6" sm="12">
                    <v-container fluid>
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
                        <v-col cols="12">
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
                        </v-col>
                      </v-row>
                    </v-container>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-tab-item>
          <v-tab-item>
            <v-card-title>
              <span class="text-h5">Service Zip Codes</span>
            </v-card-title>
            <service-zip-codes />
          </v-tab-item>
          <v-tab-item>
            <v-card-title>
              <span class="text-h5">Service Time Slots</span>
            </v-card-title>
            <service-time-slots />
          </v-tab-item>
        </v-tabs-items>
      </v-tabs>
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
      formValues: {},
      activeTab: null,
      stateList: States,
      timeZoneList: momentTz.tz.names().filter((tz) => {
        return tz.startsWith("US");
      }),
      isFormValid: false,
      isLoading: false,
      isSubmitting: false,
      snackbar: {
        message: null,
        active: false,
      },
    };
  },
  async created() {
    if (this.$route.params.cityId) {
      this.$store.commit("SET_LOADING", true);
      await this.getCityDetail();
      this.$store.commit("SET_LOADING", false);
    }
  },
  methods: {
    async getCityDetail() {
      try {
        this.isLoading = true;
        const api = new OMSApi();
        const cityId = this.$route.params.cityId;
        const response = await api.getCityById(cityId);
        if (response.result) {
          this.formValues = response.result;
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to get city detail",
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
        };
        const response = await api.createCity(payload);
        if (response) {
          this.$root.snackbar.show({
            message: response.message,
            type: "success",
          });
          this.$router.push({ name: "Cities" });
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
    async submitUpdate() {
      try {
        this.isSubmitting = true;
        const api = new OMSApi();
        const payload = {
          ...this.formValues,
        };
        delete payload["id"];
        const response = await api.updateCity(
          this.$route.params.cityId,
          payload
        );
        if (response) {
          this.$root.snackbar.show({
            message: response.message,
            type: "success",
          });
          this.$router.push({ name: "Cities" });
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to update city",
          type: "error",
        });
        console.error(error);
      } finally {
        this.isSubmitting = false;
      }
    },
    handleSubmit() {
      if (this.$route.params.cityId) {
        this.submitUpdate();
      } else {
        this.submitAdd();
      }
    },
  },
  components: {
    ServiceZipCodes: () => import("./../ServiceZipCodes.vue"),
    ServiceTimeSlots: () => import("./../ServiceTimeSlots.vue"),
  },
});
</script>
