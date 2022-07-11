import type {BoardLayout, PlacedCard} from '../gameTypes'

const getPlayerBoardCards = (
  board: BoardLayout,
  boardCards: readonly PlacedCard[],
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
            ...boardCards.filter(c => c.groupId === group.id)
          ],
          []
        )
    ],
    []
  )

export default getPlayerBoardCards
