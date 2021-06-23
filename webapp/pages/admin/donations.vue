<template>
  <base-card>
    <h2 class="title">{{ $t('admin.donations.name') }}</h2>
    <ds-form v-model="formData" @submit="submit">
      <ds-text class="show-donations-checkbox">
        <input
          id="showDonations"
          type="checkbox"
          v-model="showDonations"
          :checked="showDonations"
        />
        <label for="showDonations">
          {{ $t('admin.donations.showDonationsCheckboxLabel') }}
        </label>
      </ds-text>
      <ds-input
        id="donations-goal"
        class="donations-data"
        model="goal"
        :label="$t('admin.donations.goal')"
        placeholder="15000"
        icon="money"
        :disabled="!showDonations"
        data-test="donations-goal"
      />
      <ds-input
        class="donations-data"
        model="progress"
        :label="$t('admin.donations.progress')"
        placeholder="1200"
        icon="money"
        :disabled="!showDonations"
        data-test="donations-progress"
      />
      <base-button class="donations-info-button" filled type="submit">
        {{ $t('actions.save') }}
      </base-button>
    </ds-form>
  </base-card>
</template>

<script>
import { DonationsQuery, UpdateDonations } from '~/graphql/Donations'

export default {
  data() {
    return {
      formData: {
        goal: null,
        progress: null,
      },
      // TODO: Our styleguide does not support checkmarks.
      // Integrate showDonations into `this.formData` once we
      // have checkmarks available.
      showDonations: false,
    }
  },
  methods: {
    submit() {
      const { showDonations } = this
      let { goal, progress } = this.formData
      goal = typeof goal === 'string' && goal.length > 0 ? goal : '15000'
      progress = typeof progress === 'string' && progress.length > 0 ? progress : '0'
      this.$apollo
        .mutate({
          mutation: UpdateDonations(),
          variables: {
            showDonations,
            goal: parseInt(goal),
            progress: parseInt(progress) < parseInt(goal) ? parseInt(progress) : parseInt(goal),
          },
          update: (_store, { data }) => {
            if (!data || !data.UpdateDonations) return
            const { showDonations, goal, progress } = data.UpdateDonations
            this.showDonations = showDonations
            this.formData = {
              goal: goal.toString(10),
              progress: progress < goal ? progress.toString(10) : goal.toString(10),
            }
          },
        })
        .then(() => {
          this.$toast.success(this.$t('admin.donations.successfulUpdate'))
        })
        .catch((error) => this.$toast.error(error.message))
    },
  },
  apollo: {
    Donations: {
      query() {
        return DonationsQuery()
      },
      update({ Donations }) {
        if (!Donations) return
        const { showDonations, goal, progress } = Donations
        this.showDonations = showDonations
        this.formData = {
          goal: goal.toString(10),
          progress: progress < goal ? progress.toString(10) : goal.toString(10),
        }
      },
    },
  },
}
</script>

<style lang="scss" scoped>
.show-donations-checkbox {
  margin-top: $space-base;
  margin-bottom: $space-small;
}

.donations-data {
  margin-left: $space-small;
}

.donations-info-button {
  margin-top: $space-small;
}
</style>
