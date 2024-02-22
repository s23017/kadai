import React, { useState, useEffect } from 'react'
const pokemon = require('pokemon')

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
      const randomPokemonId = Math.floor(Math.random() * 905) + 1
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`
      )
      if (!response.ok) {
        throw new Error('Failed to fetch data')
      }
      const data = await response.json()
      setPokemonData(data)
      setCorrectAnswer(pokemon.getName(data.id, 'ja'))
      setChoices(generateChoices(data.id))
      setHints([`図鑑ナンバー: ${data.id}`])
      setMistakeCount(0)
      setFeedback('')
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const generateChoices = correctAnswerId => {
    const choices = [correctAnswerId]
    while (choices.length < 4) {
      const randomPokemonId = Math.floor(Math.random() * 905) + 1
      if (!choices.includes(randomPokemonId)) {
        choices.push(randomPokemonId)
      }
    }
    return shuffleArray(choices)
  }

  const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  const handleSubmit = selectedAnswerId => {
    const selectedAnswer = pokemon.getName(selectedAnswerId, 'ja')
    if (selectedAnswer === correctAnswer) {
      setFeedback('正解！')
    } else {
      setMistakeCount(mistakeCount + 1)
      if (mistakeCount === 0) {
        setFeedback('不正解。')
        setHints([
          ...hints,
          `タイプ: ${pokemonData.types.map(type => type.type.name).join(', ')}`
        ])
      } else if (mistakeCount === 1) {
        setFeedback('不正解。')
      } else {
        setFeedback(`不正解。正解は「${correctAnswer}」でした。`)
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
      {mistakeCount > 0 && <p>{hints[1]}</p>}
      <ul>
        {choices.map((choice, index) => (
          <li key={index}>
            <button onClick={() => handleSubmit(choice)}>
              {pokemon.getName(choice, 'ja')}
            </button>
          </li>
        ))}
      </ul>
      <p>{feedback}</p>
      <br /> {/* １行開ける */}
      <button onClick={handleNextQuestion}>次の問題へ</button>
    </div>
  )
}

export default Quiz
