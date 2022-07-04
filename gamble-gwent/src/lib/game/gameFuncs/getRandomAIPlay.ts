import {CARD_CLASS, ROUND_STATES, ROUND_STATE_ACTION} from '../../constants'
import type {BoardLayout, GameCard, PlacedCard} from '../gameTypes'
import getCardStrength from './getCardStrength'

export type AIPlay = {
  action:
    | typeof ROUND_STATE_ACTION.nextTurn
    | typeof ROUND_STATE_ACTION.passTurn
  card?: GameCard
  positionId?: string
}
export type RelevantGameInfo = {
  roundState: ROUND_STATES
  aiStrength: number
  playerStrength: number
  boardCards: readonly PlacedCard[]
}

// TODO: ai === if statements
const getRandomAIPlay = (
  playerNo: 1 | 2,
  board: BoardLayout,
  playerCards: readonly GameCard[],
  {roundState, aiStrength, playerStrength, boardCards}: RelevantGameInfo
): AIPlay => {
  if (
    roundState === ROUND_STATES.PLAYER_PASS_ENEMY_TURN &&
    aiStrength > playerStrength
  )
    return {action: ROUND_STATE_ACTION.passTurn}
  if (playerCards.length <= 0) return {action: ROUND_STATE_ACTION.passTurn}

  const placedWeatherCards = boardCards.filter(
    c => c.class === CARD_CLASS.WEATHER
  )
  const nonAffectedCards = playerCards.filter(
    c =>
      getCardStrength(c.placedCardTransformation(c, '0'), placedWeatherCards) >=
      (c.strength ?? 0)
  )

  const chosenCard: GameCard | undefined =
    nonAffectedCards.length > 0
      ? nonAffectedCards[Math.floor(Math.random() * nonAffectedCards.length)]
      : undefined
  if (!chosenCard) return {action: ROUND_STATE_ACTION.passTurn}

  const placeablePositions: readonly string[] =
    chosenCard.getPlaceablePositions(board, playerNo)
  if (placeablePositions.length <= 0)
    return {action: ROUND_STATE_ACTION.passTurn}

  const positionId: string =
    placeablePositions[Math.floor(Math.random() * placeablePositions.length)]

  return {
    action: ROUND_STATE_ACTION.nextTurn,
    card: chosenCard,
    positionId
  }
}

export default getRandomAIPlay
