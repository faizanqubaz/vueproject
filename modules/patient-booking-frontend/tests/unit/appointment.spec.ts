import { shallowMount } from '@vue/test-utils'
import Appointment from '@/views/Appointment.vue'

describe('Appointment.vue', () => {
  it('renders props.msg when passed', () => {
    const wrapper = shallowMount(Appointment, {
      data () {
        return {
          location: {
            address: '',
            apartment: ''
          }
        }
      }
    })
    expect(wrapper.name()).toBe('Appointment')
  })
})
