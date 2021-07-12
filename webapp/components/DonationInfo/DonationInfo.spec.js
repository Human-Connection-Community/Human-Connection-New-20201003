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

  describe('mount', () => {
    beforeEach(() => {
      wrapper = Wrapper()
    })

    it('displays the progress bar', () => {
      expect(wrapper.find('.progress-bar').exists()).toBe(true)
    })

    it('displays the action button', () => {
      expect(wrapper.find('.base-button').text()).toBe('donations.donate-now')
    })

    it('includes a link to the ocelot.social donations website', () => {
      expect(wrapper.find('a').attributes('href')).toBe(
        'https://ocelot-social.herokuapp.com/donations',
      )
    })

    describe('mount with data', () => {
      describe('given german locale', () => {
        beforeEach(() => {
          mocks.$i18n.locale = () => 'de'
        })

        // it looks to me that toLocaleString for some reason is not working as expected
        it.skip('creates a label from the given amounts and a translation string', () => {
          expect(mocks.$t).nthCalledWith(1, 'donations.amount-of-total', {
            amount: '10.000',
            total: '50.000',
          })
        })
      })

      describe('given english locale', () => {
        it('creates a label from the given amounts and a translation string', () => {
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
})
