<template>

  <div class="max-w-screen-lg mx-auto py-14 gap sm:gap-y-10">
    <h2 class="pb-2">Upcoming Visits</h2>
    <p class="pb-6">To update visit information please cancel and book a new one.</p>
    <t-table v-if="visitList.length > 0" :headers="headerItems" :data="visitList">
      <template slot="row" slot-scope="props">
        <tr :class="[props.trClass, props.rowIndex % 2 === 0 ? 'bg-gray-100' : '']">
          <td :class="props.tdClass">
            {{ props.row.date | dateFormat }}
          </td>
          <td :class="props.tdClass">
            {{ props.row.scheduledStartTime | timeFormat }} to {{ props.row.scheduledEndTime | timeFormat }}
          </td>
          <td :class="props.tdClass">
            {{ props.row.service.name }}
          </td>
          <td :class="props.tdClass">
            {{ getProviderName(props.row.provider) }}
          </td>
          <td :class="props.tdClass">
            {{ getAddress(props.row.address) }}
          </td>
          <td :class="props.tdClass">
            {{ props.row.status }}
          </td>
          <td :class="props.tdClass">
            <t-button variant="error" :class="{'disabled': props.row.status === 'canceled'}" @click="openCancelModal(props.row.id)">Cancel</t-button>
          </td>
        </tr>
      </template>
    </t-table>
    <t-modal header="Cancel Visit" v-model="cancelModal">
      Are you sure to cancel this visit?
      <template v-slot:footer>
        <div class="flex justify-end">
          <t-button type="button" @click="closeCancelModal" variant="link"> Close </t-button>
          <t-button type="button" @click="cancelVisits"> Ok </t-button>
        </div>
      </template>
    </t-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import OMSApi from '../../api/OMSApi'
import moment from 'moment'

export default Vue.extend({
  data () {
    return {
      headerItems: [
        { value: 'date', text: 'Date' },
        { value: 'time', text: 'Time' },
        { value: 'serviceName', text: 'Service Name' },
        { value: 'providerName', text: 'Provider Name' },
        { value: 'address', text: 'Address' },
        { value: 'status', text: 'Status' },
        { value: 'action', text: 'Action' }
      ],
      listParams: {
        service: null,
        provider: null,
        status: null,
        search: null
      },
      visitList: [],
      userDetails: {
        id: 0
      },
      selectedVisitId: 0,
      cancelModal: false
    }
  },
  created () {
    this.$auth.getUser().then((userData: any) => {
      if (userData) {
        this.getUserDetails(userData.sub)
      }
    })
  },
  methods: {
    async getVisits () {
      try {
        const api = new OMSApi()
        const params = {
          page: 1,
          limit: 20,
          status: 'booked',
          sortOrder: 'ASC',
          patient: this.userDetails.id
        }
        const res = await api.getVisits(params)
        if (res.result) {
          this.visitList = res.result.data
        }
      } catch (error) {
        console.error(error)
      } finally {}
    },
    async cancelVisits () {
      try {
        const api = new OMSApi()
        const res = await api.cancelVisit(this.selectedVisitId)
        if (res) {
          this.visitList = this.visitList.filter((a: any) => a.id !== this.selectedVisitId)
        }
      } catch (error) {
        console.error(error)
      } finally {
        this.cancelModal = false
      }
    },
    async getUserDetails (authID: string) {
      try {
        const api = new OMSApi()
        const params = {
          authID: authID
        }
        const res = await api.getUserDetails(params)
        if (res.result) {
          this.userDetails = res.result
          this.getVisits()
        }
      } catch (error) {
        console.error(error)
      }
    },
    getProviderName (provider: any) {
      return provider ? provider.firstName + ' ' + provider.lastName : ''
    },
    getAddress (address: any) {
      return address ? address.street + ', ' + address.city + ', ' + address.state : ''
    },
    openCancelModal (id: number) {
      this.selectedVisitId = id
      this.cancelModal = true
    },
    closeCancelModal () {
      this.selectedVisitId = 0
      this.cancelModal = false
    }
  },
  computed: {
  },
  filters: {
    timeFormat (time: string) {
      return moment(time, 'HH:mm:ss').format('h:mm A')
    },
    dateFormat (date: string) {
      return moment(date).format('dddd, MMMM d, YYYY')
    }
  }
})
</script>

<style scoped>
.disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
