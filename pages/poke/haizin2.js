import React, { useState, useEffect } from 'react'

const BASE_URL = 'https://pokeapi.co/api/v2/'

const Quiz = () => {
  const [pokemonData, setPokemonData] = useState(null)
  const [choices, setChoices] = useState([])
  const [feedback, setFeedback] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [hints, setHints] = useState([])
  const [mistakeCount, setMistakeCount] = useState(0)

  useEffect(() => {
    fetchPokemonData()
  }, [])

  const fetchPokemonData = async () => {
    try {
      const randomPokemonId = Math.floor(Math.random() * 1025) + 1
      const response = await fetch(`${BASE_URL}pokemon/${randomPokemonId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const data = await response.json()
      setPokemonData(data)
      const japaneseName = await getPokemonJapaneseName(data.species.name)
      setCorrectAnswer(japaneseName)
      const choicesNames = await fetchJapaneseNamesForChoices(randomPokemonId)
      setChoices(choicesNames)
      setHints([`種族値: ${getStatsString(data.stats)}`])
      setMistakeCount(0)
      setFeedback('')
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const getPokemonJapaneseName = async englishName => {
    try {
      const response = await fetch(`${BASE_URL}pokemon-species/${englishName}`)
      if (!response.ok) {
        throw new Error('Pokemon species data not found')
      }
      const data = await response.json()
      const japaneseNameInfo = data.names.find(
        nameInfo => nameInfo.language.name === 'ja-Hrkt'
      )
      if (!japaneseNameInfo) {
        throw new Error('Japanese name not found')
      }
      return japaneseNameInfo.name
    } catch (error) {
      console.error('Error fetching Japanese name:', error)
      return '日本語名が見つかりません。'
    }
  }

  const fetchJapaneseNamesForChoices = async correctPokemonId => {
    const choices = []
    while (choices.length < 3) {
      const randomPokemonId = Math.floor(Math.random() * 1025) + 1
      if (randomPokemonId !== correctPokemonId) {
        const response = await fetch(`${BASE_URL}pokemon/${randomPokemonId}`)
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        const japaneseName = await getPokemonJapaneseName(data.species.name)
        choices.push(japaneseName)
      }
    }
    const correctPokemonName = await getPokemonJapaneseName(correctPokemonId)
    choices.push(correctPokemonName)
    return shuffleArray(choices)
  }

  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  const getStatsString = stats => {
    const statNames = {
      hp: 'H',
      attack: 'A',
      defense: 'B',
      'special-attack': 'C',
      'special-defense': 'D',
      speed: 'S'
    }
    return stats
      .map(stat => `${statNames[stat.stat.name]}=${stat.base_stat}`)
      .join(', ')
  }

  const handleSubmit = selectedAnswer => {
    if (selectedAnswer === correctAnswer) {
      setFeedback('正解！')
    } else {
      setMistakeCount(mistakeCount + 1)
      if (mistakeCount === 0) {
        setFeedback(' 正解は「' + correctAnswer + '」<<<m9(^Д^)エアプ乙www>>>')
      }
    }
  }

  const handleNextQuestion = () => {
    fetchPokemonData()
  }

  return (
    <div>
      <h1>ポケモンクイズ！</h1>
      <p>このポケモンは何でしょう？</p>
      <p>{hints[0]}</p>
      <ul>
        {choices.map((choice, index) => (
          <li key={index}>
            <button onClick={() => handleSubmit(choice)}>{choice}</button>
          </li>
        ))}
      </ul>
      <p>{feedback}</p>
      <button onClick={handleNextQuestion}>次の問題へ</button>
    </div>
  )
}

export default Quiz
