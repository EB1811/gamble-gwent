import {CARD_CLASS} from '../constants'
import type {Card} from '../types'
import type {
  BoardLayout,
  DiscardedCard,
  GameCard,
  GetPlaceablePositions,
  PlacedCard,
  PlacedCardTransformation,
  RemovedCardTransformation
} from './gameTypes'
import tempData from '../tempData.json'
import type {GameState} from './gameStateStore'

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
  (overrides?: Partial<DiscardedCard>): RemovedCardTransformation =>
  ({
    groupId,
    modifiable,
    removedCardTransformation,
    ...gameCard
  }: PlacedCard) => ({...gameCard, playable: true, ...overrides})

export const getGenericPlacedCardTransformation =
  (overrides?: Partial<PlacedCard>): PlacedCardTransformation =>
  (gameCard: GameCard, selectedGroupId: string) => ({
    ...gameCard,
    groupId: selectedGroupId,
    modifiable: gameCard.type.includes('HERO') ? false : true,
    removedCardTransformation: getGenericRemovedCardTransformation(),
    ...overrides
  })

const gameCardsMap = new Map<string, (card: Card) => GameCard>()

// Basic Unit Cards.
tempData.cards.forEach(card =>
  gameCardsMap.set(card.id, (card: Card) => ({
    ...card,
    getPlaceablePositions: getDefaultUnitPlaceablePositions(card.class),
    placedCardTransformation: getGenericPlacedCardTransformation()
  }))
)

// Weather Cards.
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

// Modifier Cards.
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

// Played Effect Cards.
gameCardsMap.set('20-scorch', (card: Card) => ({
  ...card,
  getPlaceablePositions: () => ['NONE'],
  placedCardTransformation: (gameCard: GameCard) => ({
    ...gameCard,
    removedCardTransformation: getGenericRemovedCardTransformation({
      playable: false
    })
  }),
  onPlayedEffect: (
    gameState: GameState,
    playerNo?: number,
    playedCard?: GameCard
  ) => {
    const strongestCard: PlacedCard = gameState.boardCards
      .filter(c => c.strength)
      .sort((a, b) => (a.strength! > b.strength! ? -1 : 1))[0]
    const isStrongestPlayerCard: boolean = gameState.boardLayout.player1.some(
      bg => bg.id === strongestCard.groupId
    )

    // TODO: Create function for this.
    // TODO: onRemovedEffect.

    const postEffectGameState: GameState = {
      ...gameState,
      boardCards: gameState.boardCards.filter(c => c.id !== strongestCard.id),
      ...(isStrongestPlayerCard
        ? {
            playerDiscard: [
              ...gameState.playerDiscard,
              strongestCard.removedCardTransformation(strongestCard)
            ]
          }
        : {
            enemyDiscard: [
              ...(gameState.enemyDiscard ?? []),
              strongestCard.removedCardTransformation(strongestCard)
            ]
          })
    }

    return {
      ...postEffectGameState,
      ...(playerNo === 1
        ? {
            playerHand: postEffectGameState.playerHand.filter(
              c => c.id !== card.id
            ),
            playerDiscard: playedCard
              ? [
                  ...gameState.playerDiscard,
                  {...playedCard, playable: false} as DiscardedCard
                ]
              : gameState.playerDiscard
          }
        : {
            enemyHand: postEffectGameState.enemyHand?.filter(
              c => c.id !== card.id
            ),
            enemyDiscard: playedCard
              ? [
                  ...(gameState.enemyDiscard ?? []),
                  {...playedCard, playable: false} as DiscardedCard
                ]
              : gameState.enemyDiscard
          })
    }
  }
}))

export default gameCardsMap
