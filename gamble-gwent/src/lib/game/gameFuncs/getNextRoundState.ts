import {
  ROUND_STATES,
  ROUND_STATE_ACTION,
  ROUND_STATE_MACHINE
} from '../../constants'

const getNextRoundState = (
  initState: ROUND_STATES,
  action: ROUND_STATE_ACTION
): ROUND_STATES =>
  ROUND_STATE_MACHINE.find(
    state => state.initial === initState && state.action === action
  )?.next ?? initState

export default getNextRoundState
