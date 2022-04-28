<template>
  <v-container fluid>
    <v-overlay absolute :opacity="0.5" :value="loading">
      <v-progress-circular indeterminate size="64">
        Loading
      </v-progress-circular>
    </v-overlay>
    <!-- patient -->
    <v-row v-if="visitDetails">
      <v-col class="pb-0">
        <v-hover v-slot="{ hover }">
          <v-card class="mb-6 pb-10">
            <v-row>
              <v-col>
                <v-card-title>
                  <v-row align="center" style="height: 64px">
                    <v-col>
                      <span class="primary--text">Patient</span>
                    </v-col>
                    <v-spacer></v-spacer>
                    <v-col v-if="hover">
                      <div class="text-right">
                        <v-btn
                          color="secondary"
                          @click="patientDialog = true"
                          text
                          tile
                        >
                          <v-icon class="mr-2">mdi-pencil</v-icon>
                          Edit
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col sm="12" md="6">
                      <v-row>
                        <v-col cols="5" class="pb-0">Name</v-col>
                        <v-col cols="7" class="pb-0">
                          <v-row>
                            <v-col class="pr-0" cols="1">:</v-col>
                            <v-col class="pl-0" cols="10">
                              {{
                                visitDetails.patient.firstName
                                  ? visitDetails.patient.firstName
                                  : ""
                              }}
                              {{
                                visitDetails.patient.lastName
                                  ? visitDetails.patient.lastName
                                  : ""
                              }}
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="5" class="pb-0">Date of Birth</v-col>
                        <v-col cols="7" class="pb-0">
                          <v-row>
                            <v-col class="pr-0" cols="1">:</v-col>
                            <v-col class="pl-0" cols="10">
                              {{
                                visitDetails.patient.dob
                                  ? dateFormat(visitDetails.patient.dob)
                                  : "--"
                              }}
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="5" class="pb-0">Gender</v-col>
                        <v-col cols="7" class="pb-0">
                          <v-row>
                            <v-col class="pr-0" cols="1">:</v-col>
                            <v-col class="pl-0" cols="10">
                              {{
                                visitDetails.patient.gender
                                  ? uppercaseFirstLetter(
                                      visitDetails.patient.gender
                                    )
                                  : "--"
                              }}
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="5" class="pb-0">Phone</v-col>
                        <v-col cols="7" class="pb-0">
                          <v-row>
                            <v-col class="pr-0" cols="1">:</v-col>
                            <v-col class="pl-0" cols="10">
                              {{
                                visitDetails.patient.phone
                                  ? visitDetails.patient.phone
                                  : "--"
                              }}
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="5" class="pb-0">Email</v-col>
                        <v-col cols="7" class="pb-0">
                          <v-row>
                            <v-col class="pr-0" cols="1">:</v-col>
                            <v-col class="pl-0" cols="10">
                              {{
                                visitDetails.patient.email
                                  ? visitDetails.patient.email
                                  : "--"
                              }}
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col sm="12" md="6">
                      <v-row>
                        <v-col cols="5" class="pb-0">Address</v-col>
                        <v-col cols="7" class="pb-0">
                          <v-row>
                            <v-col class="pr-0" cols="1">:</v-col>
                            <v-col class="pl-0" cols="10">
                              {{
                                addressFormat(
                                  visitDetails.address.street,
                                  visitDetails.address.city,
                                  visitDetails.address.state,
                                  visitDetails.address.zipCode
                                )
                              }}
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="5" class="pb-0">Notes</v-col>
                        <v-col cols="7" class="pb-0">
                          <v-row>
                            <v-col class="pr-0" cols="1">:</v-col>
                            <v-col class="pl-0" cols="10">
                              {{
                                visitDetails.patientNote
                                  ? visitDetails.patientNote.memo
                                    ? visitDetails.patientNote.memo
                                    : "--"
                                  : "--"
                              }}
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-hover>
      </v-col>
      <v-dialog v-model="patientDialog" max-width="600px">
        <v-card>
          <v-card-title>
            <span class="primary--text"> Edit Patient</span>
          </v-card-title>
          <!-- <v-card-text>
            <v-form ref="updatePatientForm" v-model="isFormValid" lazy-validation>
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
                          <v-radio-group v-model="formValues.active" row>
                            <template #label>
                              <p class="text-h6 mb-0 text-gray">Active</p>
                            </template>
                            <v-radio :label="`Yes`" :value="true" />
                            <v-radio :label="`No`" :value="false" />
                          </v-radio-group>
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
          </v-card-text> -->
        </v-card>
      </v-dialog>
    </v-row>
    <!-- end patient -->

    <!-- visit -->
    <v-row v-if="visitDetails">
      <v-col class="py-0">
        <v-hover v-slot="{ hover }">
          <v-card class="mb-6 pb-10">
            <v-row>
              <v-col>
                <v-card-title>
                  <v-row align="center" style="height: 64px">
                    <v-col><span class="primary--text">Visit</span> </v-col>
                    <v-spacer></v-spacer>
                    <v-col v-if="hover">
                      <div class="text-right">
                        <v-btn
                          color="secondary"
                          @click="visitDialog = true"
                          text
                          tile
                        >
                          <v-icon class="mr-2">mdi-pencil</v-icon> Edit
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-title>
                <v-card-text>
                  <v-row>
                    <v-col sm="12" md="6">
                      <v-row>
                        <v-col cols="5" class="pb-0">Date</v-col>
                        <v-col cols="7" class="pb-0">
                          <v-row>
                            <v-col class="pr-0" cols="1">:</v-col>
                            <v-col class="pl-0" cols="10">
                              {{
                                visitDetails.date
                                  ? dateFormat(visitDetails.date)
                                  : "-"
                              }}
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="5" class="pb-0">Time</v-col>
                        <v-col cols="7" class="pb-0">
                          <v-row>
                            <v-col class="pr-0" cols="1">:</v-col>
                            <v-col class="pl-0" cols="10">
                              {{
                                visitDetails.scheduledStartTime
                                  ? formatTimeCustom(
                                      visitDetails.scheduledStartTime
                                    )
                                  : ""
                              }}
                              -
                              {{
                                visitDetails.scheduledEndTime
                                  ? formatTimeCustom(
                                      visitDetails.scheduledEndTime
                                    )
                                  : ""
                              }}
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="5" class="pb-0">Service</v-col>
                        <v-col cols="7" class="pb-0">
                          <v-row>
                            <v-col class="pr-0" cols="1">:</v-col>
                            <v-col class="pl-0" cols="10">
                              {{
                                visitDetails.service.name
                                  ? visitDetails.service.name
                                  : "--"
                              }}
                            </v-col>
                          </v-row>
                        </v-col>

                        <v-col cols="5" class="pb-0">Price</v-col>
                        <v-col cols="7" class="pb-0">
                          <v-row>
                            <v-col class="pr-0" cols="1">:</v-col>
                            <v-col class="pl-0" cols="10">
                              ${{
                                visitDetails.service.price
                                  ? visitDetails.service.price
                                  : "--"
                              }}
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col sm="12" md="6">
                      <v-row>
                        <v-col cols="5" class="pb-0">Status</v-col>
                        <v-col cols="7" class="pb-0">
                          <v-row>
                            <v-col class="pr-0" cols="1">:</v-col>
                            <v-col class="pl-0" cols="10">
                              <v-chip
                                small
                                outlined
                                class="text-uppercase"
                                :color="colorStatus(visitDetails.status)"
                                >{{
                                  visitDetails.status
                                    ? visitDetails.status
                                    : "--"
                                }}
                              </v-chip>
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="5" class="pb-0">Start Time</v-col>
                        <v-col cols="7" class="pb-0">
                          <v-row>
                            <v-col class="pr-0" cols="1">:</v-col>
                            <v-col class="pl-0" cols="10">
                              {{
                                visitDetails.startTime
                                  ? dateFormat(visitDetails.startTime) +
                                    " " +
                                    formatTimeCustom(visitDetails.startTime)
                                  : "--"
                              }}
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="5" class="pb-0">Check In Time</v-col>
                        <v-col cols="7" class="pb-0">
                          <v-row>
                            <v-col class="pr-0" cols="1">:</v-col>
                            <v-col class="pl-0" cols="10">
                              {{
                                visitDetails.checkInTime
                                  ? dateFormat(visitDetails.checkInTime) +
                                    " " +
                                    formatTimeCustom(visitDetails.checkInTime)
                                  : "--"
                              }}
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="5" class="pb-0">Check Out Time</v-col>
                        <v-col cols="7" class="pb-0">
                          <v-row>
                            <v-col class="pr-0" cols="1">:</v-col>
                            <v-col class="pl-0" cols="10">
                              {{
                                visitDetails.checkOutTime
                                  ? dateFormat(visitDetails.checkOutTime) +
                                    " " +
                                    formatTimeCustom(visitDetails.checkOutTime)
                                  : "--"
                              }}
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-hover>
      </v-col>
      <v-dialog v-model="visitDialog" max-width="400px">
        <v-card>
          <v-card-title> Visit Dialog On Progress </v-card-title>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- end visit -->

    <!-- provider -->
    <v-row v-if="visitDetails">
      <v-col class="py-0">
        <v-hover v-slot="{ hover }">
          <v-card class="mb-6 pb-10">
            <v-row>
              <v-col>
                <v-card-title>
                  <v-row align="center" style="height: 64px">
                    <v-col><span class="primary--text">Provider</span> </v-col>
                    <v-spacer></v-spacer>
                    <v-col v-if="hover">
                      <div class="text-right">
                        <v-btn
                          :color="
                            visitDetails.provider ? 'secondary' : 'primaryzzzzz'
                          "
                          @click="providerDialog = true"
                          text
                          tile
                        >
                          <v-icon class="mr-2"
                            >mdi-{{
                              visitDetails.provider ? "pencil" : "plus"
                            }}</v-icon
                          >
                          {{ visitDetails.provider ? "Edit" : "Add" }}
                        </v-btn>
                      </div>
                    </v-col>
                  </v-row>
                </v-card-title>
                <v-card-text v-if="visitDetails.provider">
                  <v-row>
                    <v-col cols="6">
                      <v-row>
                        <v-col cols="5" class="pb-0">Name</v-col>
                        <v-col cols="7" class="pb-0">
                          <span class="mr-2">:</span>
                          {{
                            visitDetails.provider.firstName
                              ? visitDetails.provider.firstName
                              : ""
                          }}
                          {{
                            visitDetails.provider.lastName
                              ? visitDetails.provider.lastName
                              : ""
                          }}
                        </v-col>
                        <v-col cols="5" class="pb-0">Gender</v-col>
                        <v-col cols="7" class="pb-0">
                          <span class="mr-2">:</span>
                          {{
                            visitDetails.provider.gender
                              ? uppercaseFirstLetter(
                                  visitDetails.provider.gender
                                )
                              : "--"
                          }}
                        </v-col>
                        <v-col cols="5" class="pb-0">Email</v-col>
                        <v-col cols="7" class="pb-0">
                          <span class="mr-2">:</span>
                          {{
                            visitDetails.provider.email
                              ? visitDetails.provider.email
                              : "--"
                          }}
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-col>
                      <v-row>
                        <v-col cols="5" class="pb-0">Notes</v-col>
                        <v-col cols="7" class="pb-0">
                          <span class="mr-2">:</span>
                          {{
                            visitDetails.providerNote
                              ? visitDetails.providertNote
                              : "--"
                          }}
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-text v-else>
                  The visit is not assigned yet
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-hover>
      </v-col>
      <v-dialog v-model="providerDialog" max-width="400px">
        <v-card>
          <v-card-title> Provider Dialog On Progress </v-card-title>
        </v-card>
      </v-dialog>
    </v-row>
    <!-- end provider -->

    <div class="text-center" v-if="visitDetails">
      <v-btn plain class="mb-6" @click="cancelDialog = true" color="error"
        >Cancel Visit</v-btn
      >
      <v-dialog v-model="cancelDialog" max-width="400px">
        <v-card>
          <v-card-text>
            <div class="text-h5 text-center py-4">
              Are you sure you want to Cancel
              <strong>{{ visitDetails.patient.firstName }}</strong> visit?
            </div>

            <v-row>
              <v-col cols="12" sm="6">
                <v-btn
                  :loading="cancelLoading"
                  depressed
                  block
                  color="error"
                  @click="cancelVisits(visitDetails.id)"
                  >Cancel
                </v-btn>
              </v-col>
              <v-col cols="12" sm="6">
                <v-btn
                  depressed
                  block
                  text
                  color="blue-grey"
                  @click="cancelDialog = false"
                >
                  Close
                </v-btn>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-dialog>
    </div>

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
import moment from "moment";
export default Vue.extend({
  async created() {
    this.$router.currentRoute.params.id
      ? await this.getVisitDetails(this.$router.currentRoute.params.id)
      : this.$router.push(-1);
  },
  data() {
    return {
      visitDetails: null,
      loading: false,
      cancelDialog: false,
      cancelLoading: false,
      patientDialog: false,
      visitDialog: false,
      providerDialog: false,
      snackbar: {
        message: null,
        active: false,
      },
    };
  },
  methods: {
    async getVisitDetails(id) {
      this.loading = true;
      try {
        const api = new OMSApi();
        const res = await api.getVisitDetails(id);
        this.visitDetails = res.result;
      } catch (error) {
        // console.error(error);
        this.snackbar.message = "Failed to get visit details";
        this.snackbar.active = true;
      } finally {
        this.loading = false;
      }
    },
    async cancelVisits(id) {
      this.cancelLoading = true;
      try {
        const api = new OMSApi();
        let params = {
          status: "canceled",
        };
        const res = await api.updateVisit(id, params);
        this.visitDetails = res.result;
      } catch (error) {
        // console.error(error);
        this.snackbar.message = "Failed to cancel visit";
        this.snackbar.active = true;
      } finally {
        this.cancelDialog = false;
        this.snackbar.message = "Visit Canceled";
        this.snackbar.active = true;
        this.cancelLoading = false;
      }
    },
    colorStatus(val) {
      let color;
      switch (val) {
        case "enroute":
          color = "orange";
          break;

        case "completed":
          color = "green";
          break;
        case "started":
          color = "light-blue darken-4";
          break;
        case "canceled":
          color = "error";
          break;

        default:
          color = "primary";
          break;
      }
      return color;
    },
    dateFormat(date) {
      return moment(date).format("MM/DD/YYYY");
    },
    formatTimeCustom(time) {
      return time ? moment(time, "HH:mm:ss").format("hh:mm A") : "";
    },
    uppercaseFirstLetter(text) {
      return text.charAt(0).toUpperCase() + text.slice(1);
    },
    addressFormat(street, city, state, zipCode) {
      return (
        (street ? street + ", " : "") +
        (city ? city + ", " : "") +
        (state ? state + ", " : "") +
        (zipCode ? zipCode : "")
      );
    },
  },
});
</script>

<style>
.v-chip .v-chip__content {
  width: 100% !important;
  justify-content: center !important;
}
</style>
