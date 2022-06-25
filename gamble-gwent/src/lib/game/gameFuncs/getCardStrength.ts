import type {PlacedCard} from '../gameTypes'
import {CARD_TYPE} from '../../constants'

// * Need to keep in mind modifier order, WEATHER > Other.
// * Other order is not important.
const getCardStrength = (
  card: PlacedCard,
  modifierCards: readonly PlacedCard[]
): number => {
  const cardPostWeatherModifiers: PlacedCard = modifierCards
    .filter(card => card.type === CARD_TYPE.WEATHER)
    .reduce((acc, mCard) => mCard.modifier(acc), card)

  const cardPostOtherModifiers: PlacedCard = modifierCards
    .filter(card => card.type !== CARD_TYPE.WEATHER)
    .reduce((acc, mCard) => mCard.modifier(acc), cardPostWeatherModifiers)

  return cardPostOtherModifiers.strength
}

export default getCardStrength