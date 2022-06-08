import type {GROUP, CARD_CLASS, CARD_TYPE, BOARD_POSITION} from '../constants'
import type {GameState} from './gameStateStore'

export type CardTransformation = (position?: BOARD_POSITION) => PlacedCard
export type CardModifier = (card: Card) => Card
export type GameEffect = (gameState: GameState) => GameState

export type Card = {
  readonly id: string
  readonly name: string
  readonly desc: string
  readonly imgUrl?: string

  readonly deck: string
  readonly class: CARD_CLASS
  readonly type: CARD_TYPE

  readonly strength: number

  readonly getPlaceablePositions: () => readonly BOARD_POSITION[]

  readonly onPlacedCardTransformation: CardTransformation
  readonly modifier?: CardModifier
  readonly onPlayedEffect?: GameEffect
  readonly onRemovedEffect?: GameEffect
}

export type PlacedCard = Card & {
  readonly position: BOARD_POSITION
  readonly ownerPlayerNo: 1 | 2

  readonly modifiable: boolean
}

// ? Derive?
// export type BoardSide = {
//   readonly siege: readonly PlacedCard[]
//   readonly ranged: readonly PlacedCard[]
//   readonly melee: readonly PlacedCard[]
// }

export type Board = readonly PlacedCard[]

export type OwnedGroups = readonly GROUP[]
