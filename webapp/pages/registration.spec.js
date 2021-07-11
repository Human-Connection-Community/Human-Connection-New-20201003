import Vuex from 'vuex'
import { config, mount } from '@vue/test-utils'
import Registration from './registration.vue'
import Vue from 'vue'

const localVue = global.localVue

config.stubs['client-only'] = '<span><slot /></span>'
config.stubs['router-link'] = '<span><slot /></span>'
config.stubs['nuxt-link'] = '<span><slot /></span>'
config.stubs['infinite-loading'] = '<span><slot /></span>'

describe('Registration', () => {
  let wrapper
  let Wrapper
  let mocks
  let asyncData
  let store
  let redirect
  let isLoggedIn

  beforeEach(() => {
    mocks = {
      $t: (key) => key,
      $i18n: {
        locale: () => 'de',
      },
      $route: {
        query: {},
      },
      $env: {},
    }
    asyncData = false
    isLoggedIn = false
    redirect = jest.fn()
  })

  describe('mount', () => {
    Wrapper = async () => {
      if (asyncData) {
        store = new Vuex.Store({
          getters: {
            'auth/isLoggedIn': () => isLoggedIn,
          },
        })
        const data = {
          method: mocks,
          overwriteSliderData: {
            collectedInputData: {
              inviteCode: null,
              email: null,
              emailSend: !!null,
              nonce: null,
            },
          },
          publicRegistration: false,
          inviteRegistration: false,
        }
        const aData = await Registration.asyncData({
          store,
          redirect,
        })
        Registration.data = function () {
          return { ...data, ...aData }
        }
      } else {
        Registration.data = Registration.backupData ? Registration.backupData : Registration.data
      }
      return mount(Registration, {
        mocks,
        localVue,
      })
    }

    it('renders', async () => {
      wrapper = await Wrapper()
      expect(wrapper.contains('div')).toBeTruthy()
    })

    describe('no "PUBLIC_REGISTRATION" and no "INVITE_REGISTRATION"', () => {
      beforeEach(() => {
        mocks.$env = {
          PUBLIC_REGISTRATION: false,
          INVITE_REGISTRATION: false,
        }
      })

      it('no "method" query in URI show "RegistrationSlideNoPublic"', async () => {
        mocks.$route.query = {}
        wrapper = await Wrapper()
        expect(wrapper.find('.hc-empty').exists()).toBe(true)
        expect(wrapper.find('.enter-invite').exists()).toBe(false)
        expect(wrapper.find('.enter-email').exists()).toBe(false)
      })

      describe('"method=invite-mail" in URI show "RegistrationSlideNonce"', () => {
        it('no "email" query in URI', async () => {
          mocks.$route.query = { method: 'invite-mail' }
          wrapper = await Wrapper()
          expect(wrapper.find('.enter-nonce').exists()).toBe(true)
        })

        describe('"email=user%40example.org" query in URI', () => {
          it('have email displayed', async () => {
            mocks.$route.query = { method: 'invite-mail', email: 'user@example.org' }
            wrapper = await Wrapper()
            expect(wrapper.find('.enter-nonce').text()).toContain('user@example.org')
          })

          it('"nonce=64835" query in URI have nonce in input', async () => {
            mocks.$route.query = {
              method: 'invite-mail',
              email: 'user@example.org',
              nonce: '64835',
            }
            wrapper = await Wrapper()
            await Vue.nextTick()
            const form = wrapper.find('.enter-nonce')
            expect(form.vm.formData.nonce).toEqual('64835')
          })
        })
      })

      describe('"method=invite-code" in URI show "RegistrationSlideNoPublic"', () => {
        it('no "inviteCode" query in URI', async () => {
          mocks.$route.query = { method: 'invite-code' }
          wrapper = await Wrapper()
          expect(wrapper.find('.hc-empty').exists()).toBe(true)
        })

        it('"inviteCode=AAAAAA" query in URI', async () => {
          mocks.$route.query = { method: 'invite-code', inviteCode: 'AAAAAA' }
          wrapper = await Wrapper()
          expect(wrapper.find('.hc-empty').exists()).toBe(true)
        })
      })
    })

    describe('no "PUBLIC_REGISTRATION" but "INVITE_REGISTRATION"', () => {
      beforeEach(() => {
        mocks.$env = {
          PUBLIC_REGISTRATION: false,
          INVITE_REGISTRATION: true,
        }
      })

      it('no "method" query in URI show "RegistrationSlideInvite"', async () => {
        mocks.$route.query = {}
        wrapper = await Wrapper()
        expect(wrapper.find('.enter-invite').exists()).toBe(true)
        expect(wrapper.find('.enter-email').exists()).toBe(false)
      })

      describe('"method=invite-mail" in URI show "RegistrationSlideNonce"', () => {
        it('no "inviteCode" query in URI', async () => {
          mocks.$route.query = { method: 'invite-mail' }
          wrapper = await Wrapper()
          expect(wrapper.find('.enter-nonce').exists()).toBe(true)
        })

        describe('"email=user%40example.org" query in URI', () => {
          it('have email displayed', async () => {
            mocks.$route.query = { method: 'invite-mail', email: 'user@example.org' }
            wrapper = await Wrapper()
            expect(wrapper.find('.enter-nonce').text()).toContain('user@example.org')
          })

          it('"nonce=64835" query in URI have nonce in input', async () => {
            mocks.$route.query = {
              method: 'invite-mail',
              email: 'user@example.org',
              nonce: '64835',
            }
            wrapper = await Wrapper()
            await Vue.nextTick()
            const form = wrapper.find('.enter-nonce')
            expect(form.vm.formData.nonce).toEqual('64835')
          })
        })
      })

      describe('"method=invite-code" in URI show "RegistrationSlideInvite"', () => {
        it('no "inviteCode" query in URI', async () => {
          mocks.$route.query = { method: 'invite-code' }
          wrapper = await Wrapper()
          expect(wrapper.find('.enter-invite').exists()).toBe(true)
        })

        it('"inviteCode=AAAAAA" query in URI have invite code in input', async () => {
          mocks.$route.query = { method: 'invite-code', inviteCode: 'AAAAAA' }
          wrapper = await Wrapper()
          await Vue.nextTick()
          const form = wrapper.find('.enter-invite')
          expect(form.vm.formData.inviteCode).toEqual('AAAAAA')
        })
      })
    })

    describe('"PUBLIC_REGISTRATION" but no "INVITE_REGISTRATION"', () => {
      beforeEach(() => {
        mocks.$env = {
          PUBLIC_REGISTRATION: true,
          INVITE_REGISTRATION: false,
        }
      })

      it('no "method" query in URI show "RegistrationSlideEmail"', async () => {
        mocks.$route.query = {}
        wrapper = await Wrapper()
        expect(wrapper.find('.enter-email').exists()).toBe(true)
        expect(wrapper.find('.enter-invite').exists()).toBe(false)
      })

      describe('"method=invite-mail" in URI show "RegistrationSlideNonce"', () => {
        it('no "inviteCode" query in URI', async () => {
          mocks.$route.query = { method: 'invite-mail' }
          wrapper = await Wrapper()
          expect(wrapper.find('.enter-nonce').exists()).toBe(true)
        })

        describe('"email=user%40example.org" query in URI', () => {
          it('have email displayed', async () => {
            mocks.$route.query = { method: 'invite-mail', email: 'user@example.org' }
            wrapper = await Wrapper()
            expect(wrapper.find('.enter-nonce').text()).toContain('user@example.org')
          })

          it('"nonce=64835" query in URI have nonce in input', async () => {
            mocks.$route.query = {
              method: 'invite-mail',
              email: 'user@example.org',
              nonce: '64835',
            }
            wrapper = await Wrapper()
            await Vue.nextTick()
            const form = wrapper.find('.enter-nonce')
            expect(form.vm.formData.nonce).toEqual('64835')
          })
        })
      })

      describe('"method=invite-code" in URI show "RegistrationSlideEmail"', () => {
        it('no "inviteCode" query in URI', async () => {
          mocks.$route.query = { method: 'invite-code' }
          wrapper = await Wrapper()
          expect(wrapper.find('.enter-email').exists()).toBe(true)
          expect(wrapper.find('.enter-invite').exists()).toBe(false)
        })
      })
    })

    describe('"PUBLIC_REGISTRATION" and  "INVITE_REGISTRATION"', () => {
      beforeEach(() => {
        mocks.$env = {
          PUBLIC_REGISTRATION: true,
          INVITE_REGISTRATION: true,
        }
      })

      it('no "method" query in URI show "RegistrationSlideEmail"', async () => {
        mocks.$route.query = {}
        wrapper = await Wrapper()
        expect(wrapper.find('.enter-email').exists()).toBe(true)
        expect(wrapper.find('.enter-invite').exists()).toBe(false)
      })

      describe('"method=invite-mail" in URI show "RegistrationSlideNonce"', () => {
        it('no "inviteCode" query in URI', async () => {
          mocks.$route.query = { method: 'invite-mail' }
          wrapper = await Wrapper()
          expect(wrapper.find('.enter-nonce').exists()).toBe(true)
        })

        describe('"email=user%40example.org" query in URI', () => {
          it('have email displayed', async () => {
            mocks.$route.query = { method: 'invite-mail', email: 'user@example.org' }
            wrapper = await Wrapper()
            expect(wrapper.find('.enter-nonce').text()).toContain('user@example.org')
          })

          it('"nonce=64835" query in URI have nonce in input', async () => {
            mocks.$route.query = {
              method: 'invite-mail',
              email: 'user@example.org',
              nonce: '64835',
            }
            wrapper = await Wrapper()
            await Vue.nextTick()
            const form = wrapper.find('.enter-nonce')
            expect(form.vm.formData.nonce).toEqual('64835')
          })
        })
      })

      describe('"method=invite-code" in URI show "RegistrationSlideInvite"', () => {
        it('no "inviteCode" query in URI', async () => {
          mocks.$route.query = { method: 'invite-code' }
          wrapper = await Wrapper()
          expect(wrapper.find('.enter-invite').exists()).toBe(true)
        })

        it('"inviteCode=AAAAAA" query in URI have invite code in input', async () => {
          mocks.$route.query = { method: 'invite-code', inviteCode: 'AAAAAA' }
          wrapper = await Wrapper()
          await Vue.nextTick()
          const form = wrapper.find('.enter-invite')
          expect(form.vm.formData.inviteCode).toEqual('AAAAAA')
        })
      })
    })

    it('renders', async () => {
      wrapper = await Wrapper()
      expect(wrapper.is('.login-form')).toBe(true)
    })

    // The asyncTests must go last
    it('renders with asyncData and not loggedIn', async () => {
      asyncData = true
      wrapper = await Wrapper()
      expect(redirect).not.toHaveBeenCalled()
    })

    it('renders with asyncData and loggedIn', async () => {
      asyncData = true
      isLoggedIn = true
      wrapper = await Wrapper()
      expect(redirect).toBeCalledWith('/')
    })

    // copied from webapp/components/Registration/Signup.spec.js as testing template
    // describe('with invitation code', () => {
    //   let action
    //   beforeEach(() => {
    //     propsData.token = '12345'
    //     action = async () => {
    //       wrapper = Wrapper()
    //       wrapper.find('input#email').setValue('mail@example.org')
    //       await wrapper.find('form').trigger('submit')
    //       await wrapper.html()
    //     }
    //   })

    //   describe('submit', () => {
    //     it('delivers invitation code to backend', async () => {
    //       await action()
    //       const expected = expect.objectContaining({
    //         mutation: SignupMutation,
    //         variables: { email: 'mail@example.org', inviteCode: '12345' },
    //       })
    //       expect(mocks.$apollo.mutate).toHaveBeenCalledWith(expected)
    //     })

    //     describe('in case a user account with the email already exists', () => {
    //       beforeEach(() => {
    //         mocks.$apollo.mutate = jest
    //           .fn()
    //           .mockRejectedValue(
    //             new Error('UserInputError: A user account with this email already exists.'),
    //           )
    //       })

    //       it('explains the error', async () => {
    //         await action()
    //         expect(mocks.$t).toHaveBeenCalledWith(
    //           'components.registration.signup.form.errors.email-exists',
    //         )
    //       })
    //     })
    //   })
    // })
  })
})

// template from deleted webapp/components/Registration/CreateUserAccount.spec.js
// import { config, mount } from '@vue/test-utils'
// import Vue from 'vue'
// import { VERSION } from '~/constants/terms-and-conditions-version.js'
// import CreateUserAccount from './CreateUserAccount'
// import { SignupVerificationMutation } from '~/graphql/Registration.js'
// const localVue = global.localVue

// config.stubs['sweetalert-icon'] = '<span><slot /></span>'
// config.stubs['client-only'] = '<span><slot /></span>'
// config.stubs['nuxt-link'] = '<span><slot /></span>'

// describe('CreateUserAccount', () => {
//   let wrapper, Wrapper, mocks, propsData, stubs

//   beforeEach(() => {
//     mocks = {
//       $toast: {
//         success: jest.fn(),
//         error: jest.fn(),
//       },
//       $t: jest.fn(),
//       $apollo: {
//         loading: false,
//         mutate: jest.fn(),
//       },
//       $i18n: {
//         locale: () => 'en',
//       },
//     }
//     propsData = {}
//     stubs = {
//       LocaleSwitch: "<div class='stub'></div>",
//     }
//   })

//   describe('mount', () => {
//     Wrapper = () => {
//       return mount(CreateUserAccount, {
//         mocks,
//         propsData,
//         localVue,
//         stubs,
//       })
//     }

//     describe('given email and nonce', () => {
//       beforeEach(() => {
//         propsData.nonce = '666777'
//         propsData.email = 'sixseven@example.org'
//       })

//       it('renders a form to create a new user', () => {
//         wrapper = Wrapper()
//         expect(wrapper.find('.create-user-account').exists()).toBe(true)
//       })

//       describe('submit', () => {
//         let action
//         beforeEach(() => {
//           action = async () => {
//             wrapper = Wrapper()
//             wrapper.find('input#name').setValue('John Doe')
//             wrapper.find('input#password').setValue('hellopassword')
//             wrapper.find('textarea#about').setValue('Hello I am the `about` attribute')
//             wrapper.find('input#passwordConfirmation').setValue('hellopassword')
//             wrapper.find('input#checkbox0').setChecked()
//             wrapper.find('input#checkbox1').setChecked()
//             wrapper.find('input#checkbox2').setChecked()
//             wrapper.find('input#checkbox3').setChecked()
//             wrapper.find('input#checkbox4').setChecked()
//             await wrapper.find('form').trigger('submit')
//             await wrapper.html()
//           }
//         })

//         it('delivers data to backend', async () => {
//           await action()
//           const expected = expect.objectContaining({
//             variables: {
//               about: 'Hello I am the `about` attribute',
//               name: 'John Doe',
//               email: 'sixseven@example.org',
//               nonce: '666777',
//               password: 'hellopassword',
//               termsAndConditionsAgreedVersion: VERSION,
//               locale: 'en',
//             },
//           })
//           expect(mocks.$apollo.mutate).toHaveBeenCalledWith(expected)
//         })

//         it('calls CreateUserAccount graphql mutation', async () => {
//           await action()
//           const expected = expect.objectContaining({ mutation: SignupVerificationMutation })
//           expect(mocks.$apollo.mutate).toHaveBeenCalledWith(expected)
//         })

//         describe('in case mutation resolves', () => {
//           beforeEach(() => {
//             mocks.$apollo.mutate = jest.fn().mockResolvedValue({
//               data: {
//                 SignupVerification: {
//                   id: 'u1',
//                   name: 'John Doe',
//                   slug: 'john-doe',
//                 },
//               },
//             })
//           })

//           it('displays success', async () => {
//             await action()
//             await Vue.nextTick()
//             expect(mocks.$t).toHaveBeenCalledWith(
//               'components.registration.create-user-account.success',
//             )
//           })

//           describe('after timeout', () => {
//             beforeEach(jest.useFakeTimers)

//             it('emits `userCreated` with { password, email }', async () => {
//               await action()
//               jest.runAllTimers()
//               expect(wrapper.emitted('userCreated')).toEqual([
//                 [
//                   {
//                     email: 'sixseven@example.org',
//                     password: 'hellopassword',
//                   },
//                 ],
//               ])
//             })
//           })
//         })

//         describe('in case mutation rejects', () => {
//           beforeEach(() => {
//             mocks.$apollo.mutate = jest.fn().mockRejectedValue(new Error('Invalid nonce'))
//           })

//           it('displays form errors', async () => {
//             await action()
//             await Vue.nextTick()
//             expect(mocks.$t).toHaveBeenCalledWith(
//               'components.registration.create-user-account.error',
//             )
//           })
//         })
//       })
//     })
//   })
// })
