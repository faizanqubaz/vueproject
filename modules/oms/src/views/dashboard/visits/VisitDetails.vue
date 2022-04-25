<template>
  <v-container fluid>
    <v-card :loading="loading" class="mb-10 pt-4 pl-4 pr-4 pb-10">
      <template slot="progress">
        <v-progress-linear
          color="primary"
          height="2"
          indeterminate
        ></v-progress-linear>
      </template>
      <v-row v-if="visitDetails">
        <v-col>
          <v-row v-if="visitDetails.status !== 'canceled'">
            <v-col>
              <v-btn @click="cancelDialog = true" color="warning"
                >Cancel Visit</v-btn
              >
            </v-col>
          </v-row>
          <!-- patient -->
          <v-row>
            <v-col>
              <v-card-title>
                <v-row align="center">
                  <v-col><span class="primary--text">Patient</span></v-col>
                </v-row>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col sm="12" md="6">
                    <v-row>
                      <v-col cols="5" class="pb-0">Name</v-col>
                      <v-col cols="7" class="pb-0">
                        <span class="mr-2">:</span>
                        {{
                          visitDetails.patient.firstName
                            ? visitDetails.patient.firstName
                            : ""
                        }}
                        {{
                          visitDetails.patient.lastName
                            ? visitDetails.patient.lastName
                            : ""
                        }}</v-col
                      >
                      <v-col cols="5" class="pb-0">Date of Birth</v-col>
                      <v-col cols="7" class="pb-0">
                        <span class="mr-2">:</span>
                        {{
                          visitDetails.patient.dob
                            ? visitDetails.patient.dob
                            : "--"
                        }}</v-col
                      >
                      <v-col cols="5" class="pb-0">Gender</v-col>
                      <v-col cols="7" class="pb-0">
                        <span class="mr-2">:</span>
                        {{
                          visitDetails.patient.gender
                            ? visitDetails.patient.gender
                            : "--"
                        }}</v-col
                      >
                      <v-col cols="5" class="pb-0">Phone</v-col>
                      <v-col cols="7" class="pb-0">
                        <span class="mr-2">:</span>
                        {{
                          visitDetails.patient.phone
                            ? visitDetails.patient.phone
                            : "--"
                        }}</v-col
                      >
                      <v-col cols="5" class="pb-0">Email</v-col>
                      <v-col cols="7" class="pb-0">
                        <span class="mr-2">:</span>
                        {{
                          visitDetails.patient.email
                            ? visitDetails.patient.email
                            : "--"
                        }}</v-col
                      >
                    </v-row>
                  </v-col>
                  <v-col sm="12" md="6">
                    <v-row>
                      <v-col cols="5" class="pb-0">Address</v-col>
                      <v-col cols="7" class="pb-0">
                        <span class="mr-2">:</span>
                        {{
                          visitDetails.address.street
                            ? visitDetails.address.street + ", "
                            : ""
                        }}{{
                          visitDetails.address.city
                            ? visitDetails.address.city + ", "
                            : ""
                        }}{{
                          visitDetails.address.state
                            ? visitDetails.address.state + ", "
                            : ""
                        }}{{
                          visitDetails.address.zipCode
                            ? visitDetails.address.zipCode
                            : ""
                        }}
                      </v-col>
                      <v-col cols="5" class="pb-0">Notes</v-col>
                      <v-col cols="7" class="pb-0">
                        <span class="mr-2">:</span>
                        {{
                          visitDetails.patientNote
                            ? visitDetails.patientNote.memo
                              ? visitDetails.patientNote.memo
                              : "--"
                            : "--"
                        }}</v-col
                      >
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-col>
          </v-row>
          <!-- end of patient -->

          <!-- visit details -->
          <v-row>
            <v-col>
              <v-card-title>
                <span class="primary--text">Visit</span>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col>
                    <v-row>
                      <v-col cols="5" class="pb-0">Date</v-col>
                      <v-col cols="7" class="pb-0">
                        <span class="mr-2">:</span>
                        {{
                          visitDetails.date
                            ? dateFormat(visitDetails.date)
                            : "-"
                        }}</v-col
                      >
                      <v-col cols="5" class="pb-0">Service</v-col>
                      <v-col cols="7" class="pb-0">
                        <span class="mr-2">:</span>
                        {{
                          visitDetails.service.name
                            ? visitDetails.service.name
                            : "--"
                        }}
                      </v-col>

                      <v-col cols="5" class="pb-0">Price</v-col>
                      <v-col cols="7" class="pb-0">
                        <span class="mr-2">:</span> ${{
                          visitDetails.service.price
                            ? visitDetails.service.price
                            : "--"
                        }}
                      </v-col>
                      <v-col cols="5" class="pb-0">Schedule</v-col>
                      <v-col cols="7" class="pb-0">
                        <span class="mr-2">:</span>
                        {{
                          visitDetails.scheduledStartTime
                            ? formatTimeCustom(visitDetails.scheduledStartTime)
                            : ""
                        }}
                        -
                        {{
                          visitDetails.scheduledEndTime
                            ? formatTimeCustom(visitDetails.scheduledEndTime)
                            : ""
                        }}
                      </v-col>
                    </v-row>
                  </v-col>
                  <v-col>
                    <v-row>
                      <v-col cols="5" class="pb-0">Start Time</v-col>
                      <v-col cols="7" class="pb-0">
                        <span class="mr-2">:</span>
                        {{
                          visitDetails.startTime
                            ? formatTimeCustom(visitDetails.startTime)
                            : "--"
                        }}</v-col
                      >
                      <v-col cols="5" class="pb-0">Check In Time</v-col>
                      <v-col cols="7" class="pb-0">
                        <span class="mr-2">:</span>
                        {{
                          visitDetails.checkInTime
                            ? formatTimeCustom(visitDetails.checkInTime)
                            : "--"
                        }}</v-col
                      >
                      <v-col cols="5" class="pb-0">Check Out Time</v-col>
                      <v-col cols="7" class="pb-0">
                        <span class="mr-2">:</span>
                        {{
                          visitDetails.checkOutTime
                            ? formatTimeCustom(visitDetails.checkOutTime)
                            : "--"
                        }}</v-col
                      >
                      <v-col cols="5" class="pb-0">Status</v-col>
                      <v-col cols="7" class="pb-0">
                        <span class="mr-2">:</span>
                        <v-chip
                          small
                          outlined
                          :color="colorStatus(visitDetails.status)"
                          >{{
                            visitDetails.status ? visitDetails.status : "--"
                          }}</v-chip
                        >
                      </v-col>
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
              <!-- end visit details -->
            </v-col>
          </v-row>
          <v-row>
            <v-col>
              <v-card-title>
                <v-row align="center">
                  <v-col><span class="primary--text">Provider</span></v-col>
                </v-row>
              </v-card-title>
              <v-card-text>
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
                        }}</v-col
                      >
                      <v-col cols="5" class="pb-0">Gender</v-col>
                      <v-col cols="7" class="pb-0">
                        <span class="mr-2">:</span>
                        {{
                          visitDetails.provider.gender
                            ? visitDetails.provider.gender
                            : "--"
                        }}</v-col
                      >
                      <v-col cols="5" class="pb-0">Email</v-col>
                      <v-col cols="7" class="pb-0">
                        <span class="mr-2">:</span>
                        {{
                          visitDetails.provider.email
                            ? visitDetails.provider.email
                            : "--"
                        }}</v-col
                      >
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
                        }}</v-col
                      >
                    </v-row>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-col>
          </v-row>
        </v-col>
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
                    >Cancel</v-btn
                  >
                </v-col>
                <v-col cols="12" sm="6">
                  <v-btn
                    depressed
                    block
                    text
                    color="blue-grey"
                    @click="cancelDialog = false"
                    >Close</v-btn
                  >
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-row>
      <v-row v-else>
        <v-col>
          <v-card-subtitle class="text-center"
            >Loading Details..</v-card-subtitle
          >
        </v-col>
      </v-row>
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
      return moment(date).format("YYYY-MM-DD");
    },
    formatTimeCustom(time) {
      return time ? moment(time, "HH:mm:ss").format("hh:mm A") : "";
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
