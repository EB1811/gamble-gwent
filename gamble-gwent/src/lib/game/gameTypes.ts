import type {
  CARD_CLASS,
  PLAYER_ROUND_STATE_ACTION,
  ROUND_STATES,
  ROUND_STATE_ACTION
} from '../constants'
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

export type CardModifier = (
  modifierCard: PlacedCard,
  otherCard: PlacedCard
) => PlacedCard
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
  readonly ownerPlayerNo?: 1 | 2
}

export type BoardLayout = {
  readonly player1: readonly BattleGroup[]
  readonly player2: readonly BattleGroup[]

  readonly globalModifiers: readonly BattleGroup[]
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

export type AIPlay = {
  action: PLAYER_ROUND_STATE_ACTION
  card?: GameCard
  positionId?: string
}

export type RelevantGameInfo = {
  roundState: ROUND_STATES
  aiLives: number
  aiStrength: number
  playerStrength: number
  playerHandLength: number
  boardCards: readonly PlacedCard[]
}

export type GetAIPlay = (
  playerNo: 1 | 2,
  board: BoardLayout,
  aiCards: readonly GameCard[],
  {
    roundState,
    aiLives,
    aiStrength,
    playerStrength,
    boardCards
  }: RelevantGameInfo
) => AIPlay
