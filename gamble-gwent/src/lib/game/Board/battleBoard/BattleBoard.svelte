<script lang="ts">
  import {gameState} from '../../gameStateStore'
  import BattleGroup from './boardGroup/BoardGroup.svelte'
</script>

<!-- TODO: Turn into css grid -->
<div class="mx-auto flex max-w-4xl border-2" style="width: 720px">
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
