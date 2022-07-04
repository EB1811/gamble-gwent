<script lang="ts">
  import PlayerCards from './playerCards/PlayerCards.svelte'
  import BattleBoard from './battleBoard/BattleBoard.svelte'
  import SidePiles from './sidePiles/SidePiles.svelte'
</script>

<div class="flex flex-auto">
  <div class="flex-grow justify-center">
    <BattleBoard />
    <PlayerCards />
  </div>
  <SidePiles />
</div>
