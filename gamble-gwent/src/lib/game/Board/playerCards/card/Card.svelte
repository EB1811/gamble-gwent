<script lang="ts">
  import type {DiscardedCard, GameCard} from 'src/lib/game/gameTypes'
  import {battleBoardState} from '../../battleBoard/battleBoardStore'
  import {gameState} from '../../../gameStateStore'
  import {ROUND_STATES} from '../../../../constants'

  export let card: GameCard | DiscardedCard
  export let playable: boolean

  let playerTurn: boolean
  $: playerTurn = $gameState.roundState.includes(ROUND_STATES.PLAYER_TURN)

  const handleDragStart = (e: DragEvent): void => {
    battleBoardState.setPlaceablePosition(
      card.getPlaceablePositions($gameState.boardLayout, 1)
    )
    e.dataTransfer?.setData('cardId', card.id)
  }
  const handleDragEnd = (): void => {
    battleBoardState.setPlaceablePosition([])
  }
</script>

<div
  class="p-2"
  class:cursor-pointer={playerTurn && playable}
  class:bg-amber-100={!card.placedCardTransformation(card, '0').modifiable}
  draggable={playerTurn && playable}
  on:dragstart={handleDragStart}
  on:dragend={handleDragEnd}
>
  <h2>{card.name}</h2>
  <h2>{card.class}</h2>
  {#if card.strength}
    <h2>{card.strength}</h2>
  {/if}
</div>
