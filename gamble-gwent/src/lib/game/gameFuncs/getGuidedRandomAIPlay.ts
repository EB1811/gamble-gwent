import {CARD_CLASS, ROUND_STATES, ROUND_STATE_ACTION} from '../../constants'
import type {
  AIPlay,
  BoardLayout,
  GameCard,
  GetAIPlay,
  PlacedCard,
  RelevantGameInfo
} from '../gameTypes'
import getCardStrength from './getCardStrength'
import getModifierCardStrengthDiff from './getModifierCardStrengthDiff'
import getPlayerBoardCards from './getPlayerBoardCards'
import getPlayerCards from './getPlayerCards'

// TODO: ai === if statements
const getRandomAIPlay: GetAIPlay = (
  playerNo: 1 | 2,
  board: BoardLayout,
  aiCards,
  {
    roundState,
    aiLives,
    aiStrength,
    playerStrength,
    playerHandLength,
    boardCards
  }: RelevantGameInfo
): AIPlay => {
  if (roundState.includes('PASS') && aiStrength > playerStrength)
    return {action: ROUND_STATE_ACTION.passTurn}
  if (aiCards.length <= 0) return {action: ROUND_STATE_ACTION.passTurn}

  const placedWeatherCards: readonly PlacedCard[] = boardCards.filter(
    c => c.class === CARD_CLASS.WEATHER
  )
  const nonAffectedCards: readonly GameCard[] = aiCards.filter(
    c =>
      getCardStrength(c.placedCardTransformation(c, '0'), placedWeatherCards) >=
      (c.strength ?? 0)
  )
  if (aiLives > 1 && nonAffectedCards.length <= 0)
    return {action: ROUND_STATE_ACTION.passTurn}

  // const enemyBoardCards: readonly PlacedCard[] = getPlayerBoardCards(
  //   board,
  //   boardCards,
  //   playerNo === 1 ? 2 : 1
  // )

  // ? Experiments
  // 42% -> 61%
  // if (aiLives > 1 && Math.random() > 0.99)
  //   return {action: ROUND_STATE_ACTION.passTurn}

  // ? equation to also take into account enemy cards amount.
  if (
    aiLives > 1 &&
    aiStrength < playerStrength &&
    aiCards.length > 2 &&
    aiCards.length > playerHandLength
  ) {
    if (aiStrength + 5 < playerStrength && Math.random() > 0.95)
      return {action: ROUND_STATE_ACTION.passTurn}
    if (aiStrength + 10 < playerStrength && Math.random() > 0.9)
      return {action: ROUND_STATE_ACTION.passTurn}
    else if (aiStrength + 15 < playerStrength && Math.random() > 0.85)
      return {action: ROUND_STATE_ACTION.passTurn}
    else if (aiStrength + 18 < playerStrength && Math.random() > 0.5)
      return {action: ROUND_STATE_ACTION.passTurn}
    else if (aiStrength + 20 < playerStrength && Math.random() > 0.2)
      return {action: ROUND_STATE_ACTION.passTurn}
    else if (aiStrength + 25 < playerStrength && Math.random() > 0.1)
      return {action: ROUND_STATE_ACTION.passTurn}
    // const sortedByStrengthCards: readonly GameCard[] = [...aiCards].sort(
    //   (c1, c2) =>
    //     getCardStrength(
    //       c1.placedCardTransformation(c1, '0'),
    //       placedWeatherCards
    //     ) >
    //     getCardStrength(
    //       c2.placedCardTransformation(c2, '0'),
    //       placedWeatherCards
    //     )
    //       ? -1
    //       : 1
    // )

    // // ! FOR NOW
    // let cardsNeededToWin: number = 0
    // let remainingStrength: number = playerStrength - aiStrength
    // let index: number = 0
    // while (remainingStrength > 0 && cardsNeededToWin < 3) {
    //   cardsNeededToWin += 1
    //   index += 1
    //   remainingStrength -= sortedByStrengthCards[index]
    //     ? getCardStrength(
    //         sortedByStrengthCards[index].placedCardTransformation(
    //           sortedByStrengthCards[index],
    //           '0'
    //         ),
    //         placedWeatherCards
    //       )
    //     : 0
    // }
    // if (cardsNeededToWin >= 3) return {action: ROUND_STATE_ACTION.passTurn}
  }

  // ? equation to also take into account enemy cards amount?
  // 87.4
  if (
    aiLives > 1 &&
    aiStrength > playerStrength &&
    aiCards.length > playerHandLength
  ) {
    if (aiStrength > playerStrength && Math.random() > 0.95)
      return {action: ROUND_STATE_ACTION.passTurn}
    else if (aiStrength > playerStrength + 5 && Math.random() > 0.75)
      return {action: ROUND_STATE_ACTION.passTurn}
    else if (aiStrength > playerStrength + 10 && Math.random() > 0.25)
      return {action: ROUND_STATE_ACTION.passTurn}
    else if (aiStrength > playerStrength + 15 && Math.random() > 0.05)
      return {action: ROUND_STATE_ACTION.passTurn}
  }

  const playerPlacedCards: readonly PlacedCard[] = getPlayerCards(
    board,
    boardCards,
    playerNo
  )
  const enemyPlacedCards: readonly PlacedCard[] = getPlayerCards(
    board,
    boardCards,
    playerNo === 1 ? 2 : 1
  )

  const filteredModifierCards: readonly GameCard[] = (
    nonAffectedCards.length > 0 ? nonAffectedCards : aiCards
  ).filter(card => {
    if (card.modifier) {
      const a = getModifierCardStrengthDiff(card, [
        ...playerPlacedCards
        // ...aiCards
        //   .filter(c => c.id !== card.id)
        //   .map(c => c.placedCardTransformation(c, '0'))
      ])
      const b = getModifierCardStrengthDiff(card, enemyPlacedCards)

      // console.log('a mod card ->', {card})
      // console.log('a cards ->', [
      //   ...getPlayerCards(board, boardCards, playerNo),
      //   ...aiCards
      //     .filter(c => c.id !== card.id)
      //     .map(c => c.placedCardTransformation(c, '0'))
      // ])
      // console.log({a}, {b})
      // console.log(a - b >= 0)

      return a - b >= 0
    } else {
      return true
    }
  })
  if (aiLives > 1 && filteredModifierCards.length <= 0)
    return {action: ROUND_STATE_ACTION.passTurn}

  // const filteredHandCards: readonly GameCard[] =
  //   filteredModifierCards.length > 0 ? filteredModifierCards : aiCards

  // console.log('filteredModifierCards --->', {filteredModifierCards})

  const chosenCard: GameCard | undefined =
    filteredModifierCards.length > 0
      ? filteredModifierCards[
          Math.floor(Math.random() * filteredModifierCards.length)
        ]
      : aiCards[Math.floor(Math.random() * aiCards.length)]

  // const chosenCard: GameCard | undefined =
  //   nonAffectedCards.length > 0
  //     ? nonAffectedCards[
  //         Math.floor(Math.random() * nonAffectedCards.length)
  //       ]
  //     : aiCards[Math.floor(Math.random() * aiCards.length)]

  if (!chosenCard) return {action: ROUND_STATE_ACTION.passTurn}

  const placeablePositions: readonly string[] =
    chosenCard.getPlaceablePositions(board, playerNo)
  if (placeablePositions.length <= 0)
    return {action: ROUND_STATE_ACTION.passTurn}

  const positionId: string =
    placeablePositions[Math.floor(Math.random() * placeablePositions.length)]

  return {
    action: ROUND_STATE_ACTION.nextTurn,
    card: chosenCard,
    positionId
  }
}

export default getRandomAIPlay
