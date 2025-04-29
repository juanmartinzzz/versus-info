const languages = ['en', 'es'];

const localStorageKeys = {
  localId: 'localId',
  languageCode: 'languageCode',
  previousSession: 'previousSessionV4',
}

const categories = [
  {
    id: '1',
    nameKey: 'politics',
    defaultEmoji: '⚔️',
  },
  {
    id: '2',
    nameKey: 'sports',
    defaultEmoji: '🏆',
  },
  {
    id: '3',
    nameKey: 'science',
    defaultEmoji: '🔬🧬',
  },
  {
    id: '4',
    nameKey: 'technology',
    defaultEmoji: '💻',
  },
  {
    id: '5',
    nameKey: 'showbiz',
    defaultEmoji: '🎭',
  },
  {
    id: '6',
    nameKey: 'business',
    defaultEmoji: '💰',
  },
  {
    id: '7',
    nameKey: 'health',
    defaultEmoji: '🏥',
  },
  {
    id: '8',
    nameKey: 'climate',
    defaultEmoji: '🌲',
  },
  {
    id: '9',
    nameKey: 'finance',
    defaultEmoji: '🪙',
  },
  {
    id: '10',
    nameKey: 'art',
    defaultEmoji: '🎨',
  },
  {
    id: '11',
    nameKey: 'society',
    defaultEmoji: '🌏',
  },
  {
    id: '12',
    nameKey: 'oddities',
    defaultEmoji: '🤔',
  },
  {
    id: '13',
    nameKey: 'trending',
    defaultEmoji: '🔥',
  },
]

const constants = {
  languages,
  categories,
  localStorageKeys,
}

export { constants };