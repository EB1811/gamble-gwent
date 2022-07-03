import {writable} from 'svelte/store'
import {ROUND_STATES, ROUND_STATE_ACTION} from '../constants'
import getFullRandomHand from './gameFuncs/getFullRandomHand'
import getNextRoundState from './gameFuncs/getNextRoundState'
import type {BoardLayout, GameCard, PlacedCard} from './gameTypes'

export type GameState = {
  readonly playerDeckCards: readonly GameCard[]
  readonly playerHand: readonly GameCard[]
  readonly playerDiscard: readonly GameCard[]

  readonly enemyCardsAmount: number
  readonly enemyDeckCards?: readonly GameCard[]
  readonly enemyHand?: readonly GameCard[]
  readonly enemyDiscard?: readonly GameCard[]

  readonly boardLayout: BoardLayout
  readonly boardCards: readonly PlacedCard[]

  // readonly gameTurns?: ['player1', 'ENEMY']

  readonly roundState: ROUND_STATES

  readonly playerPoints: number
  readonly enemyPoints: number
}

export const initLocalGameState = (
  playerDeckCards: readonly GameCard[],
  enemyDeckCards: readonly GameCard[],
  boardLayout: BoardLayout
): GameState => ({
  playerDeckCards,
  playerHand: [],
  playerDiscard: [],
  enemyCardsAmount: 0,
  enemyDeckCards,
  enemyHand: [],
  enemyDiscard: [],
  boardLayout,
  boardCards: [],
  roundState: 'INITIAL',
  playerPoints: 0,
  enemyPoints: 0
})

export const initRandomPlayerHandState = (
  gameState: GameState,
  initCardAmount: number
): GameState => ({
  ...gameState,
  playerHand: getFullRandomHand(
    gameState.playerDeckCards,
    gameState.playerHand,
    initCardAmount
  ),
  enemyCardsAmount: initCardAmount
})

export const initRandomEnemyHandState = (
  gameState: GameState,
  initCardAmount: number
): GameState => ({
  ...gameState,
  enemyHand: getFullRandomHand(
    gameState.enemyDeckCards ?? [],
    gameState.enemyHand ?? [],
    initCardAmount
  )
})

export const startRoundState = (gameState: GameState): GameState => ({
  ...gameState,
  roundState: 'INITIAL'
})

export const initRandomTurnState = (gameState: GameState): GameState => ({
  ...gameState,
  roundState:
    Math.random() > 0.5
      ? getNextRoundState(gameState.roundState, ROUND_STATE_ACTION.turnPlayer)
      : getNextRoundState(gameState.roundState, ROUND_STATE_ACTION.turnEnemy)
})

export const endTurnState = (gameState: GameState): GameState => ({
  ...gameState,
  roundState: getNextRoundState(
    gameState.roundState,
    ROUND_STATE_ACTION.nextTurn
  )
})

export const passRoundState = (gameState: GameState): GameState => ({
  ...gameState,
  roundState: getNextRoundState(
    gameState.roundState,
    ROUND_STATE_ACTION.passTurn
  )
})

export const endRoundState = (gameState: GameState): GameState => ({
  ...gameState
})

// ? New file?
export const playCardState = (
  gameState: GameState,
  cardId: string,
  selectedGroupId: string
): GameState =>
  ((
    card: GameCard | undefined = gameState.playerHand.find(
      card => card.id === cardId
    )
  ) =>
    card
      ? {
          ...gameState,
          boardCards: [
            ...gameState.boardCards,
            card.placedCardTransformation(card, selectedGroupId)
          ],
          playerHand: gameState.playerHand.filter(c => c.id !== card.id)
        }
      : gameState)()

export const aiPlayCardState = (
  gameState: GameState,
  card: GameCard,
  selectedGroupId: string
): GameState => ({
  ...gameState,
  boardCards: [
    ...gameState.boardCards,
    card.placedCardTransformation(card, selectedGroupId)
  ],
  enemyHand: gameState.enemyHand?.filter(c => c.id !== card.id),
  enemyCardsAmount: gameState.enemyCardsAmount - 1
})

export const playerRoundWinnerState = (gameState: GameState): GameState => ({
  ...gameState,
  playerPoints: gameState.playerPoints + 1,
  boardCards: []
})

export const aiRoundWinnerState = (gameState: GameState): GameState => ({
  ...gameState,
  enemyPoints: gameState.enemyPoints + 1,
  boardCards: []
})

export const roundDrawState = (gameState: GameState): GameState => ({
  ...gameState,
  playerPoints: gameState.playerPoints + 1,
  enemyPoints: gameState.enemyPoints + 1,
  boardCards: []
})

const createGameState = () => {
  const defaultState: GameState = {
    playerDeckCards: [],
    playerHand: [],
    playerDiscard: [],
    enemyCardsAmount: 0,
    enemyDeckCards: [],
    enemyHand: [],
    enemyDiscard: [],
    boardLayout: {
      player1: [],
      player2: [],
      globalModifiers: []
    },
    boardCards: [],
    roundState: 'INITIAL',
    playerPoints: 0,
    enemyPoints: 0
  }

  const {subscribe, update} = writable(defaultState as GameState)

  return {
    subscribe,
    initLocalGame: (
      playerDeckCards: readonly GameCard[],
      enemyDeckCards: readonly GameCard[],
      boardLayout: BoardLayout
    ) =>
      update((gameState: GameState) =>
        initLocalGameState(playerDeckCards, enemyDeckCards, boardLayout)
      ),
    initRandomPlayerHand: (initCardAmount: number) =>
      update((gameState: GameState) =>
        initRandomPlayerHandState(gameState, initCardAmount)
      ),
    initRandomEnemyHand: (initCardAmount: number) =>
      update((gameState: GameState) =>
        initRandomEnemyHandState(gameState, initCardAmount)
      ),
    startRound: () =>
      update((gameState: GameState) => startRoundState(gameState)),
    initRandomTurn: () =>
      update((gameState: GameState) => initRandomTurnState(gameState)),
    endTurn: () => update((gameState: GameState) => endTurnState(gameState)),
    passRound: () =>
      update((gameState: GameState) => passRoundState(gameState)),
    playCard: (cardId: string, selectedGroupId: string) =>
      update((gameState: GameState) =>
        playCardState(gameState, cardId, selectedGroupId)
      ),
    aiPlayCard: (card: GameCard, selectedGroupId: string) =>
      update((gameState: GameState) =>
        aiPlayCardState(gameState, card, selectedGroupId)
      ),
    playerRoundWinner: () =>
      update((gameState: GameState) => playerRoundWinnerState(gameState)),
    aiRoundWinner: () =>
      update((gameState: GameState) => aiRoundWinnerState(gameState)),
    roundDraw: () => update((gameState: GameState) => roundDrawState(gameState))
  }
}

export const gameState = createGameState()
