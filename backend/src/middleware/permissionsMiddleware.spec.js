import { createTestClient } from 'apollo-server-testing'
import createServer from '../server'
import Factory, { cleanDatabase } from '../db/factories'
import { gql } from '../helpers/jest'
import { getDriver, getNeode } from '../db/neo4j'
import CONFIG from '../config'

const instance = getNeode()
const driver = getDriver()

let query, mutate, variables
let authenticatedUser, owner, anotherRegularUser, administrator, moderator

describe('authorization', () => {
  beforeAll(async () => {
    await cleanDatabase()

    const { server } = createServer({
      context: () => ({
        driver,
        instance,
        user: authenticatedUser,
      }),
    })
    query = createTestClient(server).query
    mutate = createTestClient(server).mutate
  })

  afterAll(async () => {
    await cleanDatabase()
  })

  // TODO: avoid database clean after each test in the future if possible for performance and flakyness reasons by filling the database step by step, see issue https://github.com/Ocelot-Social-Community/Ocelot-Social/issues/4543
  afterEach(async () => {
    await cleanDatabase()
  })

  describe('given an owner, an other user, an admin, a moderator', () => {
    beforeEach(async () => {
      ;[owner, anotherRegularUser, administrator, moderator] = await Promise.all([
        Factory.build(
          'user',
          {
            name: 'Owner',
          },
          {
            email: 'owner@example.org',
            password: 'iamtheowner',
          },
        ),
        Factory.build(
          'user',
          {
            name: 'Another Regular User',
          },
          {
            email: 'another.regular.user@example.org',
            password: 'else',
          },
        ),
        Factory.build(
          'user',
          {
            name: 'Admin',
            role: 'admin',
          },
          {
            email: 'admin@example.org',
            password: 'admin',
          },
        ),
        Factory.build(
          'user',
          {
            name: 'Moderator',
            role: 'moderator',
          },
          {
            email: 'moderator@example.org',
            password: 'moderator',
          },
        ),
      ])
      variables = {}
    })

    describe('access email address', () => {
      const userQuery = gql`
        query ($name: String) {
          User(name: $name) {
            email
          }
        }
      `

      describe('unauthenticated', () => {
        beforeEach(() => {
          authenticatedUser = null
        })

        it("throws an error and does not expose the owner's email address", async () => {
          await expect(
            query({ query: userQuery, variables: { name: 'Owner' } }),
          ).resolves.toMatchObject({
            errors: [{ message: 'Not Authorised!' }],
            data: { User: [null] },
          })
        })
      })

      describe('authenticated', () => {
        describe('as the owner', () => {
          beforeEach(async () => {
            authenticatedUser = await owner.toJson()
          })

          it("exposes the owner's email address", async () => {
            variables = { name: 'Owner' }
            await expect(query({ query: userQuery, variables })).resolves.toMatchObject({
              data: { User: [{ email: 'owner@example.org' }] },
              errors: undefined,
            })
          })
        })

        describe('as another regular user', () => {
          beforeEach(async () => {
            authenticatedUser = await anotherRegularUser.toJson()
          })

          it("throws an error and does not expose the owner's email address", async () => {
            await expect(
              query({ query: userQuery, variables: { name: 'Owner' } }),
            ).resolves.toMatchObject({
              errors: [{ message: 'Not Authorised!' }],
              data: { User: [null] },
            })
          })
        })

        describe('as a moderator', () => {
          beforeEach(async () => {
            authenticatedUser = await moderator.toJson()
          })

          it("throws an error and does not expose the owner's email address", async () => {
            await expect(
              query({ query: userQuery, variables: { name: 'Owner' } }),
            ).resolves.toMatchObject({
              errors: [{ message: 'Not Authorised!' }],
              data: { User: [null] },
            })
          })
        })

        describe('as an administrator', () => {
          beforeEach(async () => {
            authenticatedUser = await administrator.toJson()
          })

          it("exposes the owner's email address", async () => {
            variables = { name: 'Owner' }
            await expect(query({ query: userQuery, variables })).resolves.toMatchObject({
              data: { User: [{ email: 'owner@example.org' }] },
              errors: undefined,
            })
          })
        })
      })
    })

    describe('access Signup', () => {
      const signupMutation = gql`
        mutation ($email: String!, $inviteCode: String) {
          Signup(email: $email, inviteCode: $inviteCode) {
            email
          }
        }
      `

      describe('admin invite only', () => {
        beforeEach(async () => {
          variables = {
            email: 'some@email.org',
            inviteCode: 'AAAAAA',
          }
          CONFIG.INVITE_REGISTRATION = false
          CONFIG.PUBLIC_REGISTRATION = false
          await Factory.build('inviteCode', {
            code: 'AAAAAA',
          })
        })

        describe('as user', () => {
          beforeEach(async () => {
            authenticatedUser = await anotherRegularUser.toJson()
          })

          it('denies permission', async () => {
            await expect(mutate({ mutation: signupMutation, variables })).resolves.toMatchObject({
              errors: [{ message: 'Not Authorised!' }],
              data: { Signup: null },
            })
          })
        })

        describe('as admin', () => {
          beforeEach(async () => {
            authenticatedUser = await administrator.toJson()
          })

          it('returns an email', async () => {
            await expect(mutate({ mutation: signupMutation, variables })).resolves.toMatchObject({
              errors: undefined,
              data: {
                Signup: { email: 'some@email.org' },
              },
            })
          })
        })
      })

      describe('public registration', () => {
        beforeEach(async () => {
          variables = {
            email: 'some@email.org',
            inviteCode: 'AAAAAA',
          }
          CONFIG.INVITE_REGISTRATION = false
          CONFIG.PUBLIC_REGISTRATION = true
          await Factory.build('inviteCode', {
            code: 'AAAAAA',
          })
        })

        describe('as anyone', () => {
          beforeEach(async () => {
            authenticatedUser = null
          })

          it('returns an email', async () => {
            await expect(mutate({ mutation: signupMutation, variables })).resolves.toMatchObject({
              errors: undefined,
              data: {
                Signup: { email: 'some@email.org' },
              },
            })
          })
        })
      })

      describe('invite registration', () => {
        beforeEach(async () => {
          CONFIG.INVITE_REGISTRATION = true
          CONFIG.PUBLIC_REGISTRATION = false
          await Factory.build('inviteCode', {
            code: 'AAAAAA',
          })
        })

        describe('as anyone with valid invite code', () => {
          beforeEach(async () => {
            variables = {
              email: 'some@email.org',
              inviteCode: 'AAAAAA',
            }
            authenticatedUser = null
          })

          it('returns an email', async () => {
            await expect(mutate({ mutation: signupMutation, variables })).resolves.toMatchObject({
              errors: undefined,
              data: {
                Signup: { email: 'some@email.org' },
              },
            })
          })
        })

        describe('as anyone without valid invite', () => {
          beforeEach(async () => {
            variables = {
              email: 'some@email.org',
              inviteCode: 'no valid invite code',
            }
            authenticatedUser = null
          })

          it('denies permission', async () => {
            await expect(mutate({ mutation: signupMutation, variables })).resolves.toMatchObject({
              errors: [{ message: 'Not Authorised!' }],
              data: { Signup: null },
            })
          })
        })
      })
    })
  })
})
