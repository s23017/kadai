import React, { useState, useEffect } from 'react'

const BASE_URL = 'https://pokeapi.co/api/v2/'

const Quiz = () => {
  const [pokemonData, setPokemonData] = useState(null)
  const [choices, setChoices] = useState([])
  const [feedback, setFeedback] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [hints, setHints] = useState([])
  const [mistakeCount, setMistakeCount] = useState(0)
  const [pokemonImage, setPokemonImage] = useState(null)
  const [showImage, setShowImage] = useState(false)

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
      const japaneseName = await getPokemonJapaneseName(data.name)
      setCorrectAnswer(japaneseName)
      const choicesIds = generateChoices(data.id)
      const choicesNames = await fetchJapaneseNamesForChoices(choicesIds)
      setChoices(choicesNames)
      setHints([`図鑑ナンバー: ${data.id}`])
      setMistakeCount(0)
      setFeedback('')
      setPokemonImage(data.sprites.front_default)
      setShowImage(false)
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

  const generateChoices = correctAnswerId => {
    const choices = [correctAnswerId]
    while (choices.length < 4) {
      const randomPokemonId = Math.floor(Math.random() * 1025) + 1
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

  const handleSubmit = selectedAnswer => {
    if (selectedAnswer === correctAnswer) {
      setFeedback('正解！')
      setShowImage(true)
    } else {
      setMistakeCount(mistakeCount + 1)
      if (mistakeCount === 0) {
        setFeedback('不正解。')
        setHints([
          ...hints,
          `タイプ: ${pokemonData.types
            .map(type => {
              switch (type.type.name) {
                case 'grass':
                  return 'くさ'
                case 'water':
                  return 'みず'
                case 'fire':
                  return 'ほのお'
                case 'bug':
                  return 'むし'
                case 'normal':
                  return 'ノーマル'
                case 'electric':
                  return 'でんき'
                case 'ice':
                  return 'こおり'
                case 'fighting':
                  return 'かくとう'
                case 'poison':
                  return 'どく'
                case 'ground':
                  return 'じめん'
                case 'flying':
                  return 'ひこう'
                case 'psychic':
                  return 'エスパー'
                case 'rock':
                  return 'いわ'
                case 'ghost':
                  return 'ゴースト'
                case 'dragon':
                  return 'ドラゴン'
                case 'dark':
                  return 'あく'
                case 'steel':
                  return 'はがね'
                case 'fairy':
                  return 'フェアリー'
                default:
                  return type.type.name
              }
            })
            .join(', ')}`
        ])
      } else if (mistakeCount === 1) {
        setFeedback('不正解。')
      } else {
        setFeedback(`不正解。正解は「${correctAnswer}」でした。`)
        setShowImage(true)
      }
    }
  }

  const handleNextQuestion = () => {
    fetchPokemonData()
  }

  const fetchJapaneseNamesForChoices = async choices => {
    const japaneseNames = []
    for (const choiceId of choices) {
      const japaneseName = await getPokemonJapaneseName(choiceId)
      japaneseNames.push(japaneseName)
    }
    return japaneseNames
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
            <button onClick={() => handleSubmit(choice)}>{choice}</button>
          </li>
        ))}
      </ul>
      <p>{feedback}</p>
      <br />
      {showImage && pokemonImage && (
        <div>
          <img src={pokemonImage} alt='ポケモン画像' />
        </div>
      )}
      <br />
      {feedback && <button onClick={handleNextQuestion}>次の問題へ</button>}
    </div>
  )
}

export default Quiz
