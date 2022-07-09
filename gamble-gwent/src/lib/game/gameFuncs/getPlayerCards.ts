import type {BoardLayout, PlacedCard} from '../gameTypes'

const getPlayerCards = (
  board: BoardLayout,
  placedCards: readonly PlacedCard[],
  playerNo: 1 | 2
): readonly PlacedCard[] =>
  Object.entries(board).reduce<readonly PlacedCard[]>(
    (boardAcc, [_, groups]) => [
      ...boardAcc,
      ...groups
        .filter(g => g.ownerPlayerNo === playerNo)
        .reduce<readonly PlacedCard[]>(
          (groupAcc, group) => [
            ...groupAcc,
            ...placedCards.filter(c => c.groupId === group.id)
          ],
          []
        )
    ],
    []
  )

export default getPlayerCards
