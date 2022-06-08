import { writable, Writable, Subscriber } from 'svelte/store'
import type { Board, Card } from './gameTypes'

export type GameState = {
  readonly player1Deck: readonly Card[]
  readonly player1Hand: readonly Card[]
  readonly player1Discard: readonly Card[]
  
  readonly player2Deck: readonly Card[]
  readonly player2Hand: readonly Card[]
  readonly player2Discard: readonly Card[]
  
  readonly board: Board
}