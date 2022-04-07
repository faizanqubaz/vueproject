<template>
  <v-navigation-drawer
    id="core-navigation-drawer"
    v-model="drawer"
    :dark="barColor !== 'rgba(228, 226, 226, 1), rgba(255, 255, 255, 0.7)'"
    :right="$vuetify.rtl"
    :src="barImage"
    mobile-breakpoint="960"
    app
    mini-variant-width="80"
    width="260"
    v-bind="$attrs"
  >
    <!-- <template v-slot:img="props">
      <v-img :gradient="`to bottom, ${barColor}`" v-bind="props" />
    </template> -->

    <v-list-item two-line>
      <v-list-item-content>
        <v-list-item-title class="font-weight-regular">
          <span class="logo-mini">OMS</span>
        </v-list-item-title>
      </v-list-item-content>
    </v-list-item>

    <v-divider class="mb-1" />

    <v-list dense nav>
      <base-item-group :item="profile" />
    </v-list>

    <v-divider class="mb-2" />

    <v-list expand nav>
      <template v-for="(item, i) in computedItems">
        <base-item-group v-if="item.children" :key="`group-${i}`" :item="item">
        </base-item-group>

        <base-item v-else :key="`item-${i}`" :item="item" />
      </template>
      <template v-for="(item, i) in computedResources">
        <base-item-group v-if="item.children" :key="`group-${i}`" :item="item">
        </base-item-group>

        <base-item v-else :key="`item-${i}`" :item="item" />
      </template>
    </v-list>

    <v-list expand nav> </v-list>
  </v-navigation-drawer>
</template>

<script>
// Utilities
import { mapState } from "vuex";
import { includes } from "lodash";
import baseItemGroup from "@/components/base/itemGroup";
import baseItem from "@/components/base/Item";
import Vue from "vue";

export default Vue.extend({
  name: "DashboardCoreDrawer",
  components: {
    baseItemGroup,
    baseItem,
  },

  props: {
    expandOnHover: {
      type: Boolean,
      default: true,
    },
  },

  data: () => ({
    items: [
      {
        icon: "mdi-view-dashboard",
        title: "Dashboard",
        to: "/",
      },
      // {
      //   icon: "mdi-calendar",
      //   title: "Schedule",
      //   to: "/schedule/cities",
      //   role: "admin"
      // },
      // {
      //   icon: "mdi-account-group",
      //   title: "Providers",
      //   to: "/schedule/providers",
      //   role: "admin"
      // },
    ],
    resources: [
      {
        icon: "mdi-view-dashboard",
        title: "Resources",
        group: "/resources",
        children: [
          {
            to: "service-groups",
            title: "Service Groups",
          },
          {
            to: "",
            title: "Providers",
          },
          {
            to: "",
            title: "Guardians",
          },
          {
            to: "",
            title: "Patients",
          },
          {
            to: "",
            title: "Visits",
          },
          {
            to: "services",
            title: "Services",
          },
          {
            to: "cities",
            title: "Cities",
          },
          {
            to: "",
            title: "Notes",
          },
          {
            to: "",
            title: "Addresses",
          },
          {
            to: "service-zip-codes",
            title: "Service Zip Codes",
          },
          {
            to: "",
            title: "Service Time Slots",
          },
          {
            to: "",
            title: "Rendered Services",
          },
        ],
      },
    ],
  }),

  computed: {
    ...mapState(["barColor", "barImage"]),
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        this.$store.commit("SET_DRAWER", val);
      },
    },
    computedItems() {
      return this.items.filter(this.filterItem).map(this.mapItem);
    },
    computedResources() {
      return this.resources.filter(this.filterItem).map(this.mapItem);
    },
    profile() {
      return {
        avatar: true,
        group: "",
        title: "Danu",
        picture: "",
        children: [
          {
            href: "",
            title: "My Profile",
          },
          {
            to: "",
            title: "Edit Profile",
          },
          {
            to: "",
            title: "Settings",
          },
        ],
      };
    },
  },

  watch: {
    "$vuetify.breakpoint.smAndDown"(val) {
      this.$emit("update:expandOnHover", !val);
    },
  },

  methods: {
    filterItem(item) {
      return !(
        item.role &&
        !includes(this.$auth.user["http://oms.welz.com/roles"], item.role)
      );
    },
    mapItem(item) {
      return {
        ...item,
        children: item.children ? item.children.map(this.mapItem) : undefined,
        title: item.title,
      };
    },
  },
});
</script>

<style lang="sass">
@import '~vuetify/src/styles/tools/_rtl.sass'

#core-navigation-drawer
  &.v-navigation-drawer--mini-variant
    .v-list-item
      justify-content: flex-start !important

    .v-list-group--sub-group
      display: block !important

  .v-list-group__header.v-list-item--active:before
    opacity: .24

  .v-list-item
    &__icon--text,
    &__icon:first-child
      justify-content: center
      text-align: center
      width: 20px

      +ltr()
        margin-right: 24px
        margin-left: 12px !important

      +rtl()
        margin-left: 24px
        margin-right: 12px !important

  .v-list--dense
    .v-list-item
      &__icon--text,
      &__icon:first-child
        margin-top: 10px

  .v-list-group--sub-group
    .v-list-item
      +ltr()
        padding-left: 8px

      +rtl()
        padding-right: 8px

    .v-list-group__header
      +ltr()
        padding-right: 0

      +rtl()
        padding-right: 0

      .v-list-item__icon--text
        margin-top: 19px
        order: 0

      .v-list-group__header__prepend-icon
        order: 2

        +ltr()
          margin-right: 8px

        +rtl()
          margin-left: 8px
</style>
