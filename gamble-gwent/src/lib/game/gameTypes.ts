import type {CARD_CLASS, ROUND_STATES} from '../constants'
import type {Card} from '../types'
import type {GameState} from './gameStateStore'

export type GetPlaceablePositions = (
  boardLayout: BoardLayout,
  playerNo: number
) => readonly string[]

export type PlacedCardTransformation = (
  gameCard: GameCard,
  selectedGroupId: string
) => PlacedCard
export type RemovedCardTransformation = (placedCard: PlacedCard) => GameCard

export type CardModifier = (placedCard: PlacedCard) => PlacedCard
export type GameEffect = (gameState: GameState) => GameState

export type GameCard = Card & {
  readonly getPlaceablePositions: GetPlaceablePositions

  readonly placedCardTransformation: PlacedCardTransformation

  readonly modifier?: CardModifier
  readonly onPlayedEffect?: GameEffect
  readonly onRemovedEffect?: GameEffect
}

export type PlacedCard = GameCard & {
  readonly groupId: string

  readonly modifiable: boolean

  readonly removedCardTransformation: RemovedCardTransformation
}

export type BoardCards = readonly PlacedCard[]

export type BattleGroup = {
  readonly id: string
  readonly classType: CARD_CLASS
  readonly ownerPlayerNo: 1 | 2
}

export type SideGroup = {
  readonly id: string
  readonly classType: CARD_CLASS
}

export type BoardLayout = {
  readonly player1: readonly BattleGroup[]
  readonly player2: readonly BattleGroup[]

  readonly globalModifiers: readonly SideGroup[]
}

export type GameRound = {
  readonly id: string
  readonly roundState: ROUND_STATES
  readonly winnerPlayerNo: 1 | 2
  readonly gameId: string
}

export type Game = {
  readonly id: string
}
