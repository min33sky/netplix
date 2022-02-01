import axios from 'axios';
import { IAllMovie } from '../types/movie';

const BASE_PATH = `https://api.themoviedb.org/3`;

export async function getMovies() {
  const { data } = await axios.get<IAllMovie>(
    `${BASE_PATH}/movie/now_playing?api_key=${process.env.REACT_APP_API_KEY}&language=ko&page=1`
  );

  return data;
}
