import {
  CARD_CLASS,
  ROUND_STATES,
  ROUND_STATE_ACTION
} from '../../../../lib/constants'
import type {
  AIPlay,
  BoardLayout,
  GameCard,
  GetAIPlay,
  PlacedCard,
  RelevantGameInfo
} from '../../gameTypes'
import getCardStrength from '../getCardStrength'

const getGuidedAIPlaySimple: GetAIPlay = (
  playerNo: 1 | 2,
  board: BoardLayout,
  aiCards,
  {
    roundState,
    aiLives,
    aiStrength,
    playerStrength,
    playerHandLength,
    boardCards
  }: RelevantGameInfo
): AIPlay => {
  if (
    roundState === ROUND_STATES.PLAYER_PASS_ENEMY_TURN &&
    aiStrength > playerStrength
  )
    return {action: ROUND_STATE_ACTION.passTurn}
  if (aiCards.length <= 0) return {action: ROUND_STATE_ACTION.passTurn}

  const placedWeatherCards: readonly PlacedCard[] = boardCards.filter(
    c => c.class === CARD_CLASS.WEATHER
  )
  const nonAffectedCards: readonly GameCard[] = aiCards.filter(
    c =>
      getCardStrength(c.placedCardTransformation(c, '0'), placedWeatherCards) >=
      (c.strength ?? 0)
  )

  // const enemyBoardCards: readonly PlacedCard[] = getPlayerBoardCards(
  //   board,
  //   boardCards,
  //   playerNo === 1 ? 2 : 1
  // )

  // ? Experiments
  // 42% -> 61%
  if (aiLives > 1 && Math.random() > 0.9)
    return {action: ROUND_STATE_ACTION.passTurn}

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

export default getGuidedAIPlaySimple
