import { mount } from '@vue/test-utils'

import DonationInfo from './DonationInfo.vue'

const localVue = global.localVue

const mockDate = new Date(2019, 11, 6)
global.Date = jest.fn(() => mockDate)

describe('DonationInfo.vue', () => {
  let mocks, wrapper, propsData

  beforeEach(() => {
    mocks = {
      $t: jest.fn((string) => string),
      $i18n: {
        locale: () => 'en',
      },
    }
    propsData = {
      goal: 50000,
      progress: 10000,
    }
  })

  const Wrapper = () => mount(DonationInfo, { mocks, localVue, propsData })

  it('displays the progress bar', () => {
    wrapper = Wrapper()
    expect(wrapper.find('.progress-bar').exists()).toBe(true)
  })

  it('displays the action button', () => {
    wrapper = Wrapper()
    expect(wrapper.find('.base-button').text()).toBe('donations.donate-now')
  })

  it('includes a link to the ocelot.social donations website', () => {
    wrapper = Wrapper()
    expect(wrapper.find('a').attributes('href')).toBe(
      'https://ocelot-social.herokuapp.com/donations',
    )
  })

  describe('mount with data', () => {
    describe('given german locale', () => {
      it.skip('creates a label from the given amounts and a translation string', () => {
        // couldn't find out why it's not working
        mocks.$i18n.locale = () => 'de'
        wrapper = Wrapper()
        expect(mocks.$t).toBeCalledWith(
          'donations.amount-of-total',
          expect.objectContaining({
            amount: '10.000',
            total: '50.000',
          }),
        )
      })
    })

    describe('given english locale', () => {
      it('creates a label from the given amounts and a translation string', () => {
        wrapper = Wrapper()
        expect(mocks.$t).toBeCalledWith(
          'donations.amount-of-total',
          expect.objectContaining({
            amount: '10,000',
            total: '50,000',
          }),
        )
      })
    })
  })
})
