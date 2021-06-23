<template>
  <filter-menu-section :divider="false" class="order-by-filter">
    <template #filter-list>
      <li class="item">
        <labeled-button
          icon="sort-amount-asc"
          :label="$t('filter-menu.order.newest.label')"
          :filled="orderBy === 'createdAt_desc'"
          :title="$t('filter-menu.order.newest.hint')"
          @click="toggleOrder('createdAt_desc')"
          data-test="newest-button"
        />
      </li>
      <li class="item">
        <labeled-button
          icon="sort-amount-desc"
          :label="$t('filter-menu.order.oldest.label')"
          :filled="orderBy === 'createdAt_asc'"
          :title="$t('filter-menu.order.oldest.hint')"
          @click="toggleOrder('createdAt_asc')"
          data-test="oldest-button"
        />
      </li>
    </template>
  </filter-menu-section>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import FilterMenuSection from '~/components/FilterMenu/FilterMenuSection'
import LabeledButton from '~/components/_new/generic/LabeledButton/LabeledButton'

export default {
  name: 'OrderByFilter',
  components: {
    FilterMenuSection,
    LabeledButton,
  },
  computed: {
    ...mapGetters({
      orderBy: 'posts/orderBy',
    }),
  },
  methods: {
    ...mapMutations({
      toggleOrder: 'posts/TOGGLE_ORDER',
    }),
  },
}
</script>
