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
  (): RemovedCardTransformation => (placedCard: PlacedCard) => {
    const {groupId, modifiable, removedCardTransformation, ...gameCard} =
      placedCard

    return gameCard
  }

export const getGenericPlacedCardTransformation =
  (
    placedCardUniqueProperties: Pick<PlacedCard, 'modifiable'>
  ): PlacedCardTransformation =>
  (gameCard: GameCard, selectedGroupId: string) => ({
    ...placedCardUniqueProperties,
    ...gameCard,
    groupId: selectedGroupId,
    removedCardTransformation: getGenericRemovedCardTransformation()
  })

const gameCardsMap = new Map<string, (card: Card) => GameCard>()

gameCardsMap.set('1-pikachu', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: false
  })
}))
gameCardsMap.set('2-charizard', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: false
  })
}))
gameCardsMap.set('3-squirtle', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: true
  })
}))
gameCardsMap.set('4-bulbasaur', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: true
  })
}))
gameCardsMap.set('5-gengar', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: true
  })
}))
gameCardsMap.set('6-rain', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: true
  }),
  modifier: (_, otherCard: PlacedCard) =>
    otherCard.modifiable && otherCard.class === CARD_CLASS.SIEGE
      ? {...otherCard, strength: 1}
      : otherCard
}))
gameCardsMap.set('7-arcanine', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: true
  })
}))
gameCardsMap.set('8-pidgey', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: true
  })
}))
gameCardsMap.set('9-pidgeotto', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: true
  })
}))
gameCardsMap.set('10-rattata', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: true
  })
}))
gameCardsMap.set('11-meowth', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: false
  })
}))
gameCardsMap.set('12-beedrill', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: true
  })
}))
gameCardsMap.set('13-blizzard', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: true
  }),
  modifier: (_, otherCard: PlacedCard) =>
    otherCard.modifiable && otherCard.class === CARD_CLASS.MELEE
      ? {...otherCard, strength: 1}
      : otherCard
}))
gameCardsMap.set('14-fog', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: true
  }),
  modifier: (_, otherCard: PlacedCard) =>
    otherCard.modifiable && otherCard.class === CARD_CLASS.RANGED
      ? {...otherCard, strength: 1}
      : otherCard
}))
gameCardsMap.set('15-venusaur', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: true
  })
}))
gameCardsMap.set('16-jigglypuff', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: true
  })
}))
gameCardsMap.set('17-lucario', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: true
  })
}))
gameCardsMap.set('18-snorlax', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: true
  })
}))
gameCardsMap.set('19-psyduck', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: false
  }),
  modifier: (modifierCard: PlacedCard, otherCard: PlacedCard) =>
    otherCard.modifiable &&
    modifierCard.id !== otherCard.id &&
    otherCard.groupId === modifierCard.groupId &&
    otherCard.strength
      ? {...otherCard, strength: otherCard.strength * 2}
      : otherCard
}))
gameCardsMap.set('20-piplup', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: true
  })
}))

export default gameCardsMap
