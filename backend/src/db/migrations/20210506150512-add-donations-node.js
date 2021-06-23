import { getDriver } from '../../db/neo4j'
import { v4 as uuid } from 'uuid'

export const description =
  'This migration adds a Donations node with default settings to the database.'

export async function up(next) {
  const driver = getDriver()
  const session = driver.session()
  const transaction = session.beginTransaction()

  try {
    // Implement your migration here.
    const donationId = uuid()
    await transaction.run(
      `
        CREATE (donationInfo:Donations)
        SET donationInfo.id = $donationId
        SET donationInfo.createdAt = toString(datetime())
        SET donationInfo.updatedAt = donationInfo.createdAt
        SET donationInfo.showDonations = false
        SET donationInfo.goal = 15000
        SET donationInfo.progress = 1200
        RETURN donationInfo {.*}
      `,
      { donationId },
    )
    await transaction.commit()
    next()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    await transaction.rollback()
    // eslint-disable-next-line no-console
    console.log('rolled back')
    throw new Error(error)
  } finally {
    session.close()
  }
}

export async function down(next) {
  const driver = getDriver()
  const session = driver.session()
  const transaction = session.beginTransaction()

  try {
    // Implement your migration here.
    await transaction.run(`
        MATCH (donationInfo:Donations)
        DETACH DELETE donationInfo
        RETURN donationInfo
    `)
    await transaction.commit()
    next()
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error)
    await transaction.rollback()
    // eslint-disable-next-line no-console
    console.log('rolled back')
    throw new Error(error)
  } finally {
    session.close()
  }
}
