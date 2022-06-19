import {readable, Readable, Subscriber, writable} from 'svelte/store'
import type {ROUND_STATES} from '../constants'
import tempData from './../tempData.json'
import getFullRandomHand from './gameFuncs/getFullRandomHand'
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

  // readonly gameTurns?: ['player1', 'player2']

  readonly roundState: ROUND_STATES

  readonly playerPoints: number
  readonly enemyPoints: number
}

// export const getFullRandomHand = (
//   deckCards: readonly GameCard[],
//   handCards: readonly GameCard[],
//   totalHandCount: number
// ): readonly GameCard[] => {
//   if (handCards.length >= totalHandCount) return handCards
//   if (deckCards.length === 0) return handCards

//   const randomCardIndex: number = Math.floor(Math.random() * deckCards.length)
//   return getFullRandomHand(
//     [
//       ...deckCards.slice(0, randomCardIndex),
//       ...deckCards.slice(randomCardIndex + 1)
//     ],
//     [...handCards, deckCards[randomCardIndex]],
//     totalHandCount
//   )
// }

export const getInitLocalGameState = (
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
    gameState.enemyDeckCards,
    gameState.enemyHand,
    initCardAmount
  )
})

export const initRandomTurnState = (gameState: GameState): GameState => ({
  ...gameState,
  roundState: Math.random() > 0.5 ? 'PLAYER1_TURN' : 'PLAYER2_TURN'
})

export const endTurnState = (gameState: GameState): GameState => ({
  ...gameState,
  roundState:
    gameState.roundState === 'PLAYER1_TURN' ? 'PLAYER2_TURN' : 'PLAYER1_TURN'
})

export const passRoundState = (gameState: GameState): GameState => ({
  ...gameState,
  roundState:
    gameState.roundState === 'PLAYER1_TURN'
      ? 'PLAYER1_PASS_PLAYER2_TURN'
      : gameState.roundState === 'PLAYER2_TURN'
      ? 'PLAYER2_PASS_PLAYER1_TURN'
      : 'ROUND_END'
})

export const endRoundState = (gameState: GameState): GameState => ({
  ...gameState
})

// ? New file?
export const playCardState = (
  gameState: GameState,
  card: GameCard,
  selectedGroupId: string
): GameState => ({
  ...gameState,
  boardCards: [
    ...gameState.boardCards,
    card.placedCardTransformation(card, selectedGroupId)
  ],
  playerHand: gameState.playerHand.filter(c => c.id !== card.id)
})

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
  enemyHand: gameState.enemyHand.filter(c => c.id !== card.id),
  enemyCardsAmount: gameState.enemyCardsAmount - 1
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
        getInitLocalGameState(playerDeckCards, enemyDeckCards, boardLayout)
      ),
    initRandomPlayerHand: (initCardAmount: number) =>
      update((gameState: GameState) =>
        initRandomPlayerHandState(gameState, initCardAmount)
      ),
    initRandomEnemyHand: (initCardAmount: number) =>
      update((gameState: GameState) =>
        initRandomEnemyHandState(gameState, initCardAmount)
      ),
    initRandomTurn: () =>
      update((gameState: GameState) => initRandomTurnState(gameState)),
    endTurn: () => update((gameState: GameState) => endTurnState(gameState)),
    passRound: () =>
      update((gameState: GameState) => passRoundState(gameState)),
    playCard: (card: GameCard, selectedGroupId: string) =>
      update((gameState: GameState) =>
        playCardState(gameState, card, selectedGroupId)
      ),
    aiPlayCard: (card: GameCard, selectedGroupId: string) =>
      update((gameState: GameState) =>
        aiPlayCardState(gameState, card, selectedGroupId)
      )
  }
}

export const count = createGameState()
