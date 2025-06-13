import React,{useState, useEffect} from "react";
import axios from "axios";
import MovieCard from "../MovieCard/MovieCard";
const MovieList = () => {
  const [movies,setMovies] = useState([])

  useEffect(() =>{
    const fetchList = async () => {
      const apiToken = import.meta.env.VITE_API_KEY
      try {
        const response = await axios.get(
          
          `https://api.themoviedb.org/3/discover/movie?api_key=${apiToken}` , {
           
        }
        );
        setMovies(response.data.results);
        console.log(response.data.results);
      } catch (err) {
        console.error("Error fetching list: ", err)
      }
    };
    fetchList();
  }, []);
  

  return (
    <>
      <div className="movie-list">
        {movies.map((m) =>(
          <MovieCard
            key={m.id}
            name={m.title}
            movie={m}
          />
        ))}
      </div>
    </>
  );
};
export default MovieList;
    