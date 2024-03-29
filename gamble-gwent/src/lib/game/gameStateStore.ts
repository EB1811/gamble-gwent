import {writable} from 'svelte/store'
import {ROUND_STATES, ROUND_STATE_ACTION} from '../constants'
import getFullRandomHand from './gameFuncs/getFullRandomHand'
import getNextRoundState from './gameFuncs/getNextRoundState'
import getPlayerDiscardCards from './gameFuncs/getPlayerDiscardCards'
import type {
  BoardLayout,
  DiscardedCard,
  GameCard,
  GameEffect,
  PlacedCard
} from './gameTypes'

export type GameState = {
  readonly playerDeckCards: readonly GameCard[]
  readonly playerHand: readonly GameCard[]
  readonly playerDiscard: readonly DiscardedCard[]

  readonly enemyCardsAmount: number
  readonly enemyDeckCards?: readonly GameCard[]
  readonly enemyHand?: readonly GameCard[]
  readonly enemyDiscard?: readonly DiscardedCard[]

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
  ...gameState,
  boardCards: [],
  playerDiscard: [
    ...gameState.playerDiscard,
    ...getPlayerDiscardCards(gameState.boardLayout, gameState.boardCards, 1)
  ],
  enemyDiscard: [
    ...(gameState.enemyDiscard ?? []),
    ...getPlayerDiscardCards(gameState.boardLayout, gameState.boardCards, 2)
  ]
})

// ? New file?
export const placeCardState = (
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

export const playCardEffectState = (
  gameState: GameState,
  card: GameCard,
  playerNo: number,
  cardGameEffect: GameEffect
): GameState => cardGameEffect(gameState, playerNo, card)

export const aiPlaceCardState = (
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

// export const playCardState = (
//   gameState: GameState,
//   card: GameCard,
//   playerNo: number,
//   selectedGroupId?: string
// ): GameState => {
//   if(selectedGroupId) {
//     return placeCardState(gameState, card, selectedGroupId)
//   }
// }

// export const postAIPlayState = (gameState: GameState, play: AIPlay): GameState => ({})

export const playerRoundWinnerState = (gameState: GameState): GameState => ({
  ...gameState,
  playerPoints: gameState.playerPoints + 1
})

export const aiRoundWinnerState = (gameState: GameState): GameState => ({
  ...gameState,
  enemyPoints: gameState.enemyPoints + 1
})

export const roundDrawState = (gameState: GameState): GameState => ({
  ...gameState,
  playerPoints: gameState.playerPoints + 1,
  enemyPoints: gameState.enemyPoints + 1
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
    endRound: () => update((gameState: GameState) => endRoundState(gameState)),

    placeCard: (card: GameCard, selectedGroupId: string) =>
      update((gameState: GameState) =>
        placeCardState(gameState, card, selectedGroupId)
      ),
    aiPlaceCard: (card: GameCard, selectedGroupId: string) =>
      update((gameState: GameState) =>
        aiPlaceCardState(gameState, card, selectedGroupId)
      ),
    playCardEffect: (
      card: GameCard,
      playerNo: number,
      cardEffect: GameEffect
    ) =>
      update((gameState: GameState) =>
        playCardEffectState(gameState, card, playerNo, cardEffect)
      ),

    playerRoundWinner: () =>
      update((gameState: GameState) => playerRoundWinnerState(gameState)),
    aiRoundWinner: () =>
      update((gameState: GameState) => aiRoundWinnerState(gameState)),
    roundDraw: () => update((gameState: GameState) => roundDrawState(gameState))
  }
}

export const gameState = createGameState()
