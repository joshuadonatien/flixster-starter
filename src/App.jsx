import { useState } from 'react'
import './App.css'
import MovieList from './Components/MovieList/MovieList'
import MovieSearchSort from './Components/MovieSearchSort/MovieSearchSort'
const App = () => {
  return (
    <div className="App">
    <MovieSearchSort/>
    <MovieList/>
    </div>
  )
}

export default App
