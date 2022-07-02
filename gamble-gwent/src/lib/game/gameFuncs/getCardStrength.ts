import type {PlacedCard} from '../gameTypes'
import {CARD_TYPE} from '../../constants'

// * Need to keep in mind modifier order, WEATHER > Other.
// * Other order is not important.
const getCardStrength = (
  card: PlacedCard,
  modifierCards: readonly PlacedCard[]
): number => {
  const cardPostWeatherModifiers: PlacedCard = modifierCards
    .filter(card => card.class === CARD_TYPE.WEATHER)
    .reduce((acc, mCard) => mCard.modifier?.(acc) ?? acc, card)

  const cardPostOtherModifiers: PlacedCard = modifierCards
    .filter(card => card.class !== CARD_TYPE.WEATHER)
    .reduce(
      (acc, mCard) => mCard.modifier?.(acc) ?? acc,
      cardPostWeatherModifiers
    )

  return cardPostOtherModifiers.strength ?? 0
}

export default getCardStrength
