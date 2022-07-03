import {ROUND_STATES, ROUND_STATE_ACTION} from '../../constants'
import type {BoardLayout, GameCard} from '../gameTypes'

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
}

const getRandomAIPlay = (
  playerNo: 1 | 2,
  board: BoardLayout,
  gameCards: readonly GameCard[],
  {roundState, aiStrength, playerStrength}: RelevantGameInfo
): AIPlay => {
  if (
    roundState === ROUND_STATES.PLAYER_PASS_ENEMY_TURN &&
    aiStrength > playerStrength
  )
    return {action: ROUND_STATE_ACTION.passTurn}

  if (gameCards.length <= 0) return {action: ROUND_STATE_ACTION.passTurn}

  const card: GameCard = gameCards[Math.floor(Math.random() * gameCards.length)]

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
