import {getGenericPlacedCardTransformation} from '../gameCardsMap'
import type {GameCard, PlacedCard} from '../gameTypes'
import getCardStrength from './getCardStrength'

const getModifierCardStrengthDiff = (
  modifierCard: GameCard,
  placedCards: readonly PlacedCard[]
): number =>
  placedCards.reduce<number>((acc, card) => {
    const preWeatherStrength = getCardStrength(
      card,
      placedCards.filter(c => c.modifier)
    )
    const postWeatherStrength = getCardStrength(card, [
      ...placedCards.filter(c => c.modifier),
      modifierCard.placedCardTransformation(modifierCard, '0')
    ])

    return acc + (postWeatherStrength - preWeatherStrength)
  }, 0)

export default getModifierCardStrengthDiff

if (import.meta.vitest) {
  const {describe, it, afterEach, expect, vi} = import.meta.vitest

  const samplePlacedCard: PlacedCard = {
    id: '1',
    name: 'Pikachu',
    desc: 'Pikachu',
    deckId: '1',
    class: 'RANGED',
    type: 'UNIT',
    strength: 5,
    getPlaceablePositions: vi.fn(),
    placedCardTransformation: getGenericPlacedCardTransformation(),
    groupId: '1',
    modifiable: true,
    removedCardTransformation: vi.fn()
  }

  describe('getModifierCardStrengthDiff', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it(`Should return the sum of each card in each group belonging to the given player including global modifiers.`, () => {
      const placedCards: readonly PlacedCard[] = [
        {...samplePlacedCard, class: 'RANGED', id: '1', groupId: '2'},
        {...samplePlacedCard, class: 'MELEE', id: '2', groupId: '1'},
        {...samplePlacedCard, class: 'RANGED', id: '3', groupId: '2'}
      ]

      const modifierCard: GameCard = {
        ...samplePlacedCard,
        modifier: (_, otherCard: PlacedCard) => ({...otherCard, strength: 1})
      }

      const strengthDiff: number = getModifierCardStrengthDiff(
        modifierCard,
        placedCards
      )

      expect(strengthDiff).toEqual(-12)
    })
  })
}
