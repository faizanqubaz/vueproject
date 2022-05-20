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
                    <v-col
                      v-if="
                        hover &&
                        visitDetails.status != 'canceled' &&
                        visitDetails.status != 'completed'
                      "
                    >
                      <div class="text-right">
                        <v-btn
                          color="secondary"
                          @click="patientDialog = true"
                          depressed
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
      <v-dialog v-model="patientDialog" max-width="800px" scrollable>
        <v-card>
          <v-card-title class="pa-0">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Edit Patient</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="patientDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
          </v-card-title>
          <v-card-text>
            <!-- profile -->
            <v-card-title>
              <v-row>
                <v-col>
                  <span class="primary--text">Profile</span>
                </v-col>
                <v-col>
                  <div class="text-right">
                    <v-btn
                      @click="updatePatient"
                      depressed
                      color="primary"
                      :disabled="!isEditPatientFormValid"
                      :loading="isUpdatePatient"
                    >
                      Save
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-form
                ref="updatePatientForm"
                v-model="isEditPatientFormValid"
                lazy-validation
              >
                <v-row>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="patientForm.firstName"
                      placeholder="First Name"
                      label="First Name"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="patientForm.middleName"
                      placeholder="Middle Name"
                      label="Middle Name"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="patientForm.lastName"
                      placeholder="Last Name"
                      label="Last Name"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-menu
                      v-model="datePicker"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="patientForm.dob"
                          label="Date of Birth"
                          hint="MM/DD/YYYY"
                          persistent-hint
                          v-bind="attrs"
                          @blur="
                            (date = parseDate(patientForm.dob)),
                              (datePicker = false)
                          "
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        v-model="date"
                        no-title
                        @input="datePicker = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      v-model="patientForm.gender"
                      :items="genderList"
                      label="Gender"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="patientForm.phone"
                      placeholder="Phone Number"
                      :rules="phoneRules"
                      label="Phone"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="patientForm.email"
                      placeholder="Email"
                      label="Email"
                      required
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <!-- end profile -->
            <v-divider></v-divider>
            <!-- address -->
            <v-card-title>
              <v-row>
                <v-col>
                  <span class="primary--text">Address</span>
                </v-col>
                <v-col>
                  <div class="text-right">
                    <v-btn
                      depressed
                      color="primary"
                      @click="updateAddress"
                      :loading="isUpdatePatient"
                    >
                      Save
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-form
                ref="updatePatientForm"
                v-model="isEditPatientFormValid"
                lazy-validation
              >
                <v-row>
                  <v-col cols="12">
                    <vuetify-google-autocomplete
                      ref="patientEditAddress"
                      id="patientEditMap"
                      classname="form-control"
                      placeholder="Address"
                      v-on:placechanged="getNewAddressData"
                      country="us"
                      :value="patientAddress.address"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="9">
                    <v-text-field
                      v-model="patientAddress.apartment"
                      placeholder="Apartment"
                      label="Apartment"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="3">
                    <v-switch
                      v-model="patientAddress.primary"
                      label="Primary"
                      color="success"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
            <!-- end addres -->
            <v-divider></v-divider>
            <!-- Notes -->
            <v-card-title>
              <v-row>
                <v-col>
                  <span class="primary--text">Notes</span>
                </v-col>
                <v-col>
                  <div class="text-right">
                    <v-btn
                      depressed
                      color="primary"
                      :loading="isUpdatePatient"
                      v-if="patientNote"
                      @click="saveNote"
                    >
                      Save
                    </v-btn>
                    <v-btn v-else color="primary" @click="createNote"
                      >+ Add Notes</v-btn
                    >
                  </div>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-form
                ref="updatePatientForm"
                v-model="isEditPatientFormValid"
                lazy-validation
                v-if="patientNote"
              >
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="patientNoteData.memo"
                      placeholder="Notes"
                      label="Notes"
                      required
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card-text>
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
                    <v-col
                      v-if="
                        hover &&
                        visitDetails.status != 'canceled' &&
                        visitDetails.status != 'completed'
                      "
                    >
                      <div class="text-right">
                        <v-btn
                          color="secondary"
                          @click="visitDialog = true"
                          depressed
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
                        <v-col cols="5" class="pb-0">Payment</v-col>
                        <v-col cols="7" class="pb-0">
                          <v-row>
                            <v-col class="pr-0" cols="1">:</v-col>
                            <v-col class="pl-0" cols="10">
                              ${{ visitDetails.payment }}
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
                                  ? setTimeZone(visitDetails.startTime)
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
                                  ? setTimeZone(visitDetails.checkInTime)
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
                                  ? setTimeZone(visitDetails.checkOutTime)
                                  : "--"
                              }}
                            </v-col>
                          </v-row>
                        </v-col>
                        <v-col cols="12" class="pb-0 pt-0">
                          <v-switch
                            v-model="timeZoneSwitch"
                            label="Local Time Zone"
                            color="success"
                          />
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
      <v-dialog v-model="visitDialog" max-width="800px" scrollable>
        <v-card>
          <v-card-title class="pa-0">
            <v-toolbar dark color="primary">
              <v-toolbar-title>Edit Visit</v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon @click="visitDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>
          </v-card-title>
          <v-card-text>
            <v-card-title>
              <v-row>
                <v-col>
                  <span class="primary--text">Visit</span>
                </v-col>
                <v-col>
                  <div class="text-right">
                    <v-btn
                      @click="updateVisit"
                      depressed
                      color="primary"
                      :disabled="!isEditPatientFormValid"
                      :loading="isUpdatePatient"
                    >
                      Save
                    </v-btn>
                  </div>
                </v-col>
              </v-row>
            </v-card-title>
            <v-card-text>
              <v-form
                ref="updatePatientForm"
                v-model="isEditPatientFormValid"
                lazy-validation
              >
                <v-row>
                  <v-col cols="12" md="4">
                    <v-menu
                      v-model="datePickerVisit"
                      :close-on-content-click="false"
                      :nudge-right="40"
                      transition="scale-transition"
                      offset-y
                      max-width="290px"
                      min-width="290px"
                    >
                      <template v-slot:activator="{ on, attrs }">
                        <v-text-field
                          v-model="visitForm.date"
                          label="Date"
                          hint="MM/DD/YYYY"
                          persistent-hint
                          v-bind="attrs"
                          @blur="
                            (dateVisit = parseDate(patientForm.dob)),
                              (datePickerVisit = false)
                          "
                          v-on="on"
                        />
                      </template>
                      <v-date-picker
                        v-model="dateVisit"
                        no-title
                        @input="datePickerVisit = false"
                      ></v-date-picker>
                    </v-menu>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="visitForm.scheduledStartTime"
                      :placeholder="'Scheduled Start Time'"
                      label="Scheduled Start Time"
                      type="time"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      v-model="visitForm.service"
                      :items="serviceList"
                      item-text="name"
                      label="Service"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="visitForm.price"
                      append-outer-icon="mdi-currency-usd"
                      placeholder="Service Price"
                      label="Service Price"
                      required
                      readonly
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="visitForm.payment"
                      append-outer-icon="mdi-currency-usd"
                      placeholder="Payment"
                      label="Payment"
                      type="number"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-autocomplete
                      v-model="visitForm.status"
                      :items="statusData"
                      label="Status"
                      item-text="label"
                      item-value="value"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="visitForm.startTime"
                      :placeholder="'Start Time'"
                      label="Start Time"
                      type="datetime-local"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="visitForm.checkInTime"
                      :placeholder="'Check In Time'"
                      label="Check In Time"
                      type="datetime-local"
                      required
                    />
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-text-field
                      v-model="visitForm.checkOutTime"
                      :placeholder="'Check Out Time'"
                      label="Check Out Time"
                      type="datetime-local"
                      required
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>
          </v-card-text>
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
                    <v-col
                      v-if="
                        hover &&
                        visitDetails.status != 'canceled' &&
                        visitDetails.status != 'completed'
                      "
                    >
                      <div class="text-right">
                        <v-btn
                          :color="
                            visitDetails.provider ? 'secondary' : 'primaryzzzzz'
                          "
                          @click="providerDialog = true"
                          depressed
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
import "moment-timezone";
import phone from "phone";
import email from "email-validator";
import VuetifyGoogleAutocomplete from "vuetify-google-autocomplete";
import { States, VisitStatuses } from "@/utils";

Vue.use(VuetifyGoogleAutocomplete, {
  apiKey: process.env.VUE_APP_WELZ_OMS_GOOGLE_AUTH_KEY,
  version: process.env.VUE_APP_WELZ_OMS_GOOGLE_AUTH_VERSION,
});

export default Vue.extend({
  async created() {
    this.$router.currentRoute.params.id
      ? await this.getVisitDetails(this.$router.currentRoute.params.id)
      : this.$router.push("/");
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
      isEditPatientFormValid: false,
      isUpdatePatient: false,
      snackbar: {
        message: null,
        active: false,
      },
      genderList: ["male", "female"],
      phoneRules: [
        (phoneNumber) => !!phoneNumber || "Phone number is required",
        (phoneNumber) =>
          (phoneNumber && phone(phoneNumber, { country: "USA" }).isValid) ||
          "Phone number is invalid",
      ],
      emailRules: [
        (emailAddress) => !!emailAddress || "Email is required",
        (emailAddress) =>
          (emailAddress && email.validate(emailAddress)) ||
          "Email address is invalid",
      ],
      patientForm: {
        firstName: null,
        middleName: null,
        lastName: null,
        dob: null,
        gender: null,
        phone: null,
        email: null,
      },
      patientFormId: null,
      patientAddress: {
        address: null,
        apartment: null,
        primary: false,
      },
      patientAddressId: null,
      patientNoteData: {
        id: null,
        memo: null,
      },
      patientNote: false,
      datePicker: false,
      datePickerVisit: false,
      date: null,
      dateVisit: null,
      visitForm: {
        date: null,
        scheduledStartTime: null,
        scheduledEndTime: null,
        serviceId: null,
        service: null,
        price: null,
        payment: null,
        status: null,
        startTime: null,
        checkInTime: null,
        checkOutTime: null,
      },
      serviceList: null,
      statusData: VisitStatuses,
      maxDate: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .substr(0, 10),
      newAddress: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        primary: false,
        longitude: 0,
        latitude: 0,
      },
      timeZoneAddress: null,
      timeZone: null,
      timeZoneSwitch: false,
    };
  },
  watch: {
    date() {
      this.patientForm.dob = this.formatDate(this.date);
    },
    patientDialog(val) {
      if (!val && !this.patientNoteData.memo && !this.patientNoteData.id) {
        this.patientNote = false;
      }
    },
    "visitForm.service"(val) {
      if (this.serviceList) {
        let serice = this.serviceList.filter((res) => {
          return res.name === val;
        });
        this.visitForm.price = serice[0].price;
        this.visitForm.serviceId = serice[0].id;
      }
    },
    timeZoneSwitch(val) {
      if (val && this.timeZone.length > 0) {
        this.timeZone[0].timeZone = moment.tz.guess();
      } else {
        this.timeZone[0].timeZone = this.timeZoneAddress;
      }
      this.setEditVisit();
    },
  },
  methods: {
    async getVisitDetails(id) {
      this.loading = true;
      try {
        const api = new OMSApi();
        const res = await api.getVisitDetails(id);
        if (res) {
          this.visitDetails = res.result;
          this.timeZone = States.filter((res) => {
            return (
              res.code == this.visitDetails.address.state ||
              res.name == this.visitDetails.address.state
            );
          });
          this.timeZoneAddress = this.timeZone[0].timeZone;
          this.setEditPatient();
          this.setEditVisit();
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to get visit details",
          type: "error",
        });
      } finally {
        this.loading = false;
      }
    },
    async cancelVisits(id) {
      this.cancelLoading = true;
      try {
        const api = new OMSApi();
        const res = await api.cancelVisit(id);
        if (res) {
          this.getVisitDetails(id);
          this.$root.snackbar.show({
            message: "Visit canceled",
            type: "success",
          });
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to cancel visit",
          type: "error",
        });
      } finally {
        this.cancelDialog = false;
        this.cancelLoading = false;
      }
    },
    setEditPatient() {
      this.patientForm.firstName = this.visitDetails.patient.firstName;
      this.patientForm.lastName = this.visitDetails.patient.lastName;
      this.patientForm.middleName = this.visitDetails.patient.middleName;
      this.patientForm.dob = this.formatDate(this.visitDetails.patient.dob);
      this.patientForm.gender = this.visitDetails.patient.gender;
      this.patientForm.phone = this.visitDetails.patient.phone;
      this.patientForm.email = this.visitDetails.patient.email;
      this.patientFormId = this.visitDetails.patient.id;
      this.patientAddress.address = this.addressFormat(
        this.visitDetails.address.street,
        this.visitDetails.address.city,
        this.visitDetails.address.state,
        this.visitDetails.address.zipCode
      );
      this.patientAddress.apartment = this.visitDetails.address.apartment;
      this.patientAddress.primary = this.visitDetails.address.primary;
      this.patientAddressId = this.visitDetails.address.id;
      this.newAddress.street = this.visitDetails.address.street;
      this.newAddress.city = this.visitDetails.address.city;
      this.newAddress.state = this.visitDetails.address.state;
      this.newAddress.zipCode = this.visitDetails.address.zipCode;
      this.newAddress.longitude = this.visitDetails.address.longitude;
      this.newAddress.latitude = this.visitDetails.address.latitude;
      this.patientNoteData = this.visitDetails.patientNote;
      if (this.patientNoteData && this.patientNoteData.id) {
        this.patientNote = true;
      }
    },
    setEditVisit() {
      this.visitForm.date = this.dateFormat(this.visitDetails.date);
      this.visitForm.scheduledStartTime = this.visitDetails.scheduledStartTime;
      this.visitForm.scheduledEndTime = this.visitDetails.scheduledEndTime;
      this.visitForm.service = this.visitDetails.service.name;
      this.visitForm.serviceId = this.visitDetails.service.id;
      this.visitForm.price = this.visitDetails.service.price;
      this.visitForm.payment = this.visitDetails.payment;
      this.visitForm.status = this.visitDetails.status;
      this.visitForm.startTime = this.visitDetails.startTime
        ? this.formatTimeZoneForEdit(this.visitDetails.startTime)
        : this.visitDetails.startTime;
      this.visitForm.checkInTime = this.visitDetails.checkInTime
        ? this.formatTimeZoneForEdit(this.visitDetails.checkInTime)
        : this.visitDetails.checkInTime;
      this.visitForm.checkOutTime = this.visitDetails.checkOutTime
        ? this.formatTimeZoneForEdit(this.visitDetails.checkOutTime)
        : this.visitDetails.checkOutTime;
    },
    setTimeZone(date) {
      let myDatetimeString;
      this.timeZone.length > 0
        ? (myDatetimeString = moment(date)
            .tz(this.timeZone[0].timeZone)
            .format("MM/DD/YYYY hh:mm A z"))
        : (myDatetimeString = moment(date).format("MM/DD/YYYY hh:mm A"));

      return myDatetimeString;
    },
    formatTimeZoneForEdit(date) {
      let myDatetimeString;
      this.timeZone.length > 0
        ? (myDatetimeString = moment(date)
            .tz(this.timeZone[0].timeZone)
            .format("YYYY-MM-DDThh:mm"))
        : (myDatetimeString = moment(date).format("YYYY-MM-DDThh:mm"));

      return myDatetimeString;
    },
    async updatePatient() {
      this.isUpdatePatient = true;
      const patientForm = {
        ...this.patientForm,
        dob: this.parseDate(this.patientForm.dob),
      };
      try {
        const api = new OMSApi();
        const res = await api.updatetPatients(this.patientFormId, patientForm);
        if (res) {
          this.getVisitDetails(this.$router.currentRoute.params.id);
          this.$root.snackbar.show({
            message: "Patient updated",
            type: "success",
          });
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to update patient",
          type: "error",
        });
      } finally {
        this.isUpdatePatient = false;
      }
    },
    async updateAddress() {
      this.isUpdatePatient = true;
      try {
        const api = new OMSApi();
        const address = {
          street: this.newAddress.street,
          apartment: this.patientAddress.apartment,
          city: this.newAddress.city,
          state: this.newAddress.state,
          zipCode: this.newAddress.zipCode,
          primary: this.patientAddress.primary,
          longitude: this.newAddress.longitude,
          latitude: this.newAddress.latitude,
        };
        const response = await api.updateAddress(
          this.patientAddressId,
          address
        );
        if (response) {
          this.getVisitDetails(this.$router.currentRoute.params.id);
          this.$root.snackbar.show({
            message: "Address updated",
            type: "success",
          });
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to update Address",
          type: "error",
        });
      } finally {
        this.isUpdatePatient = false;
      }
    },
    async updateVisit() {
      this.isUpdatePatient = true;
      try {
        const api = new OMSApi();
        const params = {
          checkInTime: this.visitForm.checkInTime
            ? this.timeZone.length > 0
              ? moment
                  .tz(this.visitForm.checkInTime, this.timeZone[0].timeZone)
                  .utc()
                  .format()
              : moment(this.visitForm.checkInTime).format()
            : null,
          checkOutTime: this.visitForm.checkOutTime
            ? this.timeZone.length > 0
              ? moment
                  .tz(this.visitForm.checkOutTime, this.timeZone[0].timeZone)
                  .utc()
                  .format()
              : moment(this.visitForm.checkOutTime).format()
            : null,
          date: moment(this.visitForm.date).format("YYYY-MM-DD"),
          payment: parseFloat(this.visitForm.payment),
          serviceId: this.visitForm.serviceId,
          scheduledEndTime: this.visitForm.scheduledEndTime,
          scheduledStartTime:
            this.visitForm.scheduledStartTime.split(":").length !== 3
              ? this.visitForm.scheduledStartTime + ":00"
              : this.visitForm.scheduledStartTime,
          startTime: this.visitForm.startTime
            ? this.timeZone.length > 0
              ? moment
                  .tz(this.visitForm.startTime, this.timeZone[0].timeZone)
                  .utc()
                  .format()
              : moment(this.visitForm.startTime).format()
            : null,
          status: this.visitForm.status,
        };
        const response = await api.updateVisit(this.visitDetails.id, params);
        if (response) {
          this.getVisitDetails(this.$router.currentRoute.params.id);
          this.$root.snackbar.show({
            message: "Visit updated",
            type: "success",
          });
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to update Visit",
          type: "error",
        });
      } finally {
        this.isUpdatePatient = false;
      }
    },
    async saveNote() {
      this.isUpdatePatient = true;
      try {
        const api = new OMSApi();
        if (this.patientNoteData.id) {
          const response = await api.updateNote(
            this.patientNoteData.id,
            this.patientNoteData.memo
          );
          if (response) {
            this.getVisitDetails(this.$router.currentRoute.params.id);
            this.$root.snackbar.show({
              message: "Note Updated",
              type: "success",
            });
          }
        } else {
          const params = {
            visitId: this.visitDetails.id,
            patientId: this.visitDetails.patient.id,
            memo: this.patientNoteData.memo,
          };
          const response = await api.addNote(params);
          if (response) {
            this.getVisitDetails(this.$router.currentRoute.params.id);
            this.$root.snackbar.show({
              message: "Note Saved",
              type: "success",
            });
          }
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to save note",
          type: "error",
        });
      } finally {
        this.isUpdatePatient = false;
      }
    },
    getNewAddressData(addressData, placeResultData) {
      this.newAddress.street = addressData.name;
      this.newAddress.city = placeResultData.formatted_address.split(",")[1];
      this.newAddress.state = addressData.administrative_area_level_1;
      this.newAddress.zipCode = addressData.postal_code;
      this.newAddress.longitude = addressData.longitude;
      this.newAddress.latitude = addressData.latitude;
    },
    createNote() {
      this.patientNoteData = { id: null, memo: "" };
      this.patientNote = true;
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
    dateTimeFormat(date) {
      return moment(date).format("YYYY-DD-MM hh:mm");
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
    formatDate(date) {
      if (!date) return null;

      const [year, month, day] = date.split("-");
      return `${month}/${day}/${year}`;
    },
    parseDate(date) {
      if (!date) return null;
      const [month, day, year] = date.split("/");
      return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
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
