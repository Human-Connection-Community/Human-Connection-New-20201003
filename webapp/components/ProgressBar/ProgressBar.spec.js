import { shallowMount } from '@vue/test-utils'
import ProgressBar from './ProgressBar'

const localVue = global.localVue

describe('ProgessBar.vue', () => {
  let propsData, slots, wrapper

  beforeEach(() => {
    propsData = {
      goal: 50000,
      progress: 10000,
    }
    slots = {}
  })

  const Wrapper = () => shallowMount(ProgressBar, { localVue, propsData, slots })

  describe('given only goal and progress', () => {
    it('calculates the progress bar width as a percentage of the goal', () => {
      wrapper = Wrapper()
      expect(wrapper.vm.progressBarWidth).toBe('width: 20%;')
    })

    it('renders no label', () => {
      wrapper = Wrapper()
      expect(wrapper.find('.progress-bar__label').exists()).toBe(false)
    })
  })

  describe('given a label', () => {
    beforeEach(() => {
      propsData.label = 'Going well'
    })

    it('renders the label', () => {
      wrapper = Wrapper()
      expect(wrapper.find('.progress-bar__label').text()).toBe('Going well')
    })
  })

  describe('given a fake-button as slot', () => {
    beforeEach(() => {
      slots = {
        default: '<div class="fake-button"></div>',
      }
    })

    it('renders the fake-button', () => {
      wrapper = Wrapper()
      expect(wrapper.find('.fake-button').exists()).toBe(true)
    })
  })
})
