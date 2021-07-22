<template>
  <div id="footer" class="ds-footer">
    <!-- made with ❤️ -->
    <nuxt-link
      v-if="noLinkDefined(links.ORGANIZATION)"
      to="/organization"
      data-test="organization-nuxt-link"
    >
      {{ $t('site.made') }}
    </nuxt-link>
    <a v-else :href="links.ORGANIZATION" target="_blank" data-test="organization-link">
      {{ $t('site.made') }}
    </a>
    <span>-</span>
    <!-- imprint -->
    <nuxt-link v-if="noLinkDefined(links.IMPRINT)" to="/imprint" data-test="imprint-nuxt-link">
      {{ $t('site.imprint') }}
    </nuxt-link>
    <a v-else :href="links.IMPRINT" target="_blank">
      {{ $t('site.imprint') }}
    </a>
    <span>-</span>
    <!-- terms and conditions -->
    <nuxt-link
      v-if="noLinkDefined(links.TERMS_AND_CONDITIONS)"
      to="/terms-and-conditions"
      data-test="terms-nuxt-link"
    >
      {{ $t('site.termsAndConditions') }}
    </nuxt-link>
    <a v-else :href="links.TERMS_AND_CONDITIONS" target="_blank">
      {{ $t('site.termsAndConditions') }}
    </a>
    <span>-</span>
    <!-- code of conduct -->
    <nuxt-link
      v-if="noLinkDefined(links.CODE_OF_CONDUCT)"
      to="/code-of-conduct"
      data-test="code-nuxt-link"
    >
      {{ $t('site.code-of-conduct') }}
    </nuxt-link>
    <a v-else :href="links.CODE_OF_CONDUCT" target="_blank">
      {{ $t('site.code-of-conduct') }}
    </a>
    <span>-</span>
    <!-- data privacy -->
    <nuxt-link
      v-if="noLinkDefined(links.DATA_PRIVACY)"
      to="/data-privacy"
      data-test="data-nuxt-link"
    >
      {{ $t('site.data-privacy') }}
    </nuxt-link>
    <a v-else :href="links.DATA_PRIVACY" target="_blank">
      {{ $t('site.data-privacy') }}
    </a>
    <span>-</span>
    <!-- faq -->
    <nuxt-link v-if="noLinkDefined(links.FAQ)" to="/faq" data-test="faq-nuxt-link">
      {{ $t('site.faq') }}
    </nuxt-link>
    <a v-else :href="links.FAQ" target="_blank">
      {{ $t('site.faq') }}
    </a>
    <span>-</span>
    <!-- version -->
    <a
      href="https://github.com/Ocelot-Social-Community/Ocelot-Social/blob/master/CHANGELOG.md"
      target="_blank"
      data-test="version-link"
    >
      {{ version }}
    </a>
  </div>
</template>

<script>
import links from '~/constants/links.js'

export default {
  data() {
    return { links, version: `v${this.$env.VERSION}` }
  },
  methods: {
    noLinkDefined(link) {
      return !link || link.length === 0
    },
  },
}
</script>

<style lang="scss" scoped>
.ds-footer {
  text-align: center;
  position: fixed;
  bottom: 0px;
  z-index: 10;
  background-color: white;
  width: 100%;
  padding: 10px 10px;
  box-shadow: 0px -6px 12px -4px rgba(0, 0, 0, 0.1);
}
span {
  margin-right: 0.2rem;
}
</style>
