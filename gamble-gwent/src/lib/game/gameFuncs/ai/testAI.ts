import getGuidedRandomAIPlay from '../getGuidedRandomAIPlay.js'
import getGuidedAIPlaySimple from './getGuidedAIPlaySimple.js'
import getTrueRandomAIPlay from './getTrueRandomAIPlay.js'
import vsGameSimulation from './vsGameSimulation.js'

// @ts-ignore
const testAI = games => {
  console.log('-----------')

  console.time('calc wins')
  const wins = [...Array(games)].map(() =>
    // vsGameSimulation(getGuidedRandomAIPlay, getTrueRandomAIPlay)
    vsGameSimulation(getGuidedRandomAIPlay, getTrueRandomAIPlay)
  )
  console.timeEnd('calc wins')

  const winArray = wins.map(w => (w === 0 ? 'draw' : w === 1 ? 'ai1' : 'ai2'))
  const statsRaw = winArray.reduce(
    (acc, win) => {
      if (win === 'ai1') return {...acc, ai1: acc.ai1 + 1}
      if (win === 'ai2') return {...acc, ai2: acc.ai2 + 1}
      if (win === 'draw') return {...acc, draw: acc.draw + 1}

      return acc
    },
    {
      ai1: 0,
      ai2: 0,
      draw: 0
    }
  )
  const statsPercent = {
    ai1: ((statsRaw.ai1 / games) * 100).toFixed(2),
    ai2: ((statsRaw.ai2 / games) * 100).toFixed(2),
    draw: ((statsRaw.draw / games) * 100).toFixed(2)
  }

  // console.log(winArray)
  console.log(statsRaw)
  console.log(statsPercent)
}

export default testAI
