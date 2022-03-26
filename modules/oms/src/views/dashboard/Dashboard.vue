<template>
  <v-container id="dashboard" fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="patientAppointments"
        :options.sync="options"
        :server-items-length="totalPatientAppointments"
        :loading="loading"
        loading-text="Loading appointments..."
        :items-per-page="itemsPerPage"
        :footer-props="{
          'items-per-page-options': [50, 100, 200, 500, 1000, 2000]
        }"
        item-key="_id"
        class="elevation-1 pa-3"
        mobile-breakpoint="0"
        disable-sort
        
      >
        <template v-slot:top>
          <v-row align="center">
            <v-col sm="6" md="2" lg="2" xl="1">
              <v-dialog
                v-model="addDialog"
                max-width="600px"
                @input="dialogToggle"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    block
                    color="primary"
                    dark
                    v-bind="attrs"
                    v-on="on"
                  >
                    Add New
                  </v-btn>
                </template>

                <v-card>
                  <v-card-title>
                    <span class="text-h5">Add New Patient</span>
                  </v-card-title>

                  <v-card-text>
                    <v-form ref="form" v-model="valid" lazy-validation>
                      <v-container>
                        <v-row>
                          <v-col cols="12" sm="6" lg="6" md="4">
                            <v-text-field
                              v-model="editedItem.firstName"
                              label="First Name"
                              :rules="nameRules"
                              required
                            />
                          </v-col>

                          <v-col cols="12" sm="6" lg="6" md="4">
                            <v-text-field
                              v-model="editedItem.lastName"
                              :rules="nameRules"
                              label="Last Name"
                            />
                          </v-col>

                          <v-col cols="12" sm="12" md="12">
                            <v-text-field
                              id="autoComplete"
                              v-model="editedItem.address1"
                              placeholder="Patient Address"
                            />
                          </v-col>

                          <v-col cols="12" sm="6" lg="6" md="4">
                            <v-text-field
                              v-model="editedItem.address2"
                              label="Apt #"
                            />
                          </v-col>
                          <v-col cols="12" sm="6" lg="6" md="4">
                            <v-text-field
                              v-model="editedItem.dob"
                              placeholder="mm/dd/yyyy"
                              label="Date of Birth"
                            />
                          </v-col>

                          <v-col cols="12" sm="6" lg="6" md="4">
                            <v-select
                              v-model="editedItem.sex"
                              label="Gender"
                              :items="genders"
                            />
                          </v-col>

                          <v-col cols="12" sm="6" lg="6" md="4">
                            <v-text-field
                              v-model="editedItem.cellPhone"
                              label="Phone"
                            />
                          </v-col>

                          <v-col cols="12" sm="6" lg="6" md="4">
                            <v-select
                              v-model="editedItem.appointmentTime"
                              label="Appointment Time"
                              :items="timeSlots"
                            />
                          </v-col>

                          <v-col cols="12" sm="6" lg="6" md="4">
                            <v-menu
                              ref="editedItem.appointmentDatePicker"
                              v-model="editedItem.appointmentDatePicker"
                              :close-on-content-click="false"
                              transition="scale-transition"
                            >
                              <template v-slot:activator="{ on, attrs }">
                                <v-text-field
                                  v-model="editedItem.appointmentDate"
                                  label="Appointment Date"
                                  v-bind="attrs"
                                  readonly
                                  v-on="on"
                                />
                              </template>
                              <v-date-picker
                                v-model="editedItem.datePickerDate"
                                no-title
                                @change="setFormattedDate(editedItem)"
                                @input="
                                  editedItem.appointmentDatePicker = false
                                "
                              />
                            </v-menu>
                          </v-col>

                          <v-col cols="12" sm="6" lg="6" md="4">
                            <v-select
                              v-model="editedItem.appointmentType"
                              label="Appointment Type"
                              :items="appointmentTypes"
                            />
                          </v-col>

                          <v-col cols="12" sm="6" lg="6" md="4">
                            <v-select
                              v-model="editedItem.appointmentStatus"
                              label="Appointment Status"
                              :items="appStatusOptoins"
                            />
                          </v-col>

                          <v-col cols="12" sm="6" lg="6" md="4">
                            <v-text-field
                              v-model="editedItem.processor"
                              label="Agent"
                            />
                          </v-col>

                          <v-col cols="12" sm="6" lg="6" md="4">
                            <v-select
                              v-model="editedItem.provider"
                              label="Provider"
                              :items="medicalAssistants"
                              item-text="name"
                              item-value="user_id"
                              clearable
                            ></v-select>
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
                      @click="addNewPatientAppointment"
                      :disabled="!valid"
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

        
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script >
import moment from "moment";
import Vue from "vue";

export default Vue.extend({
  data() {
    return {
      valid: false,
      itemsPerPage: 100,
      patientAppointments: [],
      totalPatientAppointments: 0,
      options: {},
      loading: true,
      addDialog: false,
      searchText: "",
      nameRules: [],
      medicalAssistants: [],
      appointmentTypes: [
        {
          text: "Rapid",
          value: "rapid"
        },
        {
          text: "PCR",
          value: "pcr"
        },
        {
          text: "Rapid & PCR",
          value: "rapid&pcr"
        },
        {
          text: "Urgent Care",
          value: "urgentcare"
        }
      ],
      genders: ["Male", "Female"],
      timeSlots: [
        "8am - 10am",
        "10am - 12pm",
        "12pm - 2pm",
        "2pm - 4pm",
        "4pm - 6pm",
        "6pm - 8pm",
        "9am - 11am",
        "11am - 1pm",
        "1pm - 3pm",
        "3pm - 5pm"
        ],
      appStatusOptoins: [
        {
          text: "Scheduled",
          value: "scheduled",
          color: ""
        },
        {
          text: "Confirmed",
          value: "confirmed",
          color: "#ff9800"
        },
        {
          text: "Completed",
          value: "completed",
          color: "#4caf50"
        },
        {
          text: "Cancelled",
          value: "cancelled",
          color: "#f44336"
        },
        {
          text: "Rescheduled",
          value: "rescheduled",
          color: "#5cbbf6"
        }
      ],
      editedItem: {
        createdAt: moment()
          .format("MM/DD/YYYY")
          .toString(),
        firstName: "",
        lastName: "",
        appointmentStatus: "scheduled",
        cellPhone: "",
        address1: "",
        address2: "",
        latitude: "",
        longitude: "",
        dob: "",
        sex: "Male",
        appointmentType: "rapid",
        appointmentDate: moment()
          .format("MM/DD/YYYY")
          .toString(),
        datePickerDate: new Date().toISOString(),
        appointmentTime: "3pm - 5pm",
        processor: "",
        provider: "",
        datePicker: false
      },
      headers: [
        {
          text: "Id",
          value: "id"
        },
        {
          text: "Added",
          value: "createdAt"
        },
        {
          text: "First Name",
          value: "firstName",
          width: 100
        },
        {
          text: "Last Name",
          value: "lastName",
          width: 100
        },
        {
          text: "Gender",
          value: "sex"
        },
        {
          text: "DOB",
          value: "dob"
        },
        {
          text: "Phone",
          value: "cellPhone"
        },
        {
          text: "Address",
          value: "address1",
          width: 180
        },
        {
          text: "Apt #",
          value: "address2"
        },
        {
          text: "Appt Date",
          value: "appointmentDate",
          width: 100
        },
        {
          text: "Appt Window",
          value: "appointmentTime",
          width: 120
        },
        {
          text: "Test Type",
          value: "appointmentType",
          width: 100
        },
        {
          text: "Appt Status",
          value: "appointmentStatus",
          width: 120
        },
        {
          text: "Agent",
          value: "processor",
          width: 120
        },
        {
          text: "Provider",
          value: "provider",
          width: 120
        },
        {
          text: "Notes",
          value: "notes",
          width: 180
        }
      ]
    };
  },
  methods: {
    setFormattedDate(changedItem) {
      changedItem.appointmentDate = this.changeDateFormat(
        changedItem.datePickerDate,
        "YYYY-MM-DD",
        "MM/DD/YYYY"
      );
    },
    async addNewPatientAppointment() {
      this.closeAddDialog();
    },
    closeAddDialog() {
      this.addDialog = false;
    },
    changeDateFormat(date, fromFormat= "YYYY-MM-DD", toFormat= "MM/DD/YYYY") {
      return moment(date, fromFormat)
        .format(toFormat)
        .toString();
    },

    dialogToggle(dialogState) {
      if (dialogState) {
        this.$nextTick(() => {
          this.attachAddressAutoComplete();
        });
      }
    }
  },
});
</script>

<style scoped lang="scss">

</style>
