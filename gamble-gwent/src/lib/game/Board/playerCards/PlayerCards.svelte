<script lang="ts">
  import Card from './card/Card.svelte'
  import {gameState} from '../../gameStateStore'
</script>

<div class="mx-auto flex max-w-4xl border-2">
  {#each $gameState.playerHand as card}
    <div class="m-3 border-2">
      <h2>
        <Card {card} />
      </h2>
    </div>
    <hr />
  {/each}
</div>
