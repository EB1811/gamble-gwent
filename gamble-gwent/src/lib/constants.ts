// export enum CARD_DECK {}

export type GROUP =
  | 'PLAYER1_MELEE'
  | 'PLAYER1_RANGED'
  | 'PLAYER1_SIEGE'
  | 'PLAYER2_MELEE'
  | 'PLAYER2_RANGED'
  | 'PLAYER2_SIEGE'

export type BOARD_POSITION = 'MELEE' | 'RANGED' | 'SIEGE' | 'WEATHER'

export type CARD_CLASS = 'MELEE' | 'RANGED' | 'SIEGE' | 'WEATHER'

export type CARD_TYPE = 'UNIT' | 'HERO_UNIT' | 'SPY' | 'HERO_SPY' | 'WEATHER'
