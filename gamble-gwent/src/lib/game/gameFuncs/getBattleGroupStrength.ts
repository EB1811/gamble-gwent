import type {GameCard, PlacedCard} from '../gameTypes'
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
