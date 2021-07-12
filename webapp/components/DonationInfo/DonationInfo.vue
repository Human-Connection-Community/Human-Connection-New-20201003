<template>
  <div class="donation-info">
    <progress-bar :label="label" :goal="goal" :progress="progress">
      <a target="_blank" :href="links.DONATE">
        <base-button size="small" filled>{{ $t('donations.donate-now') }}</base-button>
      </a>
    </progress-bar>
  </div>
</template>

<script>
import links from '~/constants/links.js'
import ProgressBar from '~/components/ProgressBar/ProgressBar.vue'

export default {
  components: {
    ProgressBar,
  },
  props: {
    title: { type: String, required: false, default: () => null },
    goal: { type: Number, required: true },
    progress: { type: Number, required: true },
  },
  data() {
    return {
      links,
    }
  },
  computed: {
    label() {
      // console.log(typeof this.progress, this.$i18n.locale(), this.progress.toLocaleString('de-DE'))
      return this.$t('donations.amount-of-total', {
        amount: this.progress.toLocaleString(this.$i18n.locale()),
        total: this.goal.toLocaleString(this.$i18n.locale()),
      })
    },
  },
}
</script>

<style lang="scss">
.donation-info {
  display: flex;
  flex: 1;
  margin-bottom: $space-x-small;
}
</style>
