import gql from 'graphql-tag'

export const DonationsQuery = () => gql`
  query {
    Donations {
      id
      showDonations
      goal
      progress
    }
  }
`

export const UpdateDonations = () => {
  return gql`
    mutation($showDonations: Boolean, $goal: Int, $progress: Int) {
      UpdateDonations(showDonations: $showDonations, goal: $goal, progress: $progress) {
        id
        showDonations
        goal
        progress
        updatedAt
      }
    }
  `
}
