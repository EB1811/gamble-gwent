import type {GameCard} from '../gameTypes'

const getFullRandomHand = (
  deckCards: readonly GameCard[],
  handCards: readonly GameCard[],
  handCount: number
): readonly GameCard[] =>
  ((nextCardI: number = Math.floor(Math.random() * deckCards.length)) =>
    handCards.length >= handCount || deckCards.length === 0
      ? handCards
      : getFullRandomHand(
          [...deckCards.slice(0, nextCardI), ...deckCards.slice(nextCardI + 1)],
          [...handCards, deckCards[nextCardI]],
          handCount
        ))()

export default getFullRandomHand

if (import.meta.vitest) {
  const {describe, it, afterEach, expect, vi} = import.meta.vitest

  const sampleGameCard: GameCard = {
    id: '1-pikachu',
    name: 'Pikachu',
    desc: 'Pikachu',
    deckId: '1',
    class: 'RANGED',
    type: 'UNIT',
    strength: 5,
    getPlaceablePositions: vi.fn(),
    placedCardTransformation: vi.fn()
  }

  describe('getFullRandomHand', () => {
    afterEach(() => {
      vi.restoreAllMocks()
    })

    it(
      `Should return an array of GameCards randomly chosen from the given deck cards, ` +
        `with its size determined by the given hand count, if given no specified index of next chosen card.`,
      () => {
        vi.spyOn(global.Math, 'random').mockReturnValue(0.1)

        const deckCards: readonly GameCard[] = [
          {...sampleGameCard, id: '1'},
          {...sampleGameCard, id: '2'},
          {...sampleGameCard, id: '3'}
        ]

        const randomHand: readonly GameCard[] = getFullRandomHand(
          deckCards,
          [],
          2
        )

        expect(randomHand.length).toEqual(2)
        expect(randomHand[0].id).toEqual('1')
        expect(randomHand[1].id).toEqual('2')
      }
    )
  })
}
