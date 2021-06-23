import get from 'lodash/get'
import update from 'lodash/update'
import xor from 'lodash/xor'
import isEmpty from 'lodash/isEmpty'
import isEqual from 'lodash/isEqual'
import clone from 'lodash/clone'

const defaultFilter = {}

export const state = () => {
  return {
    filter: {
      ...defaultFilter,
    },
    order: 'createdAt_desc',
  }
}

export const mutations = {
  TOGGLE_FILTER_BY_FOLLOWED(state, currentUserId) {
    const filter = clone(state.filter)
    const id = get(filter, 'author.followedBy_some.id')
    if (id) {
      delete filter.author
      state.filter = filter
    } else {
      state.filter = {
        ...filter,
        author: { followedBy_some: { id: currentUserId } },
      }
    }
  },
  RESET_CATEGORIES(state) {
    const filter = clone(state.filter)
    delete filter.categories_some
    state.filter = filter
  },
  RESET_EMOTIONS(state) {
    const filter = clone(state.filter)
    delete filter.emotions_some
    state.filter = filter
  },
  RESET_LANGUAGES(state) {
    const filter = clone(state.filter)
    delete filter.language_in
    state.filter = filter
  },
  TOGGLE_CATEGORY(state, categoryId) {
    const filter = clone(state.filter)
    update(filter, 'categories_some.id_in', (categoryIds) => xor(categoryIds, [categoryId]))
    if (isEmpty(get(filter, 'categories_some.id_in'))) delete filter.categories_some
    state.filter = filter
  },
  TOGGLE_LANGUAGE(state, languageCode) {
    const filter = clone(state.filter)
    update(filter, 'language_in', (languageCodes) => xor(languageCodes, [languageCode]))
    if (isEmpty(get(filter, 'language_in'))) delete filter.language_in
    state.filter = filter
  },
  TOGGLE_EMOTION(state, emotion) {
    const filter = clone(state.filter)
    update(filter, 'emotions_some.emotion_in', (emotions) => xor(emotions, [emotion]))
    if (isEmpty(get(filter, 'emotions_some.emotion_in'))) delete filter.emotions_some
    state.filter = filter
  },
  TOGGLE_ORDER(state, value) {
    state.order = value
  },
}

export const getters = {
  isActive(state) {
    return !isEqual(state.filter, defaultFilter)
  },
  filter(state) {
    return state.filter
  },
  filteredCategoryIds(state) {
    return get(state.filter, 'categories_some.id_in') || []
  },
  filteredLanguageCodes(state) {
    return get(state.filter, 'language_in') || []
  },
  filteredByUsersFollowed(state) {
    return !!get(state.filter, 'author.followedBy_some.id')
  },
  filteredByEmotions(state) {
    return get(state.filter, 'emotions_some.emotion_in') || []
  },
  orderBy(state) {
    return state.order
  },
}
