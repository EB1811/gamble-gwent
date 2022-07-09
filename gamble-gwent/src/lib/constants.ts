export type GROUP =
  | 'PLAYER_MELEE'
  | 'PLAYER_RANGED'
  | 'PLAYER_SIEGE'
  | 'ENEMY_MELEE'
  | 'ENEMY_RANGED'
  | 'ENEMY_SIEGE'

export const CARD_CLASS = {
  MELEE: 'MELEE' as 'MELEE',
  RANGED: 'RANGED' as 'RANGED',
  SIEGE: 'SIEGE' as 'SIEGE',
  WEATHER: 'WEATHER' as 'WEATHER'
}
export type CARD_CLASS = keyof typeof CARD_CLASS

export const CARD_TYPE = {
  UNIT: 'UNIT' as 'UNIT',
  HERO_UNIT: 'HERO_UNIT' as 'HERO_UNIT',
  SPY: 'SPY' as 'SPY',
  HERO_SPY: 'HERO_SPY' as 'HERO_SPY',
  WEATHER: 'WEATHER' as 'WEATHER'
}
export type CARD_TYPE = keyof typeof CARD_TYPE

export const ROUND_STATES = {
  INITIAL: 'INITIAL' as 'INITIAL',
  PLAYER_TURN: 'PLAYER_TURN' as 'PLAYER_TURN',
  ENEMY_TURN: 'ENEMY_TURN' as 'ENEMY_TURN',
  PLAYER_PASS_ENEMY_TURN: 'PLAYER_PASS_ENEMY_TURN' as 'PLAYER_PASS_ENEMY_TURN',
  ENEMY_PASS_PLAYER_TURN: 'ENEMY_PASS_PLAYER_TURN' as 'ENEMY_PASS_PLAYER_TURN',
  ROUND_END: 'ROUND_END' as 'ROUND_END'
}
export type ROUND_STATES = keyof typeof ROUND_STATES

export const ROUND_STATE_ACTION = {
  turnPlayer: 'turnPlayer' as 'turnPlayer',
  turnEnemy: 'turnEnemy' as 'turnEnemy',
  nextTurn: 'nextTurn' as 'nextTurn',
  passTurn: 'passTurn' as 'passTurn'
}
export type ROUND_STATE_ACTION = keyof typeof ROUND_STATE_ACTION
export const PLAYER_ROUND_STATE_ACTION = {
  nextTurn: 'nextTurn' as 'nextTurn',
  passTurn: 'passTurn' as 'passTurn'
}
export type PLAYER_ROUND_STATE_ACTION = keyof typeof PLAYER_ROUND_STATE_ACTION

export const ROUND_STATE_MACHINE: readonly {
  initial: ROUND_STATES
  next: ROUND_STATES
  action: ROUND_STATE_ACTION
}[] = [
  {
    initial: 'INITIAL',
    next: 'PLAYER_TURN',
    action: 'turnPlayer'
  },
  {
    initial: 'INITIAL',
    next: 'ENEMY_TURN',
    action: 'turnEnemy'
  },
  {
    initial: 'PLAYER_TURN',
    next: 'ENEMY_TURN',
    action: 'nextTurn'
  },
  {
    initial: 'ENEMY_TURN',
    next: 'PLAYER_TURN',
    action: 'nextTurn'
  },
  {
    initial: 'PLAYER_TURN',
    next: 'PLAYER_PASS_ENEMY_TURN',
    action: 'passTurn'
  },
  {
    initial: 'ENEMY_TURN',
    next: 'ENEMY_PASS_PLAYER_TURN',
    action: 'passTurn'
  },
  {
    initial: 'PLAYER_PASS_ENEMY_TURN',
    next: 'PLAYER_PASS_ENEMY_TURN',
    action: 'nextTurn'
  },
  {
    initial: 'PLAYER_PASS_ENEMY_TURN',
    next: 'ROUND_END',
    action: 'passTurn'
  },
  {
    initial: 'ENEMY_PASS_PLAYER_TURN',
    next: 'ENEMY_PASS_PLAYER_TURN',
    action: 'nextTurn'
  },
  {
    initial: 'ENEMY_PASS_PLAYER_TURN',
    next: 'ROUND_END',
    action: 'passTurn'
  }
]
