import {CARD_CLASS, CARD_TYPE} from '../../constants'
import type {PlacedCard} from '../gameTypes'
import getCardStrength from './getCardStrength'

const getBattleGroupStrength = (
  groupCards: readonly PlacedCard[],
  globalModifierCards: readonly PlacedCard[]
): number =>
  groupCards.reduce<number>(
    (acc, card) =>
      acc +
      getCardStrength(card, [
        ...globalModifierCards,
        ...groupCards.filter(c => c.id !== card.id && c.modifier)
      ]),
    0
  )

export default getBattleGroupStrength

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
    placedCardTransformation: vi.fn(),
    groupId: '1',
    modifiable: true,
    removedCardTransformation: vi.fn()
  }

  describe('getBattleGroupStrength', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it(`Should return the sum of the group cards including global modifiers.`, () => {
      const groupCards: readonly PlacedCard[] = [
        {...samplePlacedCard, id: '1'},
        {...samplePlacedCard, id: '2'},
        {...samplePlacedCard, id: '2'}
      ]
      const globalModifierCards: readonly PlacedCard[] = [
        {
          ...samplePlacedCard,
          id: '3',
          type: CARD_TYPE.WEATHER,
          class: CARD_CLASS.WEATHER,
          modifier: (placedCard: PlacedCard) => ({...placedCard, strength: 1})
        }
      ]

      const groupStrength = getBattleGroupStrength(
        groupCards,
        globalModifierCards
      )

      expect(groupStrength).toEqual(3)
    })
  })
}
