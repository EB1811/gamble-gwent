import type {BoardLayout, PlacedCard} from '../gameTypes'
import tempData from '../../tempData.json'
import {CARD_CLASS, CARD_TYPE} from '../../constants'
import getPlayerCards from './getPlayerCards'

const getPlayerDiscardCards = (
  board: BoardLayout,
  placedCards: readonly PlacedCard[],
  playerNo: 1 | 2
): readonly PlacedCard[] => {
  const playerCards: readonly PlacedCard[] = getPlayerCards(
    board,
    placedCards,
    playerNo
  )

  // TODO: Weather cards + card onRemovedEffects

  return playerCards
}

export default getPlayerDiscardCards

if (import.meta.vitest) {
  const {describe, it, afterEach, expect, vi} = import.meta.vitest

  const defaultBoardLayout = tempData.StandardBoardLayout as BoardLayout
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

  describe('getPlayerStrength', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it(`Should return the sum of each card in each group belonging to the given player including global modifiers.`, () => {
      const placedCards: readonly PlacedCard[] = [
        {...samplePlacedCard, class: 'RANGED', id: '1', groupId: '2'},
        {...samplePlacedCard, class: 'MELEE', id: '2', groupId: '1'},
        {...samplePlacedCard, class: 'RANGED', id: '3', groupId: '4'},
        {
          ...samplePlacedCard,
          id: '4',
          type: CARD_TYPE.WEATHER,
          class: CARD_CLASS.WEATHER,
          groupId: '7',
          modifier: (placedCard: PlacedCard) =>
            placedCard.class === 'RANGED'
              ? {...placedCard, strength: 1}
              : placedCard
        }
      ]

      const discardCards: readonly PlacedCard[] = getPlayerDiscardCards(
        defaultBoardLayout,
        placedCards,
        1
      )

      expect(discardCards.length).toEqual(2)
    })
  })
}
