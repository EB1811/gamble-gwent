<script lang="ts">
  import {ROUND_STATES} from '../../constants'
  import {gameState} from '../gameStateStore'

  export let playerStrength: number
  export let enemyStrength: number

  let playerTurn: boolean
  $: playerTurn = $gameState.roundState.includes(ROUND_STATES.PLAYER_TURN)
  let roundEnd: boolean
  $: roundEnd = $gameState.roundState === ROUND_STATES.ROUND_END

  export let passRound: () => void
</script>

<div>
  <h2>enemy lives: {2 - $gameState.playerPoints}</h2>
  <h2>enemy strength: {enemyStrength}</h2>
  <h2>enemy cards: {$gameState.enemyHand?.length}</h2>
  <hr class="my-2" />
  <h2>player lives: {2 - $gameState.enemyPoints}</h2>
  <h2>player strength: {playerStrength}</h2>
  <h2>player cards: {$gameState.playerHand?.length}</h2>
  <hr class="my-2" />
  <h1>
    {#if playerTurn}
      player turn
    {:else if roundEnd}
      round finished
    {/if}
  </h1>
  {#if playerTurn || true}
    <button class="mt-2 bg-gray-200 p-2" on:click={passRound}>
      Pass Round
    </button>
  {/if}
</div>
