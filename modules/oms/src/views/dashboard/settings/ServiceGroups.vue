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
            <v-col sm="6" md="2" lg="6" xl="1">
              <v-btn color="primary" width="120px"> Add </v-btn>
            </v-col>
          </v-row>
        </template>

        <template v-slot:[`item.actions`]>
          <v-btn depressed class="mr-2" color="primary"> Update </v-btn>
          <v-btn depressed color="error"> Delete </v-btn>
        </template>
      </v-data-table>
    </v-card>
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
        {
          text: "Actions",
          value: "actions",
          align: "center",
          width: "240px",
          sortable: false,
        },
      ],
      serviceGroupList: [],
      isLoading: false,
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
        this.$root.snackbar.show({
          message: "Failed to get service zip codes list",
          type: "error",
        });
        console.error(error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
</script>
