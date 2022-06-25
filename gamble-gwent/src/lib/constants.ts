export type GROUP =
  | 'PLAYER1_MELEE'
  | 'PLAYER1_RANGED'
  | 'PLAYER1_SIEGE'
  | 'PLAYER2_MELEE'
  | 'PLAYER2_RANGED'
  | 'PLAYER2_SIEGE'

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

export type ROUND_STATES =
  | 'INITIAL'
  | 'PLAYER1_TURN'
  | 'PLAYER2_TURN'
  | 'PLAYER1_PASS_PLAYER2_TURN'
  | 'PLAYER2_PASS_PLAYER1_TURN'
  | 'ROUND_END'
