import {ROUND_STATE_ACTION} from '../../constants'
import type {BoardLayout, GameCard} from '../gameTypes'

export type AIPlay = {
  action:
    | typeof ROUND_STATE_ACTION.nextTurn
    | typeof ROUND_STATE_ACTION.passTurn
  card?: GameCard
  positionId?: string
}
const getRandomAIPlay = (
  board: BoardLayout,
  playedCards: readonly GameCard[],
  playerNo: 1 | 2
): AIPlay => {
  if (playedCards.length <= 0) return {action: ROUND_STATE_ACTION.passTurn}

  const card: GameCard =
    playedCards[Math.floor(Math.random() * playedCards.length)]

  const placeablePositions: readonly string[] = card.getPlaceablePositions(
    board,
    playerNo
  )
  if (placeablePositions.length <= 0)
    return {action: ROUND_STATE_ACTION.passTurn}

  const positionId: string =
    placeablePositions[Math.floor(Math.random() * placeablePositions.length)]

  return {
    action: ROUND_STATE_ACTION.nextTurn,
    card,
    positionId
  }
}

export default getRandomAIPlay
