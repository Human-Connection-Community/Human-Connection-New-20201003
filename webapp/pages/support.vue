<template>
  <div>
    <ds-space margin="small">
      <ds-heading tag="h2">{{ $t('site.support') }}</ds-heading>
    </ds-space>
    <ds-container>
      <div v-html="$t('html.support')" />
    </ds-container>
  </div>
</template>

<script>
export default {
  layout: 'basic',
  head() {
    return {
      title: this.$t('site.support'),
    }
  },
}
</script>
