import type {CARD_CLASS, CARD_TYPE} from './constants'

export type Deck = {
  readonly id: string
  readonly name: string
  readonly desc: string
}

export type Card = {
  readonly id: string
  readonly name: string
  readonly desc: string
  readonly imgUrl?: string

  readonly deckId: string

  readonly class: CARD_CLASS
  readonly type: CARD_TYPE

  readonly strength?: number
}
