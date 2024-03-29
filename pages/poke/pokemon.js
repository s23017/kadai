import React, { useState, useEffect } from 'react'
const pokemon = require('pokemon')

const Pokemon = () => {
  const [pokemonData, setPokemonData] = useState(null)

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const randomPokemonId = Math.floor(Math.random() * 1024) + 1
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${randomPokemonId}`
        )
        if (!response.ok) {
          throw new Error('Failed to fetch data')
        }
        const data = await response.json()
        setPokemonData(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchPokemonData()
  }, [])

  return (
    <div>
      <h1>Pokemon</h1>
      {pokemonData && (
        <div>
          <p>Name: {pokemon.getName(pokemonData.id, 'ja')}</p>
          <p>ID: {pokemonData.id}</p>
          <p>
            Types: {pokemonData.types.map(type => type.type.name).join(', ')}
          </p>
        </div>
      )}
    </div>
  )
}

export default Pokemon
