import { config, mount } from '@vue/test-utils'
import PageFooter from './PageFooter.vue'
import linksDefault from '~/constants/links.js'

const localVue = global.localVue

config.stubs['nuxt-link'] = '<span class="nuxt-link"><slot /></span>'

describe('PageFooter.vue', () => {
  let mocks
  let wrapper

  beforeEach(() => {
    mocks = {
      $t: jest.fn(),
      $env: {
        VERSION: 'v1.0.0',
      },
    }
  })

  describe('mount', () => {
    const Wrapper = () => {
      return mount(PageFooter, { mocks, localVue })
    }

    describe('links.js', () => {
      beforeEach(() => {
        wrapper = Wrapper()
      })

      it('renders four links', () => {
        expect(wrapper.findAll('a')).toHaveLength(4)
      })

      it('renders three nuxt-links', () => {
        expect(wrapper.findAll('.nuxt-link')).toHaveLength(3)
      })

      it('renders version', () => {
        expect(wrapper.find('.ds-footer').text()).toContain('v1.0.0')
      })
    })

    describe('inflexible links', () => {
      beforeEach(() => {
        wrapper = Wrapper()
      })

      it('renders version', () => {
        expect(wrapper.find('a[data-test="version-link"]').exists()).toBeTruthy()
      })
    })

    describe('flexible links not set', () => {
      beforeEach(async () => {
        const links = {
          ...linksDefault,
          ORGANIZATION: null,
          IMPRINT: null,
          TERMS_AND_CONDITIONS: null,
          CODE_OF_CONDUCT: null,
          DATA_PRIVACY: null,
          FAQ: null,
        }
        wrapper = Wrapper()
        wrapper.setData({ links })
        await wrapper.vm.$nextTick()
      })

      it('renders ORGANIZATION as nuxt-link', () => {
        expect(wrapper.find('span[data-test="organization-nuxt-link"]').exists()).toBeTruthy()
      })

      it('renders IMPRINT as nuxt-link', () => {
        expect(wrapper.find('span[data-test="imprint-nuxt-link"]').exists()).toBeTruthy()
      })

      it('renders TERMS_AND_CONDITIONS as nuxt-link', () => {
        expect(wrapper.find('span[data-test="terms-nuxt-link"]').exists()).toBeTruthy()
      })

      it('renders CODE_OF_CONDUCT as nuxt-link', () => {
        expect(wrapper.find('span[data-test="code-nuxt-link"]').exists()).toBeTruthy()
      })

      it('renders DATA_PRIVACY as nuxt-link', () => {
        expect(wrapper.find('span[data-test="data-nuxt-link"]').exists()).toBeTruthy()
      })

      it('renders FAQ as nuxt-link', () => {
        expect(wrapper.find('span[data-test="faq-nuxt-link"]').exists()).toBeTruthy()
      })
    })

    describe('flexible links set', () => {
      beforeEach(async () => {
        const links = {
          ...linksDefault,
          ORGANIZATION: 'https://ocelot.social',
          IMPRINT: 'https://ocelot.social/IMPRINT',
          TERMS_AND_CONDITIONS: 'https://ocelot.social/TERMS_AND_CONDITIONS',
          CODE_OF_CONDUCT: 'https://ocelot.social/CODE_OF_CONDUCT',
          DATA_PRIVACY: 'https://ocelot.social/DATA_PRIVACY',
          FAQ: 'https://ocelot.social/FAQ',
        }
        wrapper = Wrapper()
        wrapper.setData({ links })
        await wrapper.vm.$nextTick()
      })

      it('renders ORGANIZATION as "a" tag link', () => {
        expect(wrapper.find(`a[href="https://ocelot.social"]`).exists()).toBeTruthy()
      })

      it('renders IMPRINT as "a" tag link', () => {
        expect(wrapper.find(`a[href="https://ocelot.social/IMPRINT"]`).exists()).toBeTruthy()
      })

      it('renders TERMS_AND_CONDITIONS as "a" tag link', () => {
        expect(
          wrapper.find(`a[href="https://ocelot.social/TERMS_AND_CONDITIONS"]`).exists(),
        ).toBeTruthy()
      })

      it('renders CODE_OF_CONDUCT as "a" tag link', () => {
        expect(
          wrapper.find(`a[href="https://ocelot.social/CODE_OF_CONDUCT"]`).exists(),
        ).toBeTruthy()
      })

      it('renders DATA_PRIVACY as "a" tag link', () => {
        expect(wrapper.find(`a[href="https://ocelot.social/DATA_PRIVACY"]`).exists()).toBeTruthy()
      })

      it('renders FAQ as "a" tag link', () => {
        expect(wrapper.find(`a[href="https://ocelot.social/FAQ"]`).exists()).toBeTruthy()
      })
    })
  })
})
