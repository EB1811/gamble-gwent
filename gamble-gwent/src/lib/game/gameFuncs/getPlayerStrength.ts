import {CARD_CLASS, CARD_TYPE} from '../../constants'
import type {BoardLayout, PlacedCard} from '../gameTypes'
import getBattleGroupStrength from './getBattleGroupStrength'
import tempData from '../../tempData.json'

const getPlayerStrength = (
  board: BoardLayout,
  playedCards: readonly PlacedCard[],
  playerNo: 1 | 2
): number =>
  Object.entries(board).reduce<number>(
    (boardAcc, [_, groups]) =>
      boardAcc +
      groups
        .filter(g => g.ownerPlayerNo === playerNo)
        .reduce<number>(
          (groupAcc: number, group) =>
            groupAcc +
            getBattleGroupStrength(
              playedCards.filter(c => c.groupId === group.id),
              playedCards.filter(c => c.class === CARD_CLASS.WEATHER)
            ),
          0
        ),
    0
  )

export default getPlayerStrength

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
        {...samplePlacedCard, class: 'RANGED', id: '3', groupId: '2'},
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

      const groupStrength = getPlayerStrength(
        defaultBoardLayout,
        placedCards,
        1
      )

      expect(groupStrength).toEqual(7)
    })
  })
}
