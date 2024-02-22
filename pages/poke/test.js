import { useState, useEffect } from 'react'

const Pokemon = () => {
  const [pokemonData, setPokemonData] = useState(null)
  const [pokemonId, setPokemonId] = useState('') // デフォルトのポケモンID

  useEffect(() => {
    const getPokemonData = async () => {
      try {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
        )
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const data = await response.json()
        setPokemonData(data)
      } catch (error) {
        console.error('Error fetching Pokemon data:', error)
      }
    }

    if (pokemonId !== '') {
      getPokemonData()
    } else {
      setPokemonData(null)
    }
  }, [pokemonId])

  const handleInputChange = event => {
    setPokemonId(event.target.value)
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
          <img src={pokemonData.sprites.front_default} alt={pokemonData.name} />
          {/* 他のポケモンの情報を表示するコードを追加 */}
        </div>
      ) : pokemonId !== '' ? (
        <p>Loading...</p>
      ) : (
        <p>1~1025までの番号を入れろ</p>
      )}
    </div>
  )
}

export default Pokemon
