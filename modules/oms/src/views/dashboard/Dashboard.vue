<template>
  <v-container fluid>
    <v-row>
      <v-col
        cols="12"
        sm="6"
        md="3"
        v-for="stat in cardStats"
        :key="stat.title"
      >
        <v-card>
          <v-card-text>
            <v-flex class="d-flex">
              <v-icon class="mr-2" size="40">{{ stat.icon }}</v-icon>
              <div class="flex-grow-1">
                <p class="mb-0 subtitle-1">{{ stat.title }}</p>
                <v-skeleton-loader
                  v-if="isLoading[stat.id]"
                  type="text"
                  width="40%"
                  class="py-2"
                />
                <p v-else class="mb-0 text-h5 font-weight-bold">
                  {{ visitCount[stat.id] }}
                  <span class="body-1 font-weight-regular">visits</span>
                </p>
              </div>
            </v-flex>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Vue from "vue";
import OMSApi from "@/api/OMSApi";

export default Vue.extend({
  data() {
    return {
      cardStats: [
        { id: "total", title: "Total", icon: "mdi-calendar-multiple" },
        { id: "booked", title: "Booked", icon: "mdi-calendar-start" },
        { id: "completed", title: "Completed", icon: "mdi-calendar-check" },
        { id: "canceled", title: "Canceled", icon: "mdi-calendar-remove" },
      ],
      visitCount: {
        total: "-",
        booked: "-",
        completed: "-",
        canceled: "-",
      },
      isLoading: {
        total: false,
        booked: false,
        completed: false,
        canceled: false,
      },
    };
  },
  async created() {
    this.$store.commit("SET_LOADING", true);
    Promise.all(
      ["total", "booked", "completed", "canceled"].map(
        async (get) => await this.getVisitCount(get)
      )
    ).then(() => {
      this.$store.commit("SET_LOADING", false);
    });
  },
  methods: {
    async getVisitCount(status) {
      try {
        this.isLoading[status] = true;
        const api = new OMSApi();
        const params = {
          status: status !== "total" ? status : "",
        };
        const response = await api.getVisitCount(params);
        if (response.result) {
          this.visitCount[status] = response.result.count;
        }
      } catch (error) {
        this.$root.snackbar.show({
          message: "Failed to get visit count",
          type: "error",
        });
        console.error(error);
      } finally {
        this.isLoading[status] = false;
      }
    },
  },
});
</script>
