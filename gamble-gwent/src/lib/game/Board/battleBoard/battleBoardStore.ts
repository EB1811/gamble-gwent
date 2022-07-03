import {writable} from 'svelte/store'

type BattleBoardState = {
  placeablePosition: readonly string[]
}

const createBattleBoardState = () => {
  const defaultState: BattleBoardState = {
    placeablePosition: []
  }

  const {subscribe, update} = writable(defaultState as BattleBoardState)

  return {
    subscribe,
    setPlaceablePosition: (placeablePosition: readonly string[]) => {
      update((state: BattleBoardState) => ({...state, placeablePosition}))
    }
  }
}

export const battleBoardState = createBattleBoardState()
