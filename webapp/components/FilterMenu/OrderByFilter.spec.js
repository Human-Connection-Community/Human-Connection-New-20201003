import { mount } from '@vue/test-utils'
import Vuex from 'vuex'
import OrderByFilter from './OrderByFilter'

const localVue = global.localVue

let wrapper

describe('OrderByFilter', () => {
  const mutations = {
    'posts/TOGGLE_ORDER': jest.fn(),
  }
  const getters = {
    'posts/orderBy': () => 'createdAt_desc',
  }

  const mocks = {
    $t: jest.fn((string) => string),
  }

  const Wrapper = () => {
    const store = new Vuex.Store({ mutations, getters })
    const wrapper = mount(OrderByFilter, { mocks, localVue, store })
    return wrapper
  }

  beforeEach(() => {
    wrapper = Wrapper()
  })

  describe('mount', () => {
    describe('if ordered by newest', () => {
      it('sets "newest-button" attribute `filled`', () => {
        expect(
          wrapper
            .find('.order-by-filter .filter-list [data-test="newest-button"] .base-button')
            .classes('--filled'),
        ).toBe(true)
      })

      it('don\'t sets "oldest-button" attribute `filled`', () => {
        expect(
          wrapper
            .find('.order-by-filter .filter-list [data-test="oldest-button"] .base-button')
            .classes('--filled'),
        ).toBe(false)
      })
    })

    describe('if ordered by oldest', () => {
      beforeEach(() => {
        getters['posts/orderBy'] = jest.fn(() => 'createdAt_asc')
        wrapper = Wrapper()
      })

      it('don\'t sets "newest-button" attribute `filled`', () => {
        expect(
          wrapper
            .find('.order-by-filter .filter-list [data-test="newest-button"] .base-button')
            .classes('--filled'),
        ).toBe(false)
      })

      it('sets "oldest-button" attribute `filled`', () => {
        expect(
          wrapper
            .find('.order-by-filter .filter-list [data-test="oldest-button"] .base-button')
            .classes('--filled'),
        ).toBe(true)
      })
    })

    describe('click "newest-button"', () => {
      it('calls TOGGLE_ORDER with "createdAt_desc"', () => {
        wrapper
          .find('.order-by-filter .filter-list [data-test="newest-button"] .base-button')
          .trigger('click')
        expect(mutations['posts/TOGGLE_ORDER']).toHaveBeenCalledWith({}, 'createdAt_desc')
      })
    })

    describe('click "oldest-button"', () => {
      it('calls TOGGLE_ORDER with "createdAt_asc"', () => {
        wrapper
          .find('.order-by-filter .filter-list [data-test="oldest-button"] .base-button')
          .trigger('click')
        expect(mutations['posts/TOGGLE_ORDER']).toHaveBeenCalledWith({}, 'createdAt_asc')
      })
    })
  })
})
