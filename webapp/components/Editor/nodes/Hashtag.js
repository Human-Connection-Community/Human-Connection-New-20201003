import { Mention as TipTapMention } from 'tiptap-extensions'

export default class Hashtag extends TipTapMention {
  get name() {
    return 'hashtag'
  }

  get defaultOptions() {
    return {
      matcher: {
        char: '#',
        allowSpaces: false,
        startOfLine: false,
      },
      mentionClass: 'hashtag',
      suggestionClass: 'hashtag-suggestion',
    }
  }

  get schema() {
    return {
      ...super.schema,
      toDOM: (node) => {
        // use a dummy domain because URL cannot handle relative urls
        // Wolle const url = new URL('/', 'https://example.org')
        // Wolle url.searchParams.append('hashtag', node.attrs.id)
        const url = new URL('/', 'https://example.org')
        url.searchParams.append('search', '%23' + node.attrs.id)

        return [
          'a',
          {
            class: this.options.mentionClass,
            href: `/search/search-results${url.search}`,
            'data-hashtag-id': node.attrs.id,
            // Wolle target: '_blank',
          },
          `${this.options.matcher.char}${node.attrs.label}`,
        ]
      },
      parseDOM: [
        // Wolle make sure that correct html goe to the database! after editing a post now the new 'href' goes to the database and it gets inconsistant
        {
          tag: 'a[data-hashtag-id]',
          getAttrs: (dom) => {
            const id = dom.getAttribute('data-hashtag-id')
            const label = dom.innerText.split(this.options.matcher.char).join('')
            return { id, label }
          },
        },
      ],
    }
  }
}
