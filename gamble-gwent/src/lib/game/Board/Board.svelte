<script lang="ts">
  import PlayerCards from './playerCards/PlayerCards.svelte'
  import BattleBoard from './battleBoard/BattleBoard.svelte'
  import SidePiles from './sidePiles/SidePiles.svelte'
</script>

<div class="mx-auto flex">
  <div class="">
    <BattleBoard />
    <PlayerCards />
  </div>
  <SidePiles />
</div>
