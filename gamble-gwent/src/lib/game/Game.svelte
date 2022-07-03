<script lang="ts">
  import Board from './Board/Board.svelte'
  import {gameState} from './gameStateStore'
  import tempData from '../tempData.json'
  import type {BoardLayout, GameCard} from './gameTypes'
  import gameCardsMap from './gameCardsMap'
  import type {Card} from '../types'
  import SideInfo from './sideInfo/SideInfo.svelte'
  import {ROUND_STATES, ROUND_STATE_ACTION} from '../constants'
  import getPlayerStrength from './gameFuncs/getPlayerStrength'
  import getRandomAIPlay, {AIPlay} from './gameFuncs/getRandomAIPlay'

  const defaultBoardLayout = tempData.StandardBoardLayout as BoardLayout
  const defaultCards: GameCard[] = tempData.cards.map(card =>
    gameCardsMap.get(card.id)!(card as Card)
  )

  const aiPlay = () => {
    console.log('ENEMY TURN --->', $gameState, playerStrength, enemyStrength)
    const {
      action,
      card: enemyCard,
      positionId
    }: AIPlay = getRandomAIPlay(
      2,
      $gameState.boardLayout,
      $gameState.enemyHand ?? [],
      {
        roundState: $gameState.roundState,
        playerStrength,
        aiStrength: enemyStrength
      }
    )
    console.log('ENEMY PLAY --->', action, enemyCard, positionId)

    if (action === ROUND_STATE_ACTION.passTurn) passRound()
    else if (
      action === ROUND_STATE_ACTION.nextTurn &&
      enemyCard &&
      positionId
    ) {
      gameState.aiPlayCard(enemyCard, positionId)
      gameState.endTurn()
    }
  }
  // setTimeout circular dependency hack https://stackoverflow.com/questions/66743205/svelte-reactive-statement-not-working
  $: $gameState.roundState.includes(ROUND_STATES.ENEMY_TURN) &&
    setTimeout(() => aiPlay(), Math.random() * 1000)

  let gameRunning: boolean
  $: gameRunning = $gameState.playerPoints < 2 && $gameState.enemyPoints < 2

  let playerStrength: number
  $: playerStrength = getPlayerStrength(
    $gameState.boardLayout,
    $gameState.boardCards,
    1
  )
  let enemyStrength: number
  $: enemyStrength = getPlayerStrength(
    $gameState.boardLayout,
    $gameState.boardCards,
    2
  )

  const startGame = () => {
    gameState.initLocalGame(
      defaultCards.slice(),
      defaultCards.slice(),
      defaultBoardLayout
    )
    gameState.initRandomPlayerHand(6)
    gameState.initRandomEnemyHand(6)
    gameState.initRandomTurn()
  }

  const passRound = (): void => {
    gameState.passRound()

    if ($gameState.roundState === ROUND_STATES.ROUND_END) {
      setTimeout(() => {
        console.log('next round')
        if (playerStrength > enemyStrength) gameState.playerRoundWinner()
        if (playerStrength < enemyStrength) gameState.aiRoundWinner()
        if (playerStrength === enemyStrength) gameState.roundDraw()

        if ($gameState.playerPoints < 2 || $gameState.enemyPoints < 2) {
          gameState.startRound()
          gameState.initRandomTurn()
        }
      }, 4000)
    }

    console.log('post-state', $gameState)
  }
</script>

<div>
  <div>
    <button on:click={startGame}> Init Game </button>
    <h2>{$gameState.roundState}</h2>
  </div>
  <hr class="m-5" />
  {#if gameRunning}
    <div class="container mx-auto flex">
      <SideInfo {passRound} {playerStrength} {enemyStrength} />
      <Board />
    </div>
  {:else}
    <div class="m-3">
      <h1>Game Over</h1>
      {#if $gameState.playerPoints > $gameState.enemyPoints}
        <h2>Player Winner</h2>
      {:else if $gameState.playerPoints < $gameState.enemyPoints}
        <h2>Enemy Winner</h2>
      {:else}
        <h2>Draw!</h2>
      {/if}
    </div>
  {/if}
</div>
