<template>
  <v-container fluid>
    <v-card>
      <v-data-table
        :headers="headers"
        :items="serviceGroupList"
        :loading="isLoading"
        loading-text="Loading Service Groups..."
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
              <v-btn block color="primary" dark v-bind="attrs" v-on="on">
                Add Service Group
              </v-btn>
            </v-col>
          </v-row>
        </template>

        <template v-slot:[`item.actions`]>
          <v-btn depressed class="mr-2" color="secondary"> Update </v-btn>
          <v-btn depressed color="error"> Delete </v-btn>
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
        { text: "Actions", value: "actions", align: "center", width: "240px" },
      ],
      serviceGroupList: [],
      isLoading: false,
      snackbar: {
        message: null,
        active: false,
      },
    };
  },
  created() {
    this.getServiceGroups();
  },
  methods: {
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
  },
});
</script>
