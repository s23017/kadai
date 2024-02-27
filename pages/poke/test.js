import { useState, useEffect } from 'react'

const BASE_URL = 'https://pokeapi.co/api/v2/'

const Pokemon = () => {
  const [pokemonData, setPokemonData] = useState(null)
  const [pokemonId, setPokemonId] = useState('')
  const [japaneseName, setJapaneseName] = useState('')

  useEffect(() => {
    const getPokemonData = async () => {
      try {
        const response = await fetch(`${BASE_URL}pokemon/${pokemonId}`)
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setPokemonData(data)
        const japaneseName = await getPokemonJapaneseName(data.name)
        setJapaneseName(japaneseName)
      } catch (error) {
        console.error('Error fetching Pokemon data:', error)
        setPokemonData(null)
        setJapaneseName('')
      }
    }

    if (pokemonId !== '') {
      getPokemonData()
    } else {
      setPokemonData(null)
      setJapaneseName('')
    }
  }, [pokemonId])

  const handleInputChange = event => {
    setPokemonId(event.target.value)
  }

  const getPokemonJapaneseName = async englishName => {
    try {
      const response = await fetch(`${BASE_URL}pokemon-species/${englishName}`)
      if (!response.ok) {
        throw new Error('Network response was not ok')
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

  return (
    <div>
      <input
        type='text'
        value={pokemonId}
        onChange={handleInputChange}
        placeholder='Enter Pokemon ID'
      />
      {pokemonData ? (
        <div>
          <h1>{pokemonData.name}</h1>
          <p>Japanese Name: {japaneseName}</p>
          <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
          {/* 他のポケモンの情報を表示するコードを追加 */}
        </div>
      ) : pokemonId !== '' ? (
        <p>Loading...</p>
      ) : (
        <p>Please enter a Pokemon ID.</p>
      )}
    </div>
  )
}

export default Pokemon
