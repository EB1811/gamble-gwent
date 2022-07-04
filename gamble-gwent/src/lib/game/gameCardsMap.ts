import {CARD_CLASS} from '../constants'
import type {Card} from '../types'
import type {
  BoardLayout,
  GameCard,
  GetPlaceablePositions,
  PlacedCard,
  PlacedCardTransformation,
  RemovedCardTransformation
} from './gameTypes'
import tempData from '../tempData.json'

export const getDefaultUnitPlaceablePositions =
  (cardClass: CARD_CLASS): GetPlaceablePositions =>
  ({player1, player2, globalModifiers}: BoardLayout, playerNo: number) =>
    [
      ...player1
        .filter(
          bg => bg.classType === cardClass && bg.ownerPlayerNo === playerNo
        )
        .map(bg => bg.id),
      ...player2
        .filter(
          bg => bg.classType === cardClass && bg.ownerPlayerNo === playerNo
        )
        .map(bg => bg.id),
      ...globalModifiers
        .filter(sg => sg.classType === cardClass)
        .map(sg => sg.id)
    ]

export const getGenericRemovedCardTransformation =
  (overloads?: Partial<GameCard>): RemovedCardTransformation =>
  ({
    groupId,
    modifiable,
    removedCardTransformation,
    ...gameCard
  }: PlacedCard) => ({...gameCard, ...overloads})

export const getGenericPlacedCardTransformation =
  (overloads?: Partial<PlacedCard>): PlacedCardTransformation =>
  (gameCard: GameCard, selectedGroupId: string) => ({
    ...gameCard,
    groupId: selectedGroupId,
    modifiable: gameCard.type.includes('HERO') ? false : true,
    removedCardTransformation: getGenericRemovedCardTransformation(),
    ...overloads
  })

const gameCardsMap = new Map<string, (card: Card) => GameCard>()

tempData.cards.forEach(card =>
  gameCardsMap.set(card.id, (card: Card) => ({
    ...card,
    getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
    placedCardTransformation: getGenericPlacedCardTransformation()
  }))
)

gameCardsMap.set('6-rain', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation(),
  modifier: (_, otherCard: PlacedCard) =>
    otherCard.modifiable && otherCard.class === CARD_CLASS.SIEGE
      ? {...otherCard, strength: 1}
      : otherCard
}))
gameCardsMap.set('13-blizzard', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation(),
  modifier: (_, otherCard: PlacedCard) =>
    otherCard.modifiable && otherCard.class === CARD_CLASS.MELEE
      ? {...otherCard, strength: 1}
      : otherCard
}))
gameCardsMap.set('14-fog', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation(),
  modifier: (_, otherCard: PlacedCard) =>
    otherCard.modifiable && otherCard.class === CARD_CLASS.RANGED
      ? {...otherCard, strength: 1}
      : otherCard
}))
gameCardsMap.set('19-psyduck', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation(),
  modifier: (modifierCard: PlacedCard, otherCard: PlacedCard) =>
    otherCard.modifiable &&
    modifierCard.id !== otherCard.id &&
    otherCard.groupId === modifierCard.groupId &&
    otherCard.strength
      ? {...otherCard, strength: otherCard.strength * 2}
      : otherCard
}))

export default gameCardsMap
