<script lang="ts">
  import Card from '../playerCards/card/Card.svelte'
  import {gameState} from '../../gameStateStore'
  import type {PlacedCard} from '../../gameTypes'
</script>

<div class="max-w-md">
  <h2>discard cards</h2>
  <div class="">
    <div class="m-auto flex w-80 flex-wrap">
      {#each $gameState.playerDiscard as card}
        <div class="m-3 border-2">
          <h2>
            <Card {card} playable={false} />
          </h2>
        </div>
        <hr />
      {/each}
    </div>
  </div>
</div>
