import type {
  AIPlay,
  BoardLayout,
  GameCard,
  RelevantGameInfo
} from '../../gameTypes'
import tempData from '../../../tempData.json'
import gameCardsMap from '../../gameCardsMap'
import type {Card} from '../../../../lib/types'
import getFullRandomHand from '../getFullRandomHand'
import {
  aiPlaceCardState,
  aiRoundWinnerState,
  endRoundState,
  endTurnState,
  initLocalGameState,
  initRandomEnemyHandState,
  initRandomPlayerHandState,
  initRandomTurnState,
  passRoundState,
  placeCardState,
  playerRoundWinnerState,
  roundDrawState,
  startRoundState
} from '../../gameStateStore'
import type {GameState} from '../../gameStateStore'
import {ROUND_STATES, ROUND_STATE_ACTION} from '../../../../lib/constants'
import getPlayerStrength from '../getPlayerStrength'

const vsGameSimulation = (
  alg1: (
    playerNo: 1 | 2,
    board: BoardLayout,
    playerCards: readonly GameCard[],
    {roundState, aiStrength, playerStrength, boardCards}: RelevantGameInfo
  ) => AIPlay,
  alg2: (
    playerNo: 1 | 2,
    board: BoardLayout,
    playerCards: readonly GameCard[],
    {roundState, aiStrength, playerStrength, boardCards}: RelevantGameInfo
  ) => AIPlay
): 0 | 1 | 2 | undefined => {
  const board = tempData.StandardBoardLayout as BoardLayout
  const cards: GameCard[] = tempData.cards.map(card =>
    gameCardsMap.get(card.id)!(card as Card)
  )

  const ai1Deck = cards.slice().sort(() => Math.random() - 0.5)
  const ai2Deck = cards.slice().sort(() => Math.random() - 0.5)

  const startGameState: GameState = initRandomTurnState(
    initRandomEnemyHandState(
      initRandomPlayerHandState(
        initLocalGameState(ai1Deck, ai2Deck, board),
        10
      ),
      10
    )
  )

  // console.log('start State', {startGameState})
  let currentGameState = startGameState
  let count = 0
  while (
    currentGameState.playerPoints < 2 &&
    currentGameState.enemyPoints < 2 &&
    count < 1000
  ) {
    // console.log(count)
    // if (count < 100) console.log({currentGameState})

    const ai1Strength = getPlayerStrength(
      currentGameState.boardLayout,
      currentGameState.boardCards,
      1
    )
    const ai2Strength = getPlayerStrength(
      currentGameState.boardLayout,
      currentGameState.boardCards,
      2
    )
    // console.log('ai1: ', ai1Strength, ' ai2: ', ai2Strength)

    // TODO: Turn this into a function in gameStateStore. postAIPlayState?
    if (currentGameState.roundState === ROUND_STATES.ROUND_END) {
      // console.log('round end state', {currentGameState})

      if (ai1Strength > ai2Strength)
        currentGameState = playerRoundWinnerState(currentGameState)
      if (ai1Strength < ai2Strength)
        currentGameState = aiRoundWinnerState(currentGameState)
      if (ai1Strength === ai2Strength)
        currentGameState = roundDrawState(currentGameState)

      currentGameState = endRoundState(currentGameState)

      if (
        currentGameState.playerPoints < 2 ||
        currentGameState.enemyPoints < 2
      ) {
        currentGameState = startRoundState(currentGameState)
        currentGameState = initRandomTurnState(currentGameState)
      }
    }

    if (currentGameState.roundState.includes(ROUND_STATES.PLAYER_TURN)) {
      const alg1Play = alg1(1, board, currentGameState.playerHand, {
        roundState: currentGameState.roundState,
        aiLives: 2 - currentGameState.playerPoints,
        aiStrength: ai1Strength,
        playerStrength: ai2Strength,
        playerHandLength: currentGameState.enemyHand?.length ?? 0,
        boardCards: currentGameState.boardCards
      })

      // console.log('alg1Play', {alg1Play})

      // TODO: Turn this into a function in gameStateStore. postAIPlayState?
      if (alg1Play.action === ROUND_STATE_ACTION.passTurn) {
        currentGameState = passRoundState(currentGameState)
      } else if (
        alg1Play.action === ROUND_STATE_ACTION.nextTurn &&
        alg1Play.card &&
        alg1Play.positionId
      ) {
        currentGameState = placeCardState(
          currentGameState,
          alg1Play.card,
          alg1Play.positionId
        )
        currentGameState = endTurnState(currentGameState)
      }
    } else if (currentGameState.roundState.includes(ROUND_STATES.ENEMY_TURN)) {
      const alg2Play = alg2(2, board, currentGameState.enemyHand ?? [], {
        roundState: currentGameState.roundState,
        aiLives: 2 - currentGameState.enemyPoints,
        aiStrength: ai2Strength,
        playerStrength: ai1Strength,
        playerHandLength: currentGameState.playerHand.length,
        boardCards: currentGameState.boardCards
      })

      // console.log('alg2Play', {alg2Play})

      if (alg2Play.action === ROUND_STATE_ACTION.passTurn) {
        currentGameState = passRoundState(currentGameState)
      } else if (
        alg2Play.action === ROUND_STATE_ACTION.nextTurn &&
        alg2Play.card &&
        alg2Play.positionId
      ) {
        currentGameState = aiPlaceCardState(
          currentGameState,
          alg2Play.card,
          alg2Play.positionId
        )
        currentGameState = endTurnState(currentGameState)
      }
    }

    // console.log('turn end state', {currentGameState})
    count += 1
  }
  // console.log('final state', {currentGameState})

  if (currentGameState.playerPoints > currentGameState.enemyPoints) return 1
  if (currentGameState.playerPoints < currentGameState.enemyPoints) return 2
  if (currentGameState.playerPoints === currentGameState.enemyPoints) return 0

  return undefined
}

export default vsGameSimulation
