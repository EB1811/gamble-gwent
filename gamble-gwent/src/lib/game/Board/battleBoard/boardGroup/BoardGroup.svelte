<script lang="ts">
  import getBattleGroupStrength from '../../../gameFuncs/getBattleGroupStrength'
  import getCardStrength from '../../../gameFuncs/getCardStrength'
  import {gameState} from '../../../gameStateStore'
  import type {BattleGroup, PlacedCard} from '../../../gameTypes'
  import {battleBoardState} from '../battleBoardStore'

  export let boardGroup: BattleGroup

  let groupCards: readonly PlacedCard[]
  $: groupCards = $gameState.boardCards.filter(
    card => card.groupId === boardGroup.id
  )

  let groupStrength: number = 0
  $: groupStrength = getBattleGroupStrength(
    groupCards,
    $gameState.boardCards.filter(card => card.class === 'WEATHER')
  )

  const handleDragOver = (e: DragEvent, groupId: string) => {
    if ($battleBoardState.placeablePosition.includes(groupId))
      e.preventDefault()
  }

  const handleDragDrop = (e: DragEvent, groupId: string): void => {
    e.preventDefault()

    const placedCardId: string | undefined = e.dataTransfer?.getData('cardId')
    if (placedCardId) {
      gameState.playCard(placedCardId, groupId)
      gameState.endTurn()
    }
    battleBoardState.setPlaceablePosition([])

    console.log('after playCard state', $gameState)
  }
</script>

<div class="flex">
  {#if !['WEATHER'].includes(boardGroup.classType)}
    <h2 class="my-auto p-1">{groupStrength}</h2>
  {/if}
  <div
    class="flex-grow"
    class:bg-gray-300={$battleBoardState.placeablePosition.includes(
      boardGroup.id
    )}
    on:dragover={e => handleDragOver(e, boardGroup.id)}
    on:drop={e => handleDragDrop(e, boardGroup.id)}
  >
    <h2 class="m-auto">
      {boardGroup.classType}
    </h2>
    <div class="flex">
      {#each groupCards as card}
        <div class="m-2 h-20 w-20 border-2">
          <h2>{card.name}</h2>
          {#if card.strength}
            <h2
              class:text-rose-600={getCardStrength(
                card,
                $gameState.boardCards.filter(card => card.class === 'WEATHER')
              ) !== card.strength}
            >
              {getCardStrength(
                card,
                $gameState.boardCards.filter(card => card.class === 'WEATHER')
              )}
            </h2>
          {/if}
        </div>
      {/each}
    </div>
  </div>
  <hr />
</div>
