<script lang="ts">
  import {gameState} from '../../gameStateStore'
  import BattleGroup from './boardGroup/BoardGroup.svelte'
  import {battleBoardState} from './battleBoardStore'
  import type {GameCard} from '../../gameTypes'

  const handleDragOver = (e: DragEvent) => {
    if ($battleBoardState.placeablePosition.includes('NONE')) e.preventDefault()
  }

  const handleDragDrop = (e: DragEvent): void => {
    e.preventDefault()

    const placedCardId: string | undefined = e.dataTransfer?.getData('cardId')
    const placeCard: GameCard | undefined = $gameState.playerHand.find(
      card => card.id === placedCardId
    )
    if (placeCard?.onPlayedEffect) {
      gameState.playCardEffect(placeCard, placeCard?.onPlayedEffect)
      gameState.endTurn()
    }
    battleBoardState.setPlaceablePosition([])

    console.log('after playCard state', $gameState)
  }
</script>

<!-- TODO: Turn into css grid -->
<div
  class="mx-auto flex max-w-4xl border-2"
  style="width: 720px"
  class:bg-gray-300={$battleBoardState.placeablePosition.includes('NONE')}
  on:dragover={e => handleDragOver(e)}
  on:drop={e => handleDragDrop(e)}
>
  <div class="my-auto flex border-2">
    {#each $gameState.boardLayout.globalModifiers as sideGroup}
      <BattleGroup boardGroup={sideGroup} />
    {/each}
  </div>

  <div class="ml-auto flex flex-grow flex-col border-2 ">
    <div class="border-2">
      {#each [...$gameState.boardLayout.player2].reverse() as battleGroup}
        <BattleGroup boardGroup={battleGroup} />
      {/each}
    </div>

    <div class="border-2">
      {#each $gameState.boardLayout.player1 as battleGroup}
        <BattleGroup boardGroup={battleGroup} />
      {/each}
    </div>
  </div>
</div>
