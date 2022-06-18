import type {CARD_CLASS} from '../constants'
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
    modifiable: true
  })
}))
gameCardsMap.set('2-charizard', (card: Card) => ({
  ...card,
  getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
  placedCardTransformation: getGenericPlacedCardTransformation({
    modifiable: true
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

export default gameCardsMap
