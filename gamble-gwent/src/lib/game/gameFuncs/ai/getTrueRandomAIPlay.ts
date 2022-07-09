import {ROUND_STATE_ACTION} from '../../../../lib/constants'
import type {
  AIPlay,
  BoardLayout,
  GameCard,
  RelevantGameInfo
} from '../../gameTypes'

const getGuidedRandomAIPlay = (
  playerNo: 1 | 2,
  board: BoardLayout,
  playerCards: readonly GameCard[],
  {
    roundState,
    aiLives,
    aiStrength,
    playerStrength,
    boardCards
  }: RelevantGameInfo
): AIPlay => {
  if (aiLives > 1 && Math.random() > 0.75)
    return {action: ROUND_STATE_ACTION.passTurn}

  const chosenCard: GameCard =
    playerCards[Math.floor(Math.random() * playerCards.length)]
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

export default getGuidedRandomAIPlay
