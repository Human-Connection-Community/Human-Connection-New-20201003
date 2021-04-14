<template>
  <ds-tag class="hc-hashtag">
    <nuxt-link :to="hashtagUrl">#{{ id }}</nuxt-link>
  </ds-tag>
</template>

<script>
export default {
  name: 'HcHashtag',
  props: {
    id: { type: String, required: true },
  },
  computed: {
    hashtagUrl() {
      // Wolle return `/?hashtag=${this.id}`
      return `/search/search-results?search=%23${this.id}` // hashtag as '%23' has to be used for '#' explicitly! otherwise it is interpreted as the site path hashtag
    },
  },
}
</script>
