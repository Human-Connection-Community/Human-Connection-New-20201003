<template>
  <div>
    <ds-space margin="small">
      <ds-heading tag="h2">{{ $t('site.made') }}</ds-heading>
    </ds-space>
    <ds-container>
      <div v-html="$t('html.organization')" />
    </ds-container>
  </div>
</template>

<script>
export default {
  layout: 'basic',
  head() {
    return {
      title: this.$t('site.made'),
    }
  },
}
</script>
